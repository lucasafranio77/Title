/*
 * Ilustrações animadas (SVG inline) para cada etapa.
 * Cores vêm dos tokens do tema via classes CSS (.s-a, .f-as…) e as
 * animações são classes CSS (.a-draw, .a-pop…) com atraso em --d.
 * Com "reduzir movimento", tudo aparece direto no estado final.
 */
(function () {
  function r1(n) { return Math.round(n * 10) / 10; }
  function d(s) { return ' style="--d:' + s + 's"'; }
  // Com `delay`, o texto aparece com fade depois desse atraso.
  function text(x, y, str, cls, anchor, delay) {
    if (delay !== undefined) cls = (cls ? cls + " " : "") + "a-fade";
    return '<text x="' + r1(x) + '" y="' + r1(y) + '"' + (cls ? ' class="' + cls + '"' : "") +
      (anchor ? ' text-anchor="' + anchor + '"' : "") + (delay !== undefined ? d(delay) : "") + ">" + str + "</text>";
  }
  function polar(cx, cy, r, deg) {
    var a = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function arrowDefs(id) {
    return '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0,1 L9,5 L0,9 z" class="f-m"/></marker></defs>';
  }
  function svg(id, w, h, label, body) {
    return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + label + '" data-ill="' + id + '">' + body + "</svg>";
  }

  // 1. Cinco mentalidades ao redor de você; um destaque percorre cada uma.
  function mentalidades() {
    var cx = 180, cy = 108, R = 74;
    var nomes = ["Curiosidade", "Tentar coisas", "Reformular", "Processo", "Colaboração"];
    var angs = [-90, -18, 54, 126, 198];
    var b = "";
    angs.forEach(function (a, i) {
      var p = polar(cx, cy, R, a), q = polar(cx, cy, 26, a), s = polar(cx, cy, R - 15, a);
      b += '<line x1="' + r1(q[0]) + '" y1="' + r1(q[1]) + '" x2="' + r1(s[0]) + '" y2="' + r1(s[1]) + '" class="s s-m a-draw" pathLength="1"' + d(0.1 + i * 0.12) + "/>";
    });
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="26" class="f-as a-pop"' + d(0) + "/>";
    b += text(cx, cy + 4, "você", "ta", "middle");
    angs.forEach(function (a, i) {
      var p = polar(cx, cy, R, a);
      b += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="21" class="ring s-a a-cycle"' + d(1.6 + i * 1.2) + "/>";
      b += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="14" class="f-s2 s s-a a-pop"' + d(0.4 + i * 0.12) + "/>";
      b += text(p[0], p[1] + 4, String(i + 1), "ta", "middle");
      var lx = p[0], ly = p[1], anchor = "middle";
      if (i === 0) ly -= 24;
      else if (i === 1) { lx += 22; ly += 4; anchor = "start"; }
      else if (i === 4) { lx -= 22; ly += 4; anchor = "end"; }
      else ly += 32;
      b += text(lx, ly, nomes[i], "", anchor, 0.5 + i * 0.12);
    });
    return svg("mentalidades", 360, 214, "Cinco mentalidades do designer ao redor de você: curiosidade, tentar coisas, reformular, consciência do processo e colaboração.", b);
  }

  // 2. Quatro medidores do painel, cada ponteiro indo até a nota.
  function painel() {
    var dados = [["Saúde", 4], ["Trabalho", 8], ["Diversão", 2], ["Amor", 7]];
    var b = "";
    dados.forEach(function (g, i) {
      var cx = 48 + i * 88, cy = 84, R = 32;
      var arc = "M" + (cx - R) + "," + cy + " A" + R + "," + R + " 0 0 1 " + (cx + R) + "," + cy;
      b += '<path d="' + arc + '" class="s s-track" stroke-width="8" stroke-linecap="round"/>';
      b += '<path d="' + arc + '" class="s s-a a-gauge" stroke-width="8" stroke-linecap="round" pathLength="1" style="--v:' + g[1] / 10 + ";--d:" + (0.2 + i * 0.15) + 's"/>';
      b += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy - 25) + '" class="s needle a-needle" stroke-width="2.5" stroke-linecap="round" style="--r:' + (-90 + g[1] * 18) + "deg;--d:" + (0.2 + i * 0.15) + "s;transform-origin:" + cx + "px " + cy + 'px"/>';
      b += '<circle cx="' + cx + '" cy="' + cy + '" r="4" class="f-a"/>';
      b += text(cx - R, cy + 16, "0", "tm", "middle") + text(cx + R, cy + 16, "10", "tm", "middle");
      b += text(cx, cy + 32, g[0], "", "middle");
      b += text(cx, cy + 48, g[1] + "/10", "tm", "middle");
    });
    return svg("painel", 360, 140, "Painel com quatro medidores de 0 a 10: saúde 4, trabalho 8, diversão 2 e amor 7.", b);
  }

  // 3. Visão de trabalho e visão de vida se sobrepõem; a bússola fica na coerência.
  function bussola() {
    var b = "";
    b += '<circle cx="140" cy="96" r="64" class="f-as s s-a a-in-left" fill-opacity=".55"/>';
    b += '<circle cx="220" cy="96" r="64" class="f-ts s s-t a-in-right" fill-opacity=".55"/>';
    b += text(104, 92, "Visão de", "", "middle", 0.5);
    b += text(104, 107, "trabalho", "", "middle", 0.5);
    b += text(256, 92, "Visão de", "", "middle", 0.6);
    b += text(256, 107, "vida", "", "middle", 0.6);
    b += '<g class="a-pop"' + d(0.7) + '><circle cx="180" cy="90" r="17" class="f-s s"/>' +
      '<g class="compass-needle" style="transform-origin:180px 90px"><path d="M180,76 L185,90 L175,90 z" class="f-a"/><path d="M180,104 L185,90 L175,90 z" class="f-m"/></g></g>';
    b += '<line x1="180" y1="108" x2="180" y2="170" class="s s-a a-draw" pathLength="1"' + d(1) + "/>";
    b += text(180, 184, "coerência", "ta", "middle", 1.2);
    return svg("bussola", 360, 192, "Dois círculos, visão de trabalho e visão de vida, se sobrepõem; na interseção fica a bússola da coerência.", b);
  }

  // 4. Registros do diário num gráfico engajamento × energia.
  function diario() {
    var x0 = 50, x1 = 330, yTop = 18, yMid = 104, yBot = 190;
    var X = function (e) { return x0 + (e / 10) * (x1 - x0); };
    var Y = function (n) { return yMid - (n / 5) * (yMid - yTop); };
    var b = "";
    b += '<rect x="' + X(5) + '" y="' + yTop + '" width="' + (x1 - X(5)) + '" height="' + (yMid - yTop) + '" class="f-as a-fade"' + d(0.9) + "/>";
    b += '<rect x="' + x0 + '" y="' + yMid + '" width="' + (X(5) - x0) + '" height="' + (yBot - yMid) + '" class="f-s2 a-fade"' + d(0.9) + "/>";
    b += text(X(5) + 6, yTop + 14, "dá energia e flow", "ta", "start", 1.1);
    b += text(X(5) - 6, yBot - 8, "drena", "tm", "end", 1.1);
    b += '<line x1="' + x0 + '" y1="' + yTop + '" x2="' + x0 + '" y2="' + yBot + '" class="s s-m"/>';
    b += '<line x1="' + x0 + '" y1="' + yMid + '" x2="' + x1 + '" y2="' + yMid + '" class="s s-m" stroke-dasharray="3 4"/>';
    b += text(x0 - 6, yTop + 4, "+5", "tm", "end") + text(x0 - 6, yMid + 4, "0", "tm", "end") + text(x0 - 6, yBot + 4, "−5", "tm", "end");
    b += text(x0, yBot + 16, "0", "tm", "middle") + text(X(5), yBot + 16, "5", "tm", "middle") + text(x1, yBot + 16, "10", "tm", "middle");
    b += text((x0 + x1) / 2, yBot + 30, "engajamento", "", "middle");
    b += '<text x="16" y="' + yMid + '" text-anchor="middle" transform="rotate(-90 16 ' + yMid + ')">energia</text>';
    var pts = [[8, 3], [3, -2], [9, 4], [1, -4], [6, 1], [4, -1], [7, 2], [2, -3], [5, 0.5], [8.5, 1.5], [3.5, 2], [6.5, -1.5]];
    pts.forEach(function (p, i) {
      var cls = p[0] >= 5 && p[1] > 0 ? "f-a" : p[0] < 5 && p[1] < 0 ? "f-m" : "f-t";
      b += '<circle cx="' + r1(X(p[0])) + '" cy="' + r1(Y(p[1])) + '" r="5" class="' + cls + ' a-pop"' + d(0.15 + i * 0.09) + "/>";
    });
    b += '<circle cx="' + r1(X(9)) + '" cy="' + r1(Y(4)) + '" r="5" class="halo s s-a a-pulse"' + d(1.6) + "/>";
    return svg("diario", 360, 226, "Gráfico de energia por engajamento: registros no canto superior direito dão energia e flow; no inferior esquerdo, drenam.", b);
  }

  // 5. Mapa mental: tema, associações em camadas e duas palavras combinadas numa ideia.
  function ideacao() {
    var cx = 180, cy = 104;
    var l1 = [["viagem", -90], ["oficina", -18], ["cidade", 54], ["infância", 126], ["liberdade", 198]];
    // Os ramos da segunda camada entortam 22° para os rótulos não se cruzarem.
    var l2 = [["mapas", -68], ["ferramentas", 4], ["mobilidade", 76], ["ensinar", 104], ["estrada", 176]];
    var b = "";
    l1.forEach(function (n, i) {
      var p = polar(cx, cy, 52, n[1]), q = polar(cx, cy, 90, l2[i][1]);
      b += '<line x1="' + cx + '" y1="' + cy + '" x2="' + r1(p[0]) + '" y2="' + r1(p[1]) + '" class="s s-m a-draw" pathLength="1"' + d(0.2 + i * 0.08) + "/>";
      b += '<line x1="' + r1(p[0]) + '" y1="' + r1(p[1]) + '" x2="' + r1(q[0]) + '" y2="' + r1(q[1]) + '" class="s s-m a-draw" pathLength="1"' + d(0.7 + i * 0.08) + "/>";
    });
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="24" class="f-as a-pop"/>' + text(cx, cy + 4, "bicicleta", "ta", "middle");
    l1.forEach(function (n, i) {
      var p = polar(cx, cy, 52, n[1]);
      b += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="4" class="f-m a-pop"' + d(0.4 + i * 0.08) + "/>";
      var lx = p[0] + (Math.cos(n[1] * Math.PI / 180) > 0.2 ? 8 : Math.cos(n[1] * Math.PI / 180) < -0.2 ? -8 : 0);
      var anchor = lx > p[0] ? "start" : lx < p[0] ? "end" : "middle";
      var ly = p[1] + (n[1] === -90 ? -8 : 4);
      if (n[1] === -90) { lx = p[0] - 8; anchor = "end"; ly = p[1] + 2; }
      b += '<text x="' + r1(lx) + '" y="' + r1(ly) + '" text-anchor="' + anchor + '" class="tm a-fade"' + d(0.45 + i * 0.08) + ">" + n[0] + "</text>";
    });
    l2.forEach(function (n, i) {
      var q = polar(cx, cy, 90, n[1]);
      var hot = i === 2 || i === 3;
      b += '<circle cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" r="' + (hot ? 6 : 4) + '" class="' + (hot ? "f-a" : "f-m") + ' a-pop"' + d(0.9 + i * 0.08) + "/>";
      var cos = Math.cos(n[1] * Math.PI / 180);
      var lx = q[0] + (cos > 0.2 ? 10 : cos < -0.2 ? -10 : 0);
      var anchor = cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle";
      var ly = q[1] + (n[1] === -90 ? -10 : 4);
      b += '<text x="' + r1(lx) + '" y="' + r1(ly) + '" text-anchor="' + anchor + '" class="' + (hot ? "ta" : "tm") + ' a-fade"' + d(0.95 + i * 0.08) + ">" + n[0] + "</text>";
    });
    var a = polar(cx, cy, 90, 76), c = polar(cx, cy, 90, 104);
    b += '<path d="M' + r1(a[0]) + "," + r1(a[1] + 6) + " L" + cx + "," + (cy + 118) + " L" + r1(c[0]) + "," + r1(c[1] + 6) + '" class="s s-a a-draw" stroke-width="2" stroke-linejoin="round" pathLength="1"' + d(1.5) + "/>";
    b += '<rect x="104" y="' + (cy + 114) + '" width="152" height="26" rx="13" class="f-a a-pop"' + d(2.1) + "/>";
    b += '<text x="180" y="' + (cy + 131) + '" text-anchor="middle" class="t-inv a-fade"' + d(2.2) + ">escola de bike urbana</text>";
    return svg("ideacao", 360, 250, "Mapa mental: o tema bicicleta se ramifica em associações; mobilidade e ensinar se combinam na ideia escola de bike urbana.", b);
  }

  // 6. Três caminhos que saem de hoje e atravessam cinco anos.
  function odisseia() {
    var sx = 30, sy = 92;
    var ends = [[322, 34, "Vida 1 · o que já faço"], [322, 92, "Vida 2 · se a 1 acabasse"], [322, 146, "Vida 3 · sem limite de dinheiro"]];
    var b = "";
    for (var yr = 1; yr <= 5; yr++) {
      var x = sx + (yr * (322 - sx)) / 5;
      b += '<line x1="' + r1(x) + '" y1="18" x2="' + r1(x) + '" y2="172" class="s s-grid" stroke-dasharray="2 4"/>';
      b += text(x, 188, "ano " + yr, "tm", "middle");
    }
    ends.forEach(function (e, i) {
      var path = "M" + sx + "," + sy + " C" + (sx + 80) + "," + sy + " " + (sx + 90) + "," + e[1] + " " + (sx + 150) + "," + e[1] + " L" + e[0] + "," + e[1];
      b += '<path d="' + path + '" class="s ' + (i === 2 ? "s-a" : i === 1 ? "s-t" : "s-m") + ' a-draw" stroke-width="2.5" stroke-linecap="round" pathLength="1"' + d(0.3 + i * 0.35) + "/>";
      b += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="6" class="' + (i === 2 ? "f-a" : i === 1 ? "f-t" : "f-m") + ' a-pop"' + d(1.3 + i * 0.35) + "/>";
      b += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="6" class="halo s ' + (i === 2 ? "s-a" : i === 1 ? "s-t" : "s-m") + ' a-pulse"' + d(2.4 + i * 0.8) + "/>";
      b += '<text x="' + (e[0] - 12) + '" y="' + (e[1] + (i === 2 ? 19 : -9)) + '" text-anchor="end" class="a-fade"' + d(1.4 + i * 0.35) + ">" + e[2] + "</text>";
    });
    b += '<circle cx="' + sx + '" cy="' + sy + '" r="7" class="f-s s s-a a-pop"/>' + text(sx, sy + 24, "hoje", "ta", "middle");
    return svg("odisseia", 360, 196, "Três caminhos saem de hoje e atravessam cinco anos: vida 1, o que já faço; vida 2, se a vida 1 acabasse; vida 3, se dinheiro e imagem não importassem.", b);
  }

  // 7. Ciclo pergunta → protótipo → aprendizado.
  function prototipos() {
    var cx = 180, cy = 104, R = 72;
    var nodes = [["Pergunta", -90], ["Protótipo", 30], ["Aprendizado", 150]];
    var b = arrowDefs("ar-proto");
    var arcs = [[-66, 6, "testar", -30, "start"], [54, 126, "observar", 90, "middle"], [174, 246, "nova pergunta", 210, "end"]];
    arcs.forEach(function (a, i) {
      var p = polar(cx, cy, R, a[0]), q = polar(cx, cy, R, a[1]);
      b += '<path d="M' + r1(p[0]) + "," + r1(p[1]) + " A" + R + "," + R + " 0 0 1 " + r1(q[0]) + "," + r1(q[1]) + '" class="s s-m a-draw" stroke-width="1.5" marker-end="url(#ar-proto)" pathLength="1"' + d(0.4 + i * 0.3) + "/>";
      var m = polar(cx, cy, R + 16, a[3]);
      b += '<text x="' + r1(m[0] + (a[4] === "start" ? 4 : a[4] === "end" ? -4 : 0)) + '" y="' + r1(m[1] + (a[3] === 90 ? 8 : 0)) + '" text-anchor="' + a[4] + '" class="tm a-fade"' + d(0.6 + i * 0.3) + ">" + a[2] + "</text>";
    });
    b += '<circle cx="' + cx + '" cy="' + (cy - R) + '" r="5" class="f-a a-orbit" style="transform-origin:' + cx + "px " + cy + 'px"/>';
    nodes.forEach(function (n, i) {
      var p = polar(cx, cy, R, n[1]);
      b += '<g class="a-pop"' + d(i * 0.15) + '><rect x="' + r1(p[0] - 52) + '" y="' + r1(p[1] - 14) + '" width="104" height="28" rx="14" class="' + (i === 1 ? "f-a" : "f-s2 s s-m") + '"/>' +
        '<text x="' + r1(p[0]) + '" y="' + r1(p[1] + 4) + '" text-anchor="middle"' + (i === 1 ? ' class="t-inv"' : "") + ">" + n[0] + "</text></g>";
    });
    b += text(cx, cy + 4, "conversa ou", "tm", "middle") + text(cx, cy + 18, "experiência", "tm", "middle");
    return svg("prototipos", 360, 206, "Ciclo de prototipação: uma pergunta vira um protótipo, conversa ou experiência, que gera aprendizado e uma nova pergunta.", b);
  }

  // 8. Funil: reunir muitas opções, reduzir a poucas, escolher uma, deixar ir as outras.
  function escolha() {
    var b = "";
    b += '<path d="M30,26 L130,56 L230,80 L330,86 L330,126 L230,132 L130,156 L30,186 z" class="f-s2 a-fade"/>';
    var col1 = [], col2 = [];
    for (var i = 0; i < 10; i++) col1.push([58 + (i % 2) * 34, 44 + Math.floor(i / 2) * 30]);
    col2 = [[150, 78], [150, 106], [150, 134], [184, 92], [184, 120]];
    col1.forEach(function (p, i) {
      b += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" class="f-m a-pop-dim"' + d(i * 0.06) + "/>";
    });
    col2.forEach(function (p, i) {
      var chosen = i === 1;
      b += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" class="' + (chosen ? "f-t" : "f-t a-pop-drift") + (chosen ? " a-pop" : "") + '"' + d(1 + i * 0.1) + "/>";
    });
    b += '<circle cx="282" cy="106" r="13" class="f-a a-pop"' + d(2.2) + "/>";
    b += '<circle cx="282" cy="106" r="13" class="halo s s-a a-pulse"' + d(2.8) + "/>";
    b += '<path d="M164,106 L262,106" class="s s-a a-draw" stroke-width="2" pathLength="1"' + d(1.9) + "/>";
    var labels = [[75, "reunir"], [167, "reduzir a 3–5"], [282, "escolher"]];
    labels.forEach(function (l, i) { b += '<text x="' + l[0] + '" y="208" text-anchor="middle" class="a-fade"' + d(0.3 + i * 0.8) + ">" + l[1] + "</text>"; });
    b += text(282, 140, "e deixar ir", "tm", "middle", 2.6);
    return svg("escolha", 360, 216, "Funil de escolha: muitas opções são reduzidas a três a cinco, uma é escolhida e as outras são deixadas ir.", b);
  }

  // 9. Cada fracasso cai numa de três caixas.
  function fracasso() {
    var bins = [[66, "Deslize", "corrija e siga"], [180, "Fraqueza", "evite o gatilho"], [294, "Oportunidade", "aprenda"]];
    var b = "";
    bins.forEach(function (bn, i) {
      var hot = i === 2;
      b += '<path d="M' + (bn[0] - 52) + ",128 L" + (bn[0] - 42) + ",170 L" + (bn[0] + 42) + ",170 L" + (bn[0] + 52) + ',128" class="s ' + (hot ? "s-a" : "s-m") + '" stroke-width="2" stroke-linejoin="round"' + (hot ? ' fill-opacity="1"' : "") + "/>";
      if (hot) b += '<path d="M' + (bn[0] - 52) + ",128 L" + (bn[0] - 42) + ",170 L" + (bn[0] + 42) + ",170 L" + (bn[0] + 52) + ',128 z" class="f-as"/>';
      b += text(bn[0], 156, bn[1], hot ? "ta" : "", "middle");
      b += text(bn[0], 190, bn[2], "tm", "middle");
    });
    bins.forEach(function (bn, i) {
      b += '<g class="a-fall" style="--dx:' + (bn[0] - 180) + "px;--d:" + i * 3 + 's"><rect x="150" y="22" width="60" height="38" rx="6" class="f-s s s-m"/>' +
        '<path d="M168,34 L192,48 M192,34 L168,48" class="s s-n" stroke-width="2.5" stroke-linecap="round"/></g>';
    });
    b += text(180, 84, "algo deu errado", "tm", "middle");
    return svg("fracasso", 360, 200, "Cada fracasso é classificado em uma de três caixas: deslize, corrija e siga; fraqueza, evite o gatilho; oportunidade de crescimento, aprenda.", b);
  }

  // 10. Você no centro, conectado aos papéis da equipe.
  function equipe() {
    var cx = 180, cy = 100;
    var roles = [["Apoiadores", 62, 44], ["Mentores", 298, 44], ["Família e amigos", 62, 158], ["Time de design", 298, 158]];
    var b = "";
    roles.forEach(function (r, i) {
      b += '<line x1="' + cx + '" y1="' + cy + '" x2="' + r[1] + '" y2="' + r[2] + '" class="s ' + (i === 3 ? "s-a" : "s-t") + ' a-flow" stroke-width="2"' + d(i * 0.2) + "/>";
    });
    roles.forEach(function (r, i) {
      var hot = i === 3;
      b += '<g class="a-pop"' + d(0.2 + i * 0.12) + '><rect x="' + (r[1] - 56) + '" y="' + (r[2] - 15) + '" width="112" height="30" rx="15" class="' + (hot ? "f-a" : "f-ts") + '"/>' +
        '<text x="' + r[1] + '" y="' + (r[2] + 4) + '" text-anchor="middle"' + (hot ? ' class="t-inv"' : "") + ">" + r[0] + "</text></g>";
    });
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="26" class="f-s s s-a a-pop" stroke-width="2"/>' + text(cx, cy + 4, "você", "ta", "middle");
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="26" class="halo s s-a a-pulse"' + d(1) + "/>";
    return svg("equipe", 360, 200, "Você no centro, em troca constante com apoiadores, mentores, família e amigos e o time de design.", b);
  }

  // Ciclo de uso: preencher → IA avalia → tarefas → dia a dia → revisão semanal.
  function ciclo(id, labels, back, label) {
    var xs = [48, 136, 224, 312], y = 64;
    var b = arrowDefs("ar-" + id);
    for (var i = 0; i < 3; i++) {
      b += '<path d="M' + (xs[i] + 26) + "," + y + " L" + (xs[i + 1] - 28) + "," + y + '" class="s s-m a-flow" stroke-width="2" marker-end="url(#ar-' + id + ')"' + d(i * 0.2) + "/>";
    }
    b += '<path d="M' + xs[3] + "," + (y + 44) + " C" + xs[3] + "," + (y + 86) + " " + xs[0] + "," + (y + 86) + " " + xs[0] + "," + (y + 44) + '" class="s s-a a-flow" stroke-width="2" marker-end="url(#ar-' + id + ')"/>';
    b += text((xs[0] + xs[3]) / 2, y + 102, back, "ta", "middle");
    var icons = [
      // páginas
      function (x) { return '<rect x="' + (x - 11) + '" y="' + (y - 15) + '" width="20" height="26" rx="3" class="f-s2 s s-m"/><rect x="' + (x - 7) + '" y="' + (y - 11) + '" width="20" height="26" rx="3" class="f-s s s-m"/><path d="M' + (x - 3) + "," + (y - 3) + " h12 M" + (x - 3) + "," + (y + 3) + " h12 M" + (x - 3) + "," + (y + 9) + ' h8" class="s s-m"/>'; },
      // faísca da IA
      function (x) { return '<path d="M' + x + "," + (y - 16) + " Q" + (x + 2) + "," + (y - 2) + " " + (x + 16) + "," + y + " Q" + (x + 2) + "," + (y + 2) + " " + x + "," + (y + 16) + " Q" + (x - 2) + "," + (y + 2) + " " + (x - 16) + "," + y + " Q" + (x - 2) + "," + (y - 2) + " " + x + "," + (y - 16) + ' z" class="f-a spark"/>'; },
      // tarefas
      function (x) { return '<rect x="' + (x - 14) + '" y="' + (y - 15) + '" width="28" height="30" rx="4" class="f-s s s-m"/><rect x="' + (x - 9) + '" y="' + (y - 9) + '" width="6" height="6" rx="1" class="s s-t"/><path d="M' + (x - 8) + "," + (y - 6) + " l2,2 l3,-4" + '" class="s s-t check-draw" pathLength="1"/><path d="M' + (x - 0) + "," + (y - 6) + ' h8" class="s s-m"/><rect x="' + (x - 9) + '" y="' + (y + 3) + '" width="6" height="6" rx="1" class="s s-m"/><path d="M' + x + "," + (y + 6) + ' h8" class="s s-m"/>'; },
      // calendário
      function (x) { return '<rect x="' + (x - 15) + '" y="' + (y - 13) + '" width="30" height="28" rx="4" class="f-s s s-m"/><path d="M' + (x - 15) + "," + (y - 5) + " h30" + '" class="s s-m"/><circle cx="' + (x - 6) + '" cy="' + (y + 3) + '" r="2" class="f-m"/><circle cx="' + x + '" cy="' + (y + 3) + '" r="2" class="f-a"/><circle cx="' + (x + 6) + '" cy="' + (y + 3) + '" r="2" class="f-m"/><circle cx="' + (x - 6) + '" cy="' + (y + 9) + '" r="2" class="f-m"/>'; }
    ];
    xs.forEach(function (x, i) {
      b += '<g class="a-pop"' + d(i * 0.15) + '><circle cx="' + x + '" cy="' + y + '" r="26" class="' + (i === 1 ? "f-as" : "f-s2") + '"/>' + icons[i](x) + "</g>";
      b += '<text x="' + x + '" y="' + (y + 42) + '" text-anchor="middle" class="a-fade"' + d(0.2 + i * 0.15) + ">" + labels[i] + "</text>";
    });
    return svg(id, 360, 176, label, b);
  }

  window.ILLUSTRATIONS = {
    inicio: {
      svg: ciclo("inicio", ["Etapas 1–10", "IA avalia", "Tarefas", "Dia a dia"], "revise toda semana e ajuste",
        "Ciclo de uso: você preenche as etapas, a IA avalia, gera tarefas, você age no dia a dia e revisa toda semana."),
      caption: "O método é um ciclo: reflita, teste no dia a dia, revise e ajuste."
    },
    mentalidades: { svg: mentalidades(), caption: "Cinco jeitos de pensar que você vai usar em todas as etapas." },
    painel: { svg: painel(), caption: "Quatro medidores. Nenhum precisa estar cheio: o importante é saber onde mexer." },
    bussola: { svg: bussola(), caption: "Quando o que você acredita sobre trabalho e sobre vida se encontram, sua vida fica coerente." },
    diario: { svg: diario(), caption: "Cada registro vira um ponto. Com o tempo, os cantos do gráfico mostram seus padrões." },
    ideacao: { svg: ideacao(), caption: "Associe livremente em camadas e combine palavras das pontas numa ideia nova." },
    odisseia: { svg: odisseia(), caption: "Três vidas possíveis, cada uma com sua linha do tempo de cinco anos." },
    prototipos: { svg: prototipos(), caption: "Pequenos testes respondem perguntas antes das grandes decisões." },
    escolha: { svg: escolha(), caption: "Muitas opções viram poucas, depois uma. As outras você deixa ir." },
    fracasso: { svg: fracasso(), caption: "Classifique cada erro. Só as oportunidades de crescimento pedem trabalho." },
    equipe: { svg: equipe(), caption: "Design de vida é colaborativo: cada papel ajuda de um jeito." },
    ia: {
      svg: ciclo("ia", ["Suas etapas", "IA lê tudo", "Plano de ação", "Você age"], "revisão semanal com a IA",
        "Como a IA ajuda: lê suas etapas, cria um plano de ação com tarefas, você age no dia a dia e faz a revisão semanal."),
      caption: "A IA transforma o que você escreveu em tarefas; a revisão semanal fecha o ciclo."
    }
  };
})();
