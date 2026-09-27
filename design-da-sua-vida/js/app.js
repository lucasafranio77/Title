/*
 * O Design da Sua Vida – app principal, sem dependências.
 * Os dados ficam no navegador (localStorage) e, quando o app roda como
 * Artifact do Claude, também na conta da pessoa (capability "db").
 */
(function () {
  var STORAGE_KEY = "design-da-sua-vida:v1";
  var SETTINGS_KEY = "design-da-sua-vida:settings";
  var STEPS = window.STEPS;
  var AI = window.AI;
  var esc = AI.esc;

  // ---------- Estado ----------

  function emptyState() {
    return { version: 1, fields: {}, done: {}, actions: [], chat: [], updatedAt: null };
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }

  function loadState() {
    var raw = safeGet(STORAGE_KEY);
    if (!raw) return emptyState();
    try {
      var s = JSON.parse(raw);
      return Object.assign(emptyState(), s);
    } catch (e) {
      return emptyState();
    }
  }

  function loadSettings() {
    try { return Object.assign({ apiKey: "", model: AI.MODELS[0].id }, JSON.parse(safeGet(SETTINGS_KEY) || "{}")); }
    catch (e) { return { apiKey: "", model: AI.MODELS[0].id }; }
  }

  var state = loadState();
  var settings = loadSettings();
  var saveTimer = null;

  function save(immediate) {
    state.updatedAt = new Date().toISOString();
    clearTimeout(saveTimer);
    var doSave = function () {
      var ok = safeSet(STORAGE_KEY, JSON.stringify(state));
      flashSaved(ok || !!remote);
      scheduleRemotePush();
    };
    if (immediate) doSave(); else saveTimer = setTimeout(doSave, 400);
  }

  // ---------- Salvamento na conta (quando roda como Artifact) ----------

  // O estado é dividido em documentos menores (cada um tem limite de tamanho).
  var PARTS = ["caderno", "diario", "tarefas", "conversa"];
  var remote = null; // { db, base }
  var lastWritten = {};
  var remoteTimer = null;
  var writing = false;
  var writeAgain = false;
  var remoteErrorShown = false;

  function capability(name) {
    if (!window.claude || typeof window.claude.use !== "function") return Promise.resolve(null);
    return window.claude.use(name).catch(function () { return null; });
  }

  function splitState(s) {
    var fields = Object.assign({}, s.fields);
    var diario = fields.d_registros || [];
    delete fields.d_registros;
    return {
      caderno: { fields: fields, done: s.done },
      diario: { rows: diario },
      tarefas: { actions: s.actions },
      conversa: { chat: s.chat.slice(-40) }
    };
  }

  function hasAnyData(s) {
    return Object.keys(s.fields).length > 0 || s.actions.length > 0 || s.chat.length > 0;
  }

  async function connectRemote() {
    var caps = await Promise.all([capability("db"), capability("user")]);
    var db = caps[0], user = caps[1];
    if (!db || !user) return;
    var id = await user.id().catch(function () { return null; });
    if (!id) return;
    var base = "data/users/" + id + "/";
    var snaps;
    try {
      snaps = await Promise.all(PARTS.map(function (p) { return db.doc(base + p).get(); }));
    } catch (e) {
      return;
    }
    remote = { db: db, base: base };
    var cad = snaps[0];
    var remoteData = {};
    snaps.forEach(function (snap, i) { if (snap.exists) remoteData[PARTS[i]] = JSON.parse(JSON.stringify(snap.data())); });
    var remoteNewer = cad.exists && (!state.updatedAt || (remoteData.caderno.updatedAt || "") > state.updatedAt);
    if (remoteNewer) {
      var r = remoteData;
      var fields = Object.assign({}, r.caderno.fields || {});
      if (r.diario) fields.d_registros = r.diario.rows || [];
      state = Object.assign(emptyState(), {
        fields: fields,
        done: r.caderno.done || {},
        actions: (r.tarefas && r.tarefas.actions) || [],
        chat: (r.conversa && r.conversa.chat) || [],
        updatedAt: r.caderno.updatedAt
      });
      safeSet(STORAGE_KEY, JSON.stringify(state));
      var parts = splitState(state);
      PARTS.forEach(function (p) { if (r[p]) lastWritten[p] = JSON.stringify(parts[p]); });
      rerenderKeepingScroll();
    } else if (hasAnyData(state)) {
      pushRemote();
    }
    updateStorageNote();
  }

  function scheduleRemotePush() {
    if (!remote) return;
    clearTimeout(remoteTimer);
    remoteTimer = setTimeout(pushRemote, 1200);
  }

  // Grava só as partes que mudaram, uma escrita de cada vez.
  async function pushRemote() {
    if (!remote) return;
    if (writing) { writeAgain = true; return; }
    writing = true;
    try {
      var parts = splitState(state);
      var changed = PARTS.filter(function (p) { return lastWritten[p] !== JSON.stringify(parts[p]); });
      if (changed.length && changed.indexOf("caderno") < 0) changed.unshift("caderno");
      for (var i = 0; i < changed.length; i++) {
        var p = changed[i];
        var json = JSON.stringify(parts[p]);
        await remote.db.doc(remote.base + p).set(Object.assign({ updatedAt: state.updatedAt }, parts[p]));
        lastWritten[p] = json;
      }
    } catch (e) {
      if (!remoteErrorShown) {
        remoteErrorShown = true;
        toast(e && e.code === "invalid_argument"
          ? "Não foi possível salvar na sua conta (dados grandes demais ou sem permissão). Seus dados continuam salvos neste navegador."
          : "Não foi possível salvar na sua conta agora. Seus dados continuam salvos neste navegador.", true);
      }
    } finally {
      writing = false;
      if (writeAgain) { writeAgain = false; pushRemote(); }
    }
  }

  function updateStorageNote() {
    var el = document.getElementById("storage-note");
    if (el) el.textContent = remote
      ? "Seus dados ficam salvos na sua conta Claude, visíveis só para você, e também neste navegador."
      : "Seus dados ficam salvos só neste navegador. Exporte um backup de vez em quando.";
  }

  function flashSaved(ok) {
    var el = document.getElementById("save-status");
    if (!el) return;
    el.textContent = ok ? (remote ? "Salvo na sua conta ✓" : "Salvo ✓") : "Não foi possível salvar neste navegador";
    el.classList.toggle("error", !ok);
    el.classList.add("show");
    clearTimeout(flashSaved._t);
    flashSaved._t = setTimeout(function () { el.classList.remove("show"); }, 1500);
  }

  function uid() { return Math.random().toString(36).slice(2, 10); }
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] : iso;
  }

  // ---------- Progresso ----------

  function allFields(step) {
    var list = [];
    step.sections.forEach(function (s) { s.fields.forEach(function (f) { list.push(f); }); });
    return list;
  }

  function stepProgress(step) {
    var fields = allFields(step);
    var filled = fields.filter(function (f) { return AI.isFilled(state.fields[f.id]); }).length;
    return fields.length ? Math.round((filled / fields.length) * 100) : 0;
  }

  function overallProgress() {
    var total = 0;
    STEPS.forEach(function (s) { total += state.done[s.id] ? 100 : stepProgress(s); });
    return Math.round(total / STEPS.length);
  }

  // ---------- Roteamento ----------

  function currentRoute() {
    var h = location.hash.replace(/^#\/?/, "");
    if (!h || h === "inicio") return { view: "inicio" };
    if (h === "ia") return { view: "ia" };
    var m = h.match(/^etapa-(.+)$/);
    if (m && STEPS.some(function (s) { return s.id === m[1]; })) return { view: "etapa", id: m[1] };
    return { view: "inicio" };
  }

  function go(hash) {
    if (location.hash === hash) render(); else location.hash = hash;
  }

  // ---------- Renderização geral ----------

  function render() {
    var route = currentRoute();
    renderNav(route);
    var main = document.getElementById("main");
    if (route.view === "inicio") main.innerHTML = renderHome();
    else if (route.view === "ia") main.innerHTML = renderAI();
    else main.innerHTML = renderStep(STEPS.find(function (s) { return s.id === route.id; }));
    if (route.view === "ia") scrollChatToEnd();
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    document.body.classList.remove("nav-open");
    // Entrada da página só na troca de tela (não a cada re-renderização).
    main.classList.remove("page-enter");
    void main.offsetWidth;
    main.classList.add("page-enter");
    clearTimeout(render._t);
    render._t = setTimeout(function () { main.classList.remove("page-enter"); }, 1200);
  }

  // Cabeçalho com texto à esquerda e ilustração animada à direita.
  function pageHead(inner, illId) {
    var ill = window.ILLUSTRATIONS && window.ILLUSTRATIONS[illId];
    if (!ill) return '<header class="page-head">' + inner + "</header>";
    return '<header class="page-head with-ill"><div class="head-text">' + inner + "</div>" +
      '<figure class="ill" data-id="' + illId + '"><div class="ill-art">' + ill.svg + "</div>" +
      "<figcaption><span>" + esc(ill.caption) + '</span><button type="button" class="ill-replay" data-action="replay-ill" aria-label="Ver a animação de novo" title="Ver de novo">↻</button></figcaption></figure></header>';
  }

  function renderNav(route) {
    var items = [];
    items.push(navItem("#inicio", "⌂", "Início", "Painel e dia a dia", route.view === "inicio", null));
    STEPS.forEach(function (s) {
      var p = state.done[s.id] ? 100 : stepProgress(s);
      items.push(navItem("#etapa-" + s.id, String(s.num), s.title, s.short, route.view === "etapa" && route.id === s.id, p, state.done[s.id]));
    });
    items.push(navItem("#ia", "✦", "Avaliação com IA", "Avaliar e colocar em prática", route.view === "ia", null));
    document.getElementById("nav-list").innerHTML = items.join("");
    var op = overallProgress();
    document.getElementById("overall").innerHTML =
      '<div class="overall-label"><span>Progresso geral</span><strong>' + op + "%</strong></div>" +
      '<div class="bar"><span style="width:' + op + '%"></span></div>';
  }

  function navItem(href, badge, title, sub, active, progress, done) {
    var ring = "";
    if (progress !== null && progress !== undefined) {
      ring = '<span class="nav-progress' + (done ? " done" : "") + '" style="--p:' + progress + '" title="' + progress + '% preenchido">' + (done ? "✓" : "") + "</span>";
    }
    return '<li><a href="' + href + '" class="nav-item' + (active ? " active" : "") + '"' + (active ? ' aria-current="page"' : "") + ">" +
      '<span class="nav-badge">' + badge + "</span>" +
      '<span class="nav-text"><span class="nav-title">' + esc(title) + '</span><span class="nav-sub">' + esc(sub) + "</span></span>" +
      ring + "</a></li>";
  }

  // ---------- Início ----------

  function renderHome() {
    var op = overallProgress();
    var nextStep = STEPS.find(function (s) { return !state.done[s.id]; });
    var html = [];
    html.push(pageHead('<p class="eyebrow">Baseado no livro de Bill Burnett e Dave Evans</p>' +
      "<h1>O Design da Sua Vida</h1>" +
      '<p class="lead">Um caderno de trabalho para aplicar o método no seu dia a dia. Preencha as etapas no seu ritmo (tudo fica salvo automaticamente) e, no final, use a IA para avaliar suas respostas e transformar tudo em um plano prático.</p>', "inicio"));

    html.push('<section class="card how-card"><h2>Como usar</h2><ol class="how-list">' +
      "<li><strong>Siga as etapas de 1 a 10.</strong> Cada uma tem uma explicação, um passo a passo, exemplos e dúvidas frequentes. Não precisa fazer tudo de uma vez.</li>" +
      "<li><strong>Use no dia a dia:</strong> o <em>Diário dos bons momentos</em> e o <em>Registro de fracassos</em> são para preencher com frequência — você pode registrar direto aqui nesta página.</li>" +
      "<li><strong>Finalize com a IA:</strong> a etapa <em>Avaliação com IA</em> lê tudo o que você escreveu, aponta padrões e cria um plano de ação com tarefas.</li>" +
      "<li><strong>Revise toda semana:</strong> marque suas tarefas, registre o diário e peça uma revisão semanal para a IA.</li>" +
      "</ol>" +
      (nextStep ? '<a class="btn primary" href="#etapa-' + nextStep.id + '">' + (op ? "Continuar" : "Começar") + ": Etapa " + nextStep.num + " – " + esc(nextStep.title) + " →</a>"
        : '<a class="btn primary" href="#ia">Todas as etapas concluídas — ir para a Avaliação com IA →</a>') +
      "</section>");

    // Registro rápido do diário
    html.push('<section class="card"><h2>Registro rápido do dia</h2>' +
      '<p class="muted">Anote uma atividade de hoje no Diário dos bons momentos.</p>' +
      '<form class="quick-form" data-action="quick-journal">' +
      '<label class="qf-wide"><span>Atividade</span><input name="atividade" required placeholder="Ex.: Reunião de planejamento com o time"></label>' +
      '<label><span>Engajamento (0–10)</span><input name="engajamento" type="number" min="0" max="10" required></label>' +
      '<label><span>Energia (-5 a +5)</span><input name="energia" type="number" min="-5" max="5" required></label>' +
      '<label class="qf-wide"><span>Por quê?</span><input name="obs" placeholder="Opcional"></label>' +
      '<button class="btn primary" type="submit">Registrar</button></form>' +
      renderJournalSummary() + "</section>");

    // Painel da vida
    var gauges = [["Saúde", "p_saude"], ["Trabalho", "p_trabalho"], ["Diversão", "p_diversao"], ["Amor", "p_amor"]];
    var hasGauges = gauges.some(function (g) { return AI.isFilled(state.fields[g[1]]); });
    html.push('<section class="card"><h2>Seu painel</h2>' +
      (hasGauges
        ? '<div class="gauges">' + gauges.map(function (g) {
            var v = Number(state.fields[g[1]] || 0);
            return '<div class="gauge"><div class="gauge-track"><span style="height:' + v * 10 + '%"></span></div><strong>' + v + "</strong><span>" + g[0] + "</span></div>";
          }).join("") + "</div>"
        : '<p class="muted">Preencha a <a href="#etapa-painel">Etapa 2 – Onde você está</a> para ver seu painel aqui.</p>') +
      "</section>");

    // Tarefas
    html.push('<section class="card"><h2>Minhas tarefas</h2>' + renderActions(true) + "</section>");

    // Etapas
    html.push('<section class="card"><h2>Etapas</h2><div class="step-grid">' + STEPS.map(function (s) {
      var p = state.done[s.id] ? 100 : stepProgress(s);
      return '<a class="step-card" href="#etapa-' + s.id + '"><span class="step-num">' + s.num + "</span>" +
        '<span class="step-card-body"><strong>' + esc(s.title) + '</strong><span class="muted">' + esc(s.short) + "</span>" +
        '<span class="bar small"><span style="width:' + p + '%"></span></span></span>' +
        (state.done[s.id] ? '<span class="chip ok">Concluída</span>' : s.daily ? '<span class="chip">Dia a dia</span>' : "") + "</a>";
    }).join("") + "</div></section>");

    return html.join("");
  }

  function renderJournalSummary() {
    var rows = (state.fields.d_registros || []).filter(function (r) { return r.atividade; });
    if (!rows.length) return "";
    var recent = rows.slice().sort(function (a, b) { return (b.data || "").localeCompare(a.data || ""); }).slice(0, 5);
    return '<div class="journal-summary"><h3>Últimos registros <span class="muted">(' + rows.length + ' no total · <a href="#etapa-diario">ver todos</a>)</span></h3><ul>' +
      recent.map(function (r) {
        return "<li><span class=\"muted\">" + esc(fmtDate(r.data)) + "</span> " + esc(r.atividade) +
          ' <span class="pill">E ' + esc(String(r.engajamento ?? "–")) + "</span>" +
          ' <span class="pill ' + energyClass(r.energia) + '">⚡ ' + esc(String(r.energia ?? "–")) + "</span></li>";
      }).join("") + "</ul></div>";
  }

  function energyClass(v) {
    var n = Number(v);
    if (v === "" || v === undefined || isNaN(n)) return "";
    return n > 0 ? "pos" : n < 0 ? "neg" : "";
  }

  // ---------- Tarefas (plano de ação) ----------

  function renderActions(compact) {
    var acts = state.actions;
    var pending = acts.filter(function (a) { return !a.done; });
    var doneList = acts.filter(function (a) { return a.done; });
    var list = compact ? pending : pending.concat(doneList);
    var html = "";
    if (!acts.length) {
      html += '<p class="muted">Nenhuma tarefa ainda. Adicione abaixo ou gere um plano na <a href="#ia">Avaliação com IA</a>.</p>';
    } else if (compact && !pending.length) {
      html += '<p class="muted">Todas as tarefas concluídas 🎉</p>';
    }
    if (list.length) {
      html += '<ul class="actions">' + list.map(function (a) {
        return '<li class="action' + (a.done ? " done" : "") + '" data-id="' + a.id + '">' +
          '<label class="check"><input type="checkbox" data-action="toggle-task"' + (a.done ? " checked" : "") + '><span>' + esc(a.text) + "</span></label>" +
          (a.due ? '<span class="pill">' + esc(fmtDate(a.due)) + "</span>" : "") +
          '<button class="icon-btn" data-action="delete-task" aria-label="Excluir tarefa" title="Excluir">×</button></li>';
      }).join("") + "</ul>";
    }
    if (compact && doneList.length) html += '<p class="muted small">' + doneList.length + " concluída(s) · <a href=\"#ia\">ver plano completo</a></p>";
    html += '<form class="task-form" data-action="add-task"><input name="text" required placeholder="Nova tarefa…" aria-label="Nova tarefa">' +
      '<input name="due" type="date" aria-label="Prazo"><button class="btn" type="submit">Adicionar</button></form>';
    return '<div class="actions-wrap">' + html + "</div>";
  }

  // ---------- Etapa ----------

  function renderStep(step) {
    var idx = STEPS.indexOf(step);
    var prev = STEPS[idx - 1];
    var next = STEPS[idx + 1];
    var p = stepProgress(step);
    var html = [];
    html.push(pageHead('<p class="eyebrow">Etapa ' + step.num + " de " + STEPS.length + " · " + esc(step.chapter) + "</p>" +
      "<h1>" + esc(step.title) + "</h1>" +
      '<p class="lead">' + esc(step.short) + "</p>" +
      '<div class="bar"><span style="width:' + p + '%"></span></div><p class="muted small">' + p + "% dos campos preenchidos" + (state.done[step.id] ? " · ✓ etapa concluída" : "") + "</p>", step.id));

    var saved = helpOpenState[step.id];
    var helpOpen = saved !== undefined ? saved : !AI.isFilled(stepFirstValue(step));
    html.push('<details class="card help" data-step="' + step.id + '"' + (helpOpen ? " open" : "") + '><summary><span class="help-icon">?</span> Entenda esta etapa e como preencher</summary>' +
      '<div class="help-body">' +
      '<div class="help-intro">' + step.intro + "</div>" +
      '<h3>Passo a passo</h3><ol class="how-list">' + step.how.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ol>" +
      '<h3>Exemplo</h3><div class="example">' + step.example + "</div>" +
      '<h3>Dúvidas frequentes</h3><div class="faq">' + step.faq.map(function (f) {
        return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>";
      }).join("") + "</div>" +
      '<div class="ask-box"><h3>Ainda com dúvida? Pergunte à IA</h3>' +
      '<p class="muted small">A IA conhece o método do livro e vê o que você já escreveu nesta etapa.</p>' +
      '<form data-action="ask-step" data-step="' + step.id + '"><textarea name="q" rows="2" required placeholder="Ex.: Não sei se o que escrevi é uma visão de trabalho ou a descrição do meu emprego. Pode me ajudar?"></textarea>' +
      '<button class="btn" type="submit">Perguntar</button></form><div class="ask-answer" id="ask-answer"></div></div>' +
      "</div></details>");

    step.sections.forEach(function (sec) {
      html.push('<section class="card fields"><h2>' + esc(sec.title) + "</h2>" + (sec.hint ? '<p class="section-hint">' + esc(sec.hint) + "</p>" : "") +
        sec.fields.map(renderField).join("") + "</section>");
    });

    html.push('<div class="step-footer">' +
      '<label class="check done-toggle"><input type="checkbox" data-action="toggle-done" data-step="' + step.id + '"' + (state.done[step.id] ? " checked" : "") + "><span>Marcar etapa como concluída</span></label>" +
      '<div class="step-nav">' +
      (prev ? '<a class="btn" href="#etapa-' + prev.id + '">← ' + esc(prev.title) + "</a>" : '<a class="btn" href="#inicio">← Início</a>') +
      (next ? '<a class="btn primary" href="#etapa-' + next.id + '">' + esc(next.title) + " →</a>" : '<a class="btn primary" href="#ia">Avaliação com IA →</a>') +
      "</div></div>");
    return html.join("");
  }

  function stepFirstValue(step) {
    var fields = allFields(step);
    for (var i = 0; i < fields.length; i++) if (AI.isFilled(state.fields[fields[i].id])) return state.fields[fields[i].id];
    return null;
  }

  function renderField(f) {
    var v = state.fields[f.id];
    var id = "f-" + f.id;
    var hint = f.hint ? '<span class="hint">' + esc(f.hint) + "</span>" : "";
    if (f.type === "range") {
      var has = v !== undefined && v !== "";
      return '<div class="field range-field"><label for="' + id + '">' + esc(f.label) + "</label>" + hint +
        '<div class="range-row"><input type="range" id="' + id + '" data-field="' + f.id + '" min="' + f.min + '" max="' + f.max + '" step="1" value="' + (has ? v : Math.round((f.min + f.max) / 2)) + '"' + (has ? "" : ' class="unset"') + ">" +
        '<output for="' + id + '">' + (has ? v : "–") + "</output></div></div>";
    }
    if (f.type === "select") {
      return '<div class="field"><label for="' + id + '">' + esc(f.label) + "</label>" + hint +
        '<select id="' + id + '" data-field="' + f.id + '">' + f.options.map(function (o) {
          return '<option value="' + esc(o) + '"' + (v === o ? " selected" : "") + ">" + (o ? esc(o) : "Selecione…") + "</option>";
        }).join("") + "</select></div>";
    }
    if (f.type === "text") {
      return '<div class="field"><label for="' + id + '">' + esc(f.label) + "</label>" + hint +
        '<input type="text" id="' + id + '" data-field="' + f.id + '" value="' + esc(v || "") + '" placeholder="' + esc(f.placeholder || "") + '">' +
        (f.maxWords ? '<span class="counter" data-counter="' + f.id + '">' + wordCounter(v, f.maxWords, true) + "</span>" : "") + "</div>";
    }
    if (f.type === "textarea") {
      return '<div class="field"><label for="' + id + '">' + esc(f.label) + "</label>" + hint +
        '<textarea id="' + id + '" data-field="' + f.id + '" rows="' + (f.rows || 4) + '" placeholder="' + esc(f.placeholder || "") + '">' + esc(v || "") + "</textarea>" +
        (f.words ? '<span class="counter" data-counter="' + f.id + '">' + wordCounter(v, f.words) + "</span>" : "") + "</div>";
    }
    if (f.type === "list") return renderList(f);
    return "";
  }

  function countWords(v) { return String(v || "").trim().split(/\s+/).filter(Boolean).length; }
  function wordCounter(v, target, isMax) {
    var n = countWords(v);
    if (isMax) return n + "/" + target + " palavras" + (n > target ? " — tente encurtar" : "");
    return n + " palavras · sugestão: ~" + target;
  }

  function renderList(f) {
    var rows = state.fields[f.id] || [];
    var ordered = rows.slice();
    if (f.newestFirst) ordered.sort(function (a, b) { return (b.data || "").localeCompare(a.data || ""); });
    var head = f.columns.map(function (c) { return '<th class="' + (c.wide ? "wide" : "") + '">' + esc(c.label) + "</th>"; }).join("");
    var body = ordered.map(function (row) {
      return '<tr data-row="' + row._id + '">' + f.columns.map(function (c) {
        return '<td data-label="' + esc(c.label) + '" class="' + (c.wide ? "wide" : "") + '">' + cellInput(f, c, row) + "</td>";
      }).join("") + '<td class="row-actions"><button class="icon-btn" data-action="delete-row" data-list="' + f.id + '" aria-label="Excluir linha" title="Excluir">×</button></td></tr>';
    }).join("");
    var highlight = f.id === "d_registros" ? '<div class="hl-wrap">' + renderJournalHighlights(rows) + "</div>" : "";
    return '<div class="field list-field">' +
      (rows.length ? '<div class="table-wrap"><table class="list-table"><thead><tr>' + head + "<th></th></tr></thead><tbody>" + body + "</tbody></table></div>"
        : '<p class="muted empty">Nenhum item ainda.</p>') +
      '<button class="btn" type="button" data-action="add-row" data-list="' + f.id + '">' + esc(f.addLabel || "+ Adicionar") + "</button>" +
      highlight + "</div>";
  }

  function cellInput(f, c, row) {
    var v = row[c.id] === undefined ? "" : row[c.id];
    var attrs = ' data-list="' + f.id + '" data-col="' + c.id + '" aria-label="' + esc(c.label) + '"';
    if (c.type === "select") {
      return "<select" + attrs + ">" + c.options.map(function (o) {
        return '<option value="' + esc(o) + '"' + (String(v) === o ? " selected" : "") + ">" + (o ? esc(o) : "—") + "</option>";
      }).join("") + "</select>";
    }
    if (c.type === "number") return '<input type="number"' + attrs + ' min="' + c.min + '" max="' + c.max + '" value="' + esc(String(v)) + '">';
    if (c.type === "date") return '<input type="date"' + attrs + ' value="' + esc(String(v)) + '">';
    return '<input type="text"' + attrs + ' value="' + esc(String(v)) + '">';
  }

  function renderJournalHighlights(rows) {
    var valid = rows.filter(function (r) { return r.atividade && r.engajamento !== "" && r.energia !== "" && r.engajamento !== undefined && r.energia !== undefined; });
    if (valid.length < 3) return valid.length ? '<p class="muted small">Com pelo menos 3 registros completos, os destaques aparecem aqui.</p>' : "";
    var score = function (r) { return Number(r.engajamento) + Number(r.energia) * 2; };
    var sorted = valid.slice().sort(function (a, b) { return score(b) - score(a); });
    var n = Math.min(3, Math.floor(sorted.length / 2));
    var top = sorted.slice(0, n);
    var bottom = sorted.slice(-n).reverse();
    var avgE = valid.reduce(function (s, r) { return s + Number(r.engajamento); }, 0) / valid.length;
    var avgN = valid.reduce(function (s, r) { return s + Number(r.energia); }, 0) / valid.length;
    var li = function (r) { return "<li>" + esc(r.atividade) + ' <span class="pill">E ' + esc(String(r.engajamento)) + '</span> <span class="pill ' + energyClass(r.energia) + '">⚡ ' + esc(String(r.energia)) + "</span></li>"; };
    return '<div class="highlights"><div><h4>⬆ Mais energia e engajamento</h4><ul>' + top.map(li).join("") + "</ul></div>" +
      "<div><h4>⬇ Menos energia e engajamento</h4><ul>" + bottom.map(li).join("") + "</ul></div>" +
      '<p class="muted small">Média: engajamento ' + avgE.toFixed(1) + " · energia " + (avgN > 0 ? "+" : "") + avgN.toFixed(1) + " · " + valid.length + " registros</p></div>";
  }

  // ---------- Avaliação com IA ----------

  function renderAI() {
    var html = [];
    var incomplete = STEPS.filter(function (s) { return !state.done[s.id] && stepProgress(s) < 50; });
    html.push(pageHead('<p class="eyebrow">Etapa final</p><h1>Avaliação com IA</h1>' +
      '<p class="lead">Depois de preencher as etapas, converse com a IA para avaliar o que você escreveu, enxergar padrões e transformar tudo em ações concretas no seu dia a dia.</p>', "ia"));

    html.push('<details class="card help"' + (state.chat.length ? "" : " open") + '><summary><span class="help-icon">?</span> Como funciona esta etapa</summary><div class="help-body">' +
      "<ol class=\"how-list\">" +
      "<li><strong>Escolha um tipo de ajuda</strong> abaixo (comece pela <em>Avaliação completa</em>) ou escreva sua própria pergunta.</li>" +
      "<li>A IA lê <strong>tudo o que você preencheu</strong> nas etapas e responde como um coach do método do livro.</li>" +
      "<li>Quando ela sugerir ações no formato <code>☐ tarefa</code>, clique em <strong>“Adicionar ao meu plano”</strong> para virarem tarefas com checkbox.</li>" +
      "<li>Continue a conversa: peça para detalhar, simplificar, ou para ajudar com uma tarefa específica.</li>" +
      "<li>Volte toda semana para a <strong>Revisão semanal</strong> — a IA sempre vê seus dados mais recentes.</li>" +
      "</ol>" +
      (AI.hasSample()
        ? '<p class="muted small">A IA usa a sua conta Claude. Na primeira vez, o Claude pede sua autorização.</p>'
        : '<p class="muted small">Para usar a IA diretamente aqui, você precisa de uma chave da API da Anthropic (em ⚙️ Configurações). ' +
          "Sem chave? Use o botão <strong>“Copiar para usar no Claude.ai”</strong>: ele copia o pedido com todos os seus dados para você colar numa conversa em claude.ai.</p>") +
      "</div></details>");

    if (incomplete.length) {
      html.push('<div class="notice">Algumas etapas ainda estão com pouco conteúdo: ' + incomplete.map(function (s) {
        return '<a href="#etapa-' + s.id + '">' + s.num + ". " + esc(s.title) + "</a>";
      }).join(", ") + ". A IA consegue ajudar mesmo assim, mas a avaliação fica melhor quanto mais você preencher.</div>");
    }

    html.push('<section class="card"><h2>O que você quer fazer?</h2><div class="mode-grid">' + AI.MODES.map(function (m) {
      return '<div class="mode"><strong>' + esc(m.label) + '</strong><span class="muted">' + esc(m.desc) + "</span>" +
        '<div class="mode-actions"><button class="btn primary small" data-action="run-mode" data-mode="' + m.id + '">Pedir à IA</button>' +
        (AI.hasSample() ? "" : '<button class="btn small ghost" data-action="copy-mode" data-mode="' + m.id + '" title="Copia o pedido com seus dados para colar em claude.ai">Copiar para usar no Claude.ai</button>') + "</div></div>";
    }).join("") + "</div></section>");

    html.push('<section class="card chat-card"><div class="chat-head"><h2>Conversa</h2>' +
      (state.chat.length ? '<button class="btn small ghost" data-action="clear-chat">Nova conversa</button>' : "") + "</div>" +
      '<div class="chat" id="chat">' + (state.chat.length ? state.chat.map(renderMsg).join("") : '<p class="muted">Escolha uma opção acima ou escreva sua mensagem abaixo para começar.</p>') + "</div>" +
      '<form class="chat-form" data-action="send-chat"><textarea name="msg" rows="3" required placeholder="Escreva sua mensagem… (Ctrl+Enter para enviar)"></textarea>' +
      '<div class="chat-form-actions">' + (aiAvailable() ? "" : '<span class="muted small">Configure sua chave em <a href="#" data-action="open-settings">⚙️ Configurações</a> para conversar aqui.</span>') +
      '<button class="btn primary" type="submit">Enviar</button></div></form></section>');

    html.push('<section class="card"><h2>Meu plano de ação</h2><p class="muted">Suas tarefas, vindas da IA ou adicionadas por você. Elas também aparecem na página inicial.</p>' + renderActions(false) + "</section>");
    return html.join("");
  }

  function renderMsg(m, i) {
    if (m.role === "user") {
      return '<div class="msg user"><div class="msg-body">' + esc(m.display || m.content).replace(/\n/g, "<br>") + "</div></div>";
    }
    var tasks = AI.extractTasks(m.content);
    var added = m.tasksAdded;
    return '<div class="msg assistant" data-index="' + i + '"><div class="msg-body md">' + AI.renderMarkdown(m.content) + "</div>" +
      '<div class="msg-actions">' +
      (tasks.length ? '<button class="btn small' + (added ? "" : " primary") + '" data-action="add-tasks" data-index="' + i + '"' + (added ? " disabled" : "") + ">" +
        (added ? "✓ " + tasks.length + " tarefa(s) adicionada(s)" : "+ Adicionar " + tasks.length + " tarefa(s) ao meu plano") + "</button>" : "") +
      '<button class="btn small ghost" data-action="copy-msg" data-index="' + i + '">Copiar</button></div></div>';
  }

  function scrollChatToEnd() {
    var chat = document.getElementById("chat");
    if (chat) chat.scrollTop = chat.scrollHeight;
  }

  var busy = false;
  var currentAbort = null;
  var helpOpenState = {};

  function aiAvailable() { return AI.hasSample() || !!settings.apiKey; }

  async function sendToAI(userText, display) {
    if (busy) return;
    if (!aiAvailable()) { openSettings("Para conversar com a IA aqui, adicione sua chave da API. Ou use “Copiar para usar no Claude.ai”."); return; }
    busy = true;
    currentAbort = new AbortController();
    state.chat.push({ role: "user", content: userText, display: display || null });
    save(true);
    var chat = document.getElementById("chat");
    chat.innerHTML = state.chat.map(renderMsg).join("") +
      '<div class="msg assistant pending"><div class="msg-body md" id="streaming"><p class="typing">Pensando<span>.</span><span>.</span><span>.</span></p></div>' +
      '<div class="msg-actions"><button class="btn small ghost" data-action="stop-ai">Parar</button></div></div>';
    scrollChatToEnd();
    setFormsDisabled(true);
    try {
      var text = await AI.ask({
        settings: settings,
        system: AI.systemPrompt(state),
        messages: state.chat.map(function (m) { return { role: m.role, content: m.content }; }),
        signal: currentAbort.signal,
        onText: function (acc) {
          var el = document.getElementById("streaming");
          if (el) { el.innerHTML = AI.renderMarkdown(acc); scrollChatToEnd(); }
        }
      });
      state.chat.push({ role: "assistant", content: text });
      save(true);
    } catch (e) {
      state.chat.pop(); // devolve a mensagem para o campo, para tentar de novo
      save(true);
      if (e.message) toast(e.message, true);
      var ta = document.querySelector(".chat-form textarea");
      if (ta && !display) ta.value = userText;
    } finally {
      busy = false;
      if (currentRoute().view === "ia") {
        document.getElementById("chat").innerHTML = state.chat.length ? state.chat.map(renderMsg).join("") : '<p class="muted">Escolha uma opção acima ou escreva sua mensagem abaixo para começar.</p>';
        scrollChatToEnd();
        setFormsDisabled(false);
      }
    }
  }

  function setFormsDisabled(dis) {
    document.querySelectorAll('[data-action="run-mode"], .chat-form button, .chat-form textarea').forEach(function (el) { el.disabled = dis; });
  }

  async function askAboutStep(stepId, question, form) {
    var step = STEPS.find(function (s) { return s.id === stepId; });
    var out = document.getElementById("ask-answer");
    if (!aiAvailable()) {
      var prompt = AI.buildCopyPrompt(state, stepHelpRequest(step, question));
      copyText(prompt, "Pedido copiado! Cole numa conversa em claude.ai. (Para respostas aqui mesmo, configure sua chave em ⚙️.)");
      return;
    }
    var btn = form.querySelector("button");
    btn.disabled = true;
    out.innerHTML = '<p class="typing">Pensando<span>.</span><span>.</span><span>.</span></p>';
    try {
      var text = await AI.ask({
        settings: settings,
        system: AI.systemPrompt(state),
        messages: [{ role: "user", content: stepHelpRequest(step, question) }],
        onText: function (acc) { out.innerHTML = AI.renderMarkdown(acc); }
      });
      out.innerHTML = AI.renderMarkdown(text);
    } catch (e) {
      out.innerHTML = e.message ? '<p class="error-text">' + esc(e.message) + "</p>" : "";
    } finally {
      btn.disabled = false;
    }
  }

  function stepHelpRequest(step, question) {
    return "Estou preenchendo a etapa " + step.num + " (\"" + step.title + "\" – " + step.chapter + ") e tenho uma dúvida sobre como preencher.\n\n" +
      "Minha dúvida: " + question + "\n\n" +
      "Responda de forma curta e prática (até ~200 palavras): explique o conceito do livro se necessário, comente o que eu já escrevi nesta etapa (se houver) e dê um exemplo ou uma pergunta que me ajude a escrever.";
  }

  // ---------- Configurações, importação e exportação ----------

  function openSettings(msg) {
    var dlg = document.getElementById("settings");
    dlg.querySelector("#set-msg").textContent = msg || "";
    dlg.querySelector("#set-msg").hidden = !msg;
    dlg.querySelector("#set-key").value = settings.apiKey;
    dlg.querySelector("#set-api").hidden = AI.hasSample();
    dlg.querySelector("#set-sample").hidden = !AI.hasSample();
    dlg.querySelector("#set-model").innerHTML = AI.MODELS.map(function (m) {
      return '<option value="' + m.id + '"' + (settings.model === m.id ? " selected" : "") + ">" + esc(m.label) + "</option>";
    }).join("");
    dlg.showModal();
  }

  async function exportData() {
    var json = JSON.stringify(state, null, 2);
    var filename = "design-da-sua-vida-" + today() + ".json";
    var downloads = await capability("downloads");
    if (downloads) {
      try {
        await downloads.save({ filename: filename, data: json });
        toast("Backup salvo.");
      } catch (e) {
        if (e && e.code !== "declined") toast("Não foi possível salvar o arquivo. Tente de novo em instantes.", true);
      }
      return;
    }
    var blob = new Blob([json], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    toast("Backup baixado.");
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!data || typeof data.fields !== "object") throw new Error("formato");
        askConfirm("Importar este arquivo vai substituir todos os seus dados atuais. Continuar?", "Importar").then(function (ok) {
          if (!ok) return;
          state = Object.assign(emptyState(), data);
          save(true);
          render();
          toast("Dados importados.");
        });
      } catch (e) {
        toast("Arquivo inválido. Use um backup exportado por este app.", true);
      }
    };
    reader.readAsText(file);
  }

  function copyText(text, okMsg) {
    var done = function () { toast(okMsg || "Copiado!"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    ta.remove();
  }

  // Confirmação dentro da página (o confirm() do navegador não funciona em Artifacts).
  function askConfirm(message, okLabel) {
    return new Promise(function (resolve) {
      var dlg = document.getElementById("confirm-dlg");
      dlg.querySelector("#confirm-msg").textContent = message;
      dlg.querySelector("#confirm-ok").textContent = okLabel || "Confirmar";
      dlg.returnValue = "";
      dlg.addEventListener("close", function () { resolve(dlg.returnValue === "ok"); }, { once: true });
      dlg.showModal();
    });
  }

  function toast(msg, isError) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.toggle("error", !!isError);
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, isError ? 6000 : 3000);
  }

  // ---------- Eventos ----------

  function findListRow(listId, rowEl) {
    var rows = state.fields[listId] || [];
    return rows.find(function (r) { return r._id === rowEl.dataset.row; });
  }

  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.dataset.field) {
      state.fields[t.dataset.field] = t.value;
      if (t.type === "range") {
        t.classList.remove("unset");
        var out = t.parentElement.querySelector("output");
        if (out) {
          out.textContent = t.value;
          out.classList.remove("bump");
          void out.offsetWidth;
          out.classList.add("bump");
        }
      }
      var counter = document.querySelector('[data-counter="' + t.dataset.field + '"]');
      if (counter) {
        var f = findField(t.dataset.field);
        counter.textContent = f.maxWords ? wordCounter(t.value, f.maxWords, true) : wordCounter(t.value, f.words);
      }
      save();
      renderNav(currentRoute());
    } else if (t.dataset.list && t.dataset.col) {
      var row = findListRow(t.dataset.list, t.closest("tr"));
      if (row) { row[t.dataset.col] = t.value; save(); }
    }
  });

  // Atualiza destaques/ordem da lista quando o usuário sai do campo.
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset.list === "d_registros") {
      var wrap = t.closest(".list-field").querySelector(".hl-wrap");
      if (wrap) wrap.innerHTML = renderJournalHighlights(state.fields.d_registros || []);
    }
    if (t.dataset.field) renderNav(currentRoute());
  });

  function findField(id) {
    for (var i = 0; i < STEPS.length; i++) {
      var fs = allFields(STEPS[i]);
      for (var j = 0; j < fs.length; j++) if (fs[j].id === id) return fs[j];
    }
    return null;
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-action]");
    if (!el || el.tagName === "FORM") return;
    var action = el.dataset.action;

    if (action === "add-row") {
      var f = findField(el.dataset.list);
      var row = { _id: uid() };
      f.columns.forEach(function (c) { row[c.id] = c.default === "today" ? today() : ""; });
      state.fields[f.id] = (state.fields[f.id] || []).concat([row]);
      save(true);
      rerenderKeepingScroll();
      var input = document.querySelector('tr[data-row="' + row._id + '"] input[type="text"]');
      if (input) input.focus();
    } else if (action === "delete-row") {
      var tr = el.closest("tr");
      var rowsList = state.fields[el.dataset.list] || [];
      var target = findListRow(el.dataset.list, tr);
      var hasContent = target && Object.keys(target).some(function (k) { return k !== "_id" && k !== "data" && String(target[k]).trim(); });
      var listId = el.dataset.list;
      var removeRow = function () {
        state.fields[listId] = rowsList.filter(function (r) { return r._id !== tr.dataset.row; });
        save(true);
        rerenderKeepingScroll();
      };
      if (hasContent) askConfirm("Excluir este item?", "Excluir").then(function (ok) { if (ok) removeRow(); });
      else removeRow();
    } else if (action === "toggle-done") {
      state.done[el.dataset.step] = el.checked;
      save(true);
      rerenderKeepingScroll();
      if (el.checked) {
        var toggle = document.querySelector(".done-toggle");
        if (toggle) toggle.classList.add("celebrate");
        toast("Etapa concluída! 🎉");
      }
    } else if (action === "toggle-task") {
      var li = el.closest("[data-id]");
      var task = state.actions.find(function (a) { return a.id === li.dataset.id; });
      if (task) {
        task.done = el.checked;
        task.doneAt = el.checked ? today() : null;
        save(true);
        // Anima o risco na tarefa antes de reorganizar a lista.
        li.classList.toggle("done", el.checked);
        clearTimeout(li._t);
        li._t = setTimeout(rerenderKeepingScroll, 650);
      }
    } else if (action === "delete-task") {
      var li2 = el.closest("[data-id]");
      state.actions = state.actions.filter(function (a) { return a.id !== li2.dataset.id; });
      save(true);
      rerenderKeepingScroll();
    } else if (action === "run-mode") {
      var mode = AI.MODES.find(function (m) { return m.id === el.dataset.mode; });
      sendToAI(mode.prompt, "▶ " + mode.label);
    } else if (action === "copy-mode") {
      var mode2 = AI.MODES.find(function (m) { return m.id === el.dataset.mode; });
      copyText(AI.buildCopyPrompt(state, mode2.prompt), "Pedido copiado com seus dados! Cole numa nova conversa em claude.ai.");
    } else if (action === "add-tasks") {
      var msg = state.chat[Number(el.dataset.index)];
      var tasks = AI.extractTasks(msg.content);
      tasks.forEach(function (t) { state.actions.push({ id: uid(), text: t, done: false, due: "", source: "ia", createdAt: today() }); });
      msg.tasksAdded = true;
      save(true);
      rerenderKeepingScroll();
      toast(tasks.length + " tarefa(s) adicionada(s) ao seu plano.");
    } else if (action === "copy-msg") {
      copyText(state.chat[Number(el.dataset.index)].content);
    } else if (action === "clear-chat") {
      askConfirm("Começar uma nova conversa? A conversa atual será apagada. Suas tarefas continuam.", "Nova conversa").then(function (ok) {
        if (!ok) return;
        state.chat = [];
        save(true);
        render();
      });
    } else if (action === "replay-ill") {
      var art = el.closest(".ill").querySelector(".ill-art");
      art.innerHTML = art.innerHTML;
    } else if (action === "stop-ai") {
      if (currentAbort) currentAbort.abort();
    } else if (action === "close-dialog") {
      el.closest("dialog").close();
    } else if (action === "open-settings") {
      e.preventDefault();
      openSettings();
    } else if (action === "export") {
      exportData();
    } else if (action === "import") {
      document.getElementById("import-file").click();
    } else if (action === "toggle-nav") {
      document.body.classList.toggle("nav-open");
    } else if (action === "reset") {
      document.getElementById("settings").close();
      askConfirm("Apagar TODOS os seus dados? Exporte um backup antes. Esta ação não pode ser desfeita.", "Apagar tudo").then(function (ok) {
        if (!ok) return;
        state = emptyState();
        save(true);
        go("#inicio");
        toast("Dados apagados.");
      });
    }
  });

  document.addEventListener("submit", function (e) {
    var form = e.target;
    var action = form.dataset.action;
    if (!action) return;
    e.preventDefault();
    var fd = new FormData(form);

    if (action === "quick-journal") {
      var row = { _id: uid(), data: today(), atividade: fd.get("atividade").trim(), engajamento: fd.get("engajamento"), energia: fd.get("energia"), obs: fd.get("obs").trim() };
      state.fields.d_registros = (state.fields.d_registros || []).concat([row]);
      save(true);
      rerenderKeepingScroll();
      var first = document.querySelector(".journal-summary li");
      if (first) first.classList.add("flash");
      toast("Registro adicionado ao diário.");
    } else if (action === "add-task") {
      var text = fd.get("text").trim();
      if (!text) return;
      state.actions.push({ id: uid(), text: text, done: false, due: fd.get("due") || "", source: "manual", createdAt: today() });
      save(true);
      rerenderKeepingScroll();
    } else if (action === "send-chat") {
      var msg = fd.get("msg").trim();
      if (!msg) return;
      form.reset();
      sendToAI(msg);
    } else if (action === "ask-step") {
      askAboutStep(form.dataset.step, fd.get("q").trim(), form);
    } else if (action === "save-settings") {
      settings.apiKey = fd.get("key").trim();
      settings.model = fd.get("model");
      safeSet(SETTINGS_KEY, JSON.stringify(settings));
      document.getElementById("settings").close();
      toast("Configurações salvas.");
      if (currentRoute().view === "ia") rerenderKeepingScroll();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && e.target.closest(".chat-form, .ask-box form")) {
      e.preventDefault();
      e.target.closest("form").requestSubmit();
    }
  });

  function rerenderKeepingScroll() {
    var y = window.scrollY;
    var chatScroll = document.getElementById("chat");
    var cy = chatScroll ? chatScroll.scrollTop : 0;
    var route = currentRoute();
    renderNav(route);
    var main = document.getElementById("main");
    var oldFig = main.querySelector(".ill");
    if (route.view === "inicio") main.innerHTML = renderHome();
    else if (route.view === "ia") main.innerHTML = renderAI();
    else main.innerHTML = renderStep(STEPS.find(function (s) { return s.id === route.id; }));
    // Mantém a mesma ilustração para a animação não recomeçar a cada edição.
    var newFig = main.querySelector(".ill");
    if (oldFig && newFig && oldFig.dataset.id === newFig.dataset.id) newFig.replaceWith(oldFig);
    window.scrollTo(0, y);
    var c2 = document.getElementById("chat");
    if (c2) c2.scrollTop = cy;
  }

  // Mantém o estado aberto/fechado da ajuda entre re-renderizações da mesma etapa.
  document.addEventListener("toggle", function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains("help") && t.dataset.step) helpOpenState[t.dataset.step] = t.open;
  }, true);

  document.getElementById("import-file").addEventListener("change", function (e) {
    if (e.target.files[0]) importData(e.target.files[0]);
    e.target.value = "";
  });

  // Sincroniza entre abas abertas.
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY && e.newValue) {
      try { state = Object.assign(emptyState(), JSON.parse(e.newValue)); rerenderKeepingScroll(); } catch (err) { /* ignore */ }
    }
  });

  window.addEventListener("hashchange", render);
  render();
  updateStorageNote();
  connectRemote();
  // Quando a IA do Claude fica disponível, atualiza a tela (some o aviso de chave).
  AI.sampleReady.then(function (s) { if (s) rerenderKeepingScroll(); });
})();
