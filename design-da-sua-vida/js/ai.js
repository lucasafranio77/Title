/*
 * Integração com o Claude: montagem do contexto, chamadas à IA e um
 * renderizador de markdown simples e seguro para exibir as respostas.
 *
 * Duas formas de falar com o Claude:
 * - como Artifact do Claude: capability "sample", que usa a conta Claude
 *   da própria pessoa (sem chave de API);
 * - como arquivo local: API da Anthropic com a chave do usuário (SDK oficial
 *   carregado do CDN, direto do navegador).
 */
(function () {
  var SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk/+esm";
  var MAX_JOURNAL_ROWS = 80; // registros do diário enviados à IA (os mais recentes)
  var MAX_SAMPLE_BYTES = 60000; // o "sample" aceita até 64 KiB de texto

  var sampleFn = null;
  var sampleReady = (window.claude && typeof window.claude.use === "function")
    ? window.claude.use("sample").then(function (s) { sampleFn = s; return s; }).catch(function () { return null; })
    : Promise.resolve(null);
  function hasSample() { return !!sampleFn; }

  var MODELS = [
    { id: "claude-opus-5", label: "Claude Opus 5 (recomendado)" },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5 (mais barato)" }
  ];

  var COACH_PROMPT = [
    "Você é um coach de design de vida, especialista no método do livro \"O Design da Sua Vida\" (Designing Your Life), de Bill Burnett e Dave Evans.",
    "Você conversa em português do Brasil, com tom acolhedor, direto e prático — como um bom mentor, não como um terapeuta nem como um vendedor de autoajuda.",
    "",
    "Princípios que guiam suas respostas:",
    "- Use as mentalidades do livro: curiosidade, viés para a ação, reformulação, consciência do processo e colaboração radical.",
    "- Baseie-se SEMPRE no que a pessoa escreveu. Cite trechos e números dela (notas do painel, registros do diário, títulos das odisseias) para mostrar padrões. Não invente fatos sobre a vida dela.",
    "- Aponte padrões, coerências e contradições entre as etapas (ex.: bússola x painel, diário x planos de odisseia).",
    "- Identifique problemas de gravidade e crenças disfuncionais quando aparecerem, e proponha reformulações.",
    "- Prefira protótipos pequenos, baratos e rápidos (conversas-protótipo e experiências-protótipo) a grandes decisões.",
    "- Quando faltar informação importante, diga o que falta e faça no máximo 3 perguntas objetivas.",
    "- Não é aconselhamento médico, psicológico ou financeiro. Se perceber sinais de sofrimento sério, sugira com gentileza buscar um profissional.",
    "",
    "Formato:",
    "- Use markdown simples: títulos com ##, listas com -, negrito com **.",
    "- Sempre que propuser ações concretas, escreva-as como tarefas no formato exato: `- [ ] ação específica (prazo)` — o app transforma essas linhas em tarefas no plano da pessoa.",
    "- Seja específico: \"mandar mensagem para 2 pessoas que trabalham com UX até sexta\" em vez de \"fazer networking\"."
  ].join("\n");

  var MODES = [
    {
      id: "avaliacao",
      label: "Avaliação completa",
      desc: "Leitura geral de tudo que você preencheu: padrões, forças, pontos de atenção.",
      prompt:
        "Faça uma avaliação completa do meu design de vida com base em tudo que preenchi. Estruture assim:\n" +
        "## Retrato de onde estou\n(síntese do painel e da bússola)\n" +
        "## Padrões que você percebeu\n(cruzando diário, mapas mentais, odisseias e fracassos)\n" +
        "## Coerências e contradições\n" +
        "## Problemas de gravidade e crenças para reformular\n" +
        "## O que está faltando ou merece aprofundar\n(etapas incompletas ou rasas)\n" +
        "## Próximos passos\n(3 a 5 tarefas no formato - [ ] com prazo)\n" +
        "Termine com até 3 perguntas para eu refletir."
    },
    {
      id: "plano30",
      label: "Plano de ação de 30 dias",
      desc: "Transforma suas reflexões em um plano semana a semana.",
      prompt:
        "Com base no que preenchi, crie um plano de ação prático para os próximos 30 dias, dividido em 4 semanas. " +
        "Cada semana deve ter um foco, 2 a 4 tarefas no formato - [ ] com prazo, e pelo menos um protótipo (conversa ou experiência). " +
        "Inclua uma pequena ação ligada à área mais baixa do meu painel e um momento de revisão semanal. " +
        "Seja realista com meu tempo e meus recursos."
    },
    {
      id: "odisseias",
      label: "Comparar Planos de Odisseia",
      desc: "Ajuda a entender o que cada vida possível revela e como testá-las.",
      prompt:
        "Analise meus três Planos de Odisseia. Para cada um: o que ele revela sobre o que eu valorizo, o que me atrai, os principais riscos e dúvidas, e como ele se relaciona com minha bússola e com o diário. " +
        "Depois, sugira um protótipo pequeno para testar cada plano (conversa-protótipo e/ou experiência-protótipo, com pessoas ou lugares concretos que eu poderia procurar) " +
        "e aponte elementos que poderiam ser combinados entre os planos. Não escolha por mim; ajude-me a escolher melhor."
    },
    {
      id: "prototipos",
      label: "Planejar protótipos",
      desc: "Sugestões de conversas e experiências para testar suas ideias.",
      prompt:
        "Me ajude a planejar protótipos para as próximas duas semanas. Com base nas minhas perguntas, odisseias e opções: " +
        "sugira 3 conversas-protótipo (que tipo de pessoa procurar, onde encontrar, uma mensagem curta de convite e 5 perguntas para a conversa) " +
        "e 2 experiências-protótipo pequenas. Liste as ações como tarefas - [ ] com prazo."
    },
    {
      id: "semanal",
      label: "Revisão semanal",
      desc: "Use toda semana: olha o diário e as tarefas recentes e ajusta a rota.",
      prompt:
        "Faça minha revisão semanal. Olhe principalmente os registros mais recentes do diário, os fracassos registrados e o status das minhas tarefas. " +
        "Me diga: o que me deu energia e o que me drenou nesta semana, o que avancei, o que travou (e por quê, sem julgamento), " +
        "um aprendizado e 3 tarefas - [ ] para a próxima semana. Seja breve."
    },
    {
      id: "decisao",
      label: "Ajuda para decidir",
      desc: "Usa o processo do livro: reduzir opções, cabeça + coração, deixar ir.",
      prompt:
        "Me ajude com a etapa de escolha usando o processo do livro (reunir, reduzir, escolher, deixar ir). " +
        "Olhe minhas opções e o que a cabeça e o coração disseram. Se minha lista viável tiver mais de 5 opções, ajude a reduzir. " +
        "Proponha um exercício para ouvir o coração nos próximos dias e me ajude a formular o que vou deixar ir. Termine com o primeiro passo como tarefa - [ ]."
    }
  ];

  // ---------- Serialização dos dados para o modelo ----------

  function isFilled(v) {
    if (v === undefined || v === null) return false;
    // Em listas, a data preenchida automaticamente não conta como conteúdo.
    if (Array.isArray(v)) return v.some(function (row) { return Object.keys(row).some(function (k) { return k !== "_id" && k !== "data" && String(row[k] || "").trim(); }); });
    return String(v).trim() !== "";
  }

  function fieldToText(field, value) {
    if (field.type === "list") {
      var rows = (value || []).filter(function (row) {
        return field.columns.some(function (c) { return c.type !== "date" && String(row[c.id] || "").trim(); });
      });
      if (!rows.length) return null;
      var total = rows.length;
      var note = "";
      if (field.newestFirst && rows.length > MAX_JOURNAL_ROWS) {
        rows = rows.slice().sort(function (a, b) { return (b.data || "").localeCompare(a.data || ""); }).slice(0, MAX_JOURNAL_ROWS);
        note = ", mostrando os " + MAX_JOURNAL_ROWS + " mais recentes";
      }
      var lines = rows.map(function (row) {
        return "- " + field.columns
          .filter(function (c) { return String(row[c.id] || "").trim(); })
          .map(function (c) { return c.label + ": " + row[c.id]; })
          .join(" | ");
      });
      return "**" + field.label + "** (" + total + " itens" + note + ")\n" + lines.join("\n");
    }
    if (field.type === "range") return "**" + field.label + ":** " + value + "/" + field.max;
    return "**" + field.label + ":** " + String(value).trim();
  }

  function stepToText(step, fields) {
    var parts = [];
    step.sections.forEach(function (sec) {
      var secParts = [];
      sec.fields.forEach(function (f) {
        if (!isFilled(fields[f.id])) return;
        var t = fieldToText(f, fields[f.id]);
        if (t) secParts.push(t);
      });
      if (secParts.length) parts.push("### " + sec.title + "\n" + secParts.join("\n"));
    });
    return parts.join("\n\n");
  }

  function buildSnapshot(state) {
    var out = ["# Meu design de vida (dados preenchidos no app)", "Data de hoje: " + new Date().toLocaleDateString("pt-BR")];
    window.STEPS.forEach(function (step) {
      var body = stepToText(step, state.fields);
      var done = state.done[step.id] ? " — marcada como concluída" : "";
      out.push("\n## Etapa " + step.num + ": " + step.title + done);
      out.push(body || "_(não preenchida)_");
    });
    var actions = (state.actions || []).filter(function (a) { return a.text; });
    out.push("\n## Minhas tarefas (plano de ação)");
    out.push(actions.length
      ? actions.map(function (a) { return "- [" + (a.done ? "x" : " ") + "] " + a.text + (a.due ? " (até " + a.due + ")" : ""); }).join("\n")
      : "_(nenhuma tarefa ainda)_");
    return out.join("\n");
  }

  function coachPrompt() {
    var name = window.APP_CONFIG && window.APP_CONFIG.name;
    return name ? COACH_PROMPT + "\n\nVocê está conversando com " + name + ". Chame a pessoa pelo nome." : COACH_PROMPT;
  }

  function systemPrompt(state) {
    return coachPrompt() + "\n\n<dados_da_pessoa>\n" + buildSnapshot(state) + "\n</dados_da_pessoa>";
  }

  // ---------- Chamada à API ----------

  var sdkPromise = null;
  function loadSdk() {
    if (!sdkPromise) {
      sdkPromise = import(SDK_URL).then(function (mod) { return mod.default || mod.Anthropic; })
        .catch(function (e) { sdkPromise = null; throw new Error("Não foi possível carregar o SDK da Anthropic (verifique sua internet). " + e.message); });
    }
    return sdkPromise;
  }

  /**
   * Envia uma conversa ao Claude com streaming.
   * messages: [{role: "user"|"assistant", content: string}]
   * onText: chamado com o texto acumulado a cada pedaço recebido.
   * Retorna o texto final.
   */
  async function ask(opts) {
    if (sampleFn) return askSample(opts);
    var settings = opts.settings;
    if (!settings.apiKey) throw new Error("Configure sua chave da API da Anthropic em ⚙️ Configurações.");
    var Anthropic = await loadSdk();
    var client = new Anthropic({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true });
    var model = settings.model || MODELS[0].id;

    var params = {
      model: model,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      system: opts.system,
      messages: opts.messages
    };
    var stream;
    if (model === "claude-opus-5") {
      // Se o filtro de segurança recusar, o servidor tenta outro modelo automaticamente.
      params.betas = ["server-side-fallback-2026-07-01"];
      params.fallbacks = "default";
      stream = client.beta.messages.stream(params);
    } else {
      stream = client.messages.stream(params);
    }

    if (opts.signal) opts.signal.addEventListener("abort", function () { stream.abort(); });

    var acc = "";
    stream.on("text", function (delta) {
      acc += delta;
      if (opts.onText) opts.onText(acc);
    });

    var message;
    try {
      message = await stream.finalMessage();
    } catch (e) {
      if (opts.signal && opts.signal.aborted) throw new Error("");
      throw new Error(friendlyError(e));
    }
    if (message.stop_reason === "refusal") {
      throw new Error("O modelo não pôde responder a este pedido. Tente reformular a pergunta.");
    }
    var text = message.content.filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; }).join("");
    if (message.stop_reason === "max_tokens") text += "\n\n_(resposta cortada por tamanho — peça para continuar)_";
    return text;
  }

  // Pela conta Claude da pessoa (Artifact). Não há system prompt: as
  // instruções e os dados vão num primeiro turno do usuário.
  async function askSample(opts) {
    var intro = { role: "user", content: opts.system + "\n\nResponda à conversa a seguir." };
    var msgs = opts.messages.slice();
    var bytes = function (list) { return new Blob([list.map(function (m) { return m.content; }).join("")]).size; };
    while (msgs.length > 1 && bytes([intro].concat(msgs)) > MAX_SAMPLE_BYTES) msgs.shift();
    while (msgs.length && msgs[0].role !== "user") msgs.shift();
    try {
      var result = await sampleFn([intro].concat(msgs), {
        cache: false,
        signal: opts.signal,
        onText: function (u) { if (opts.onText) opts.onText(u.text); }
      });
      return result.truncated ? result.text + "\n\n_(resposta cortada por tamanho — peça para continuar)_" : result.text;
    } catch (e) {
      throw new Error(sampleErrorMessage(e && e.code));
    }
  }

  function sampleErrorMessage(code) {
    switch (code) {
      case "cancelled": return "";
      case "not_granted":
      case "sampling_disabled":
      case "not_declared":
      case "capability_disabled":
      case "capability_removed":
        return "A IA não foi autorizada nesta página. Recarregue e permita o uso do Claude quando ele pedir.";
      case "rate_limited": return "Limite de uso do Claude atingido. Espere um pouco e tente de novo.";
      case "session_expired": return "Sua sessão expirou. Entre novamente no Claude.";
      case "refused": return "A IA não pôde responder a esse pedido. Tente reformular.";
      case "prompt_too_large": return "Seus dados ficaram grandes demais para enviar de uma vez. Comece uma nova conversa.";
      case "empty_completion": return "A IA não respondeu nada. Tente pedir de outro jeito.";
      default: return "Falha temporária ao falar com a IA. Tente novamente.";
    }
  }

  function friendlyError(e) {
    var status = e && e.status;
    if (status === 401) return "Chave da API inválida. Confira em ⚙️ Configurações.";
    if (status === 403) return "Sua chave não tem permissão para este modelo.";
    if (status === 429) return "Limite de uso atingido. Espere um pouco e tente de novo.";
    if (status === 400 && /credit|balance/i.test(e.message || "")) return "Sua conta da API está sem créditos.";
    if (status >= 500) return "O serviço está instável no momento. Tente novamente em instantes.";
    return (e && e.message) || "Erro desconhecido ao falar com a IA.";
  }

  // Monta um texto único para colar no Claude.ai (para quem não tem chave da API).
  function buildCopyPrompt(state, request) {
    return coachPrompt() + "\n\n<dados_da_pessoa>\n" + buildSnapshot(state) + "\n</dados_da_pessoa>\n\n" + request;
  }

  // ---------- Markdown seguro (escapa HTML antes de formatar) ----------

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
      .replace(/(^|\W)_([^_]+)_(?=\W|$)/g, "$1<em>$2</em>");
  }

  function renderMarkdown(md) {
    var lines = md.replace(/\r/g, "").split("\n");
    var html = [];
    var list = null; // "ul" | "ol"
    var para = [];

    function flushPara() {
      if (para.length) { html.push("<p>" + para.map(inline).join("<br>") + "</p>"); para = []; }
    }
    function closeList() {
      if (list) { html.push("</" + list + ">"); list = null; }
    }

    lines.forEach(function (line) {
      var m;
      if (!line.trim()) { flushPara(); closeList(); return; }
      if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
        flushPara(); closeList();
        var level = Math.min(m[1].length + 1, 5);
        html.push("<h" + level + ">" + inline(m[2]) + "</h" + level + ">");
        return;
      }
      if (/^\s*(---|\*\*\*)\s*$/.test(line)) { flushPara(); closeList(); html.push("<hr>"); return; }
      if ((m = line.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.*)$/))) {
        flushPara();
        if (list !== "ul") { closeList(); html.push('<ul class="md-tasks">'); list = "ul"; }
        html.push('<li class="md-task' + (m[1] === " " ? "" : " done") + '"><span class="md-box">' + (m[1] === " " ? "☐" : "☑") + "</span> " + inline(m[2]) + "</li>");
        return;
      }
      if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) {
        flushPara();
        if (list !== "ul") { closeList(); html.push("<ul>"); list = "ul"; }
        html.push("<li>" + inline(m[1]) + "</li>");
        return;
      }
      if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
        flushPara();
        if (list !== "ol") { closeList(); html.push("<ol>"); list = "ol"; }
        html.push("<li>" + inline(m[1]) + "</li>");
        return;
      }
      if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); closeList(); html.push("<blockquote>" + inline(m[1]) + "</blockquote>"); return; }
      closeList();
      para.push(line);
    });
    flushPara(); closeList();
    return html.join("\n");
  }

  // Extrai linhas "- [ ] tarefa (prazo)" de uma resposta.
  function extractTasks(md) {
    var tasks = [];
    md.split("\n").forEach(function (line) {
      var m = line.match(/^\s*[-*]\s+\[ \]\s+(.+)$/);
      if (m) tasks.push(m[1].replace(/\*\*/g, "").replace(/`/g, "").trim());
    });
    return tasks;
  }

  window.AI = {
    hasSample: hasSample,
    sampleReady: sampleReady,
    MODELS: MODELS,
    MODES: MODES,
    ask: ask,
    systemPrompt: systemPrompt,
    buildSnapshot: buildSnapshot,
    stepToText: stepToText,
    buildCopyPrompt: buildCopyPrompt,
    renderMarkdown: renderMarkdown,
    extractTasks: extractTasks,
    isFilled: isFilled,
    esc: esc
  };
})();
