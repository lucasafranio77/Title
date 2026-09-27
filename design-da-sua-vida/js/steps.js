/*
 * Conteúdo das etapas, baseado nas ferramentas do livro
 * "O Design da Sua Vida" (Designing Your Life), de Bill Burnett e Dave Evans.
 *
 * Tipos de campo: text, textarea, range, select, list (linhas repetíveis com colunas).
 */
window.STEPS = [
  {
    id: "mentalidades",
    num: 1,
    title: "Mentalidades do designer",
    short: "Como um designer pensa",
    chapter: "Introdução do livro",
    intro:
      "<p>Antes das ferramentas, o livro apresenta <strong>cinco mentalidades</strong> que um designer usa para resolver problemas. " +
      "Você não precisa dominá-las agora: o objetivo aqui é perceber onde já está forte e onde precisa praticar.</p>" +
      "<ul>" +
      "<li><strong>Curiosidade</strong> – tudo fica interessante quando você olha com curiosidade; é ela que abre novas possibilidades.</li>" +
      "<li><strong>Tentar coisas (viés para a ação)</strong> – designers não ficam só pensando: constroem pequenos testes e aprendem com eles.</li>" +
      "<li><strong>Reformular problemas</strong> – muitas vezes estamos resolvendo a pergunta errada. Reformular é olhar de outro ângulo.</li>" +
      "<li><strong>Consciência do processo</strong> – design é bagunçado; saber em que fase você está evita frustração.</li>" +
      "<li><strong>Colaboração radical</strong> – você não projeta sua vida sozinho; as melhores ideias vêm de conversar com outras pessoas.</li>" +
      "</ul>",
    how: [
      "Dê uma nota de 0 a 10 para o quanto você pratica cada mentalidade hoje. Seja honesto: ninguém mais vai ver.",
      "Escreva um exemplo recente em que você usou (ou deixou de usar) a mentalidade.",
      "Escolha UMA mentalidade para praticar conscientemente nas próximas semanas."
    ],
    example:
      "<p><em>Curiosidade: 4/10.</em> “Faz tempo que não aprendo nada novo fora do trabalho. Quando alguém fala de um assunto diferente, eu mudo de assunto.”</p>" +
      "<p><em>Mentalidade para praticar:</em> “Viés para a ação – eu penso demais e não testo nada. Vou fazer uma coisa pequena por semana em vez de planejar.”</p>",
    faq: [
      { q: "E se eu não souber que nota dar?", a: "Use a primeira nota que vier à cabeça. A ideia é ter um ponto de partida, não uma medição exata. Você pode voltar e ajustar depois." },
      { q: "Preciso preencher todos os exemplos?", a: "Não é obrigatório, mas exemplos concretos ajudam muito na avaliação com IA no final. Um ou dois já são ótimos." }
    ],
    sections: [
      {
        title: "Autoavaliação",
        fields: [
          { id: "m_curiosidade", type: "range", label: "Curiosidade", min: 0, max: 10 },
          { id: "m_acao", type: "range", label: "Tentar coisas (viés para a ação)", min: 0, max: 10 },
          { id: "m_reformular", type: "range", label: "Reformular problemas", min: 0, max: 10 },
          { id: "m_processo", type: "range", label: "Consciência do processo", min: 0, max: 10 },
          { id: "m_colaboracao", type: "range", label: "Colaboração radical", min: 0, max: 10 }
        ]
      },
      {
        title: "Reflexão",
        fields: [
          { id: "m_exemplos", type: "textarea", label: "Exemplos recentes", hint: "Situações em que você usou (ou não usou) essas mentalidades.", placeholder: "Ex.: Semana passada fiquei três dias pensando se deveria fazer um curso, em vez de assistir uma aula grátis para testar…" },
          { id: "m_foco", type: "select", label: "Mentalidade que vou praticar primeiro", options: ["", "Curiosidade", "Tentar coisas (viés para a ação)", "Reformular problemas", "Consciência do processo", "Colaboração radical"] },
          { id: "m_como", type: "textarea", label: "Como vou praticar", rows: 3, placeholder: "Ex.: Toda sexta vou testar uma coisa pequena e nova." }
        ]
      }
    ]
  },

  {
    id: "painel",
    num: 2,
    title: "Onde você está",
    short: "Painel Saúde · Trabalho · Diversão · Amor",
    chapter: "Cap. 1 – Comece de onde você está",
    intro:
      "<p>Não dá para traçar um caminho sem saber onde você está. O livro propõe olhar sua vida em <strong>quatro áreas</strong>, como os medidores de um painel de carro:</p>" +
      "<ul>" +
      "<li><strong>Saúde</strong> – corpo, mente e emoções. Você está bem física e mentalmente?</li>" +
      "<li><strong>Trabalho</strong> – o que você faz para contribuir com o mundo, pago ou não (emprego, estudo, voluntariado, cuidar da casa).</li>" +
      "<li><strong>Diversão</strong> – atividades que te dão alegria pelo simples fato de fazê-las, sem outro objetivo.</li>" +
      "<li><strong>Amor</strong> – conexões com pessoas: família, amigos, parceiro(a), comunidade.</li>" +
      "</ul>" +
      "<p>Não existe painel “perfeito”, com tudo no 10. O equilíbrio muda conforme a fase da vida. O importante é saber o que está baixo e decidir se você quer mexer nisso.</p>" +
      "<p>Depois, você vai identificar um problema para trabalhar e checar se ele é um <strong>problema de gravidade</strong>: algo que não dá para mudar (como a gravidade). Esses não se resolvem, se aceitam — e aí você reformula a pergunta para algo sobre o qual pode agir.</p>",
    how: [
      "Para cada área, escreva algumas frases sobre como ela está hoje. Descreva antes de dar nota.",
      "Dê uma nota de 0 (vazio) a 10 (cheio) para cada área.",
      "Olhe para o painel inteiro: alguma área está pedindo atenção? Alguma surpresa?",
      "Escreva o problema que você mais quer resolver e pergunte-se: “Dá para agir sobre isso?”. Se não der, é gravidade — reformule."
    ],
    example:
      "<p><em>Saúde (4/10):</em> “Durmo mal, parei a academia há 6 meses, ando ansioso no domingo à noite.”</p>" +
      "<p><em>Problema:</em> “Poetas ganham pouco dinheiro.” → <strong>Isso é gravidade</strong> (o mercado não vai mudar por mim). " +
      "<em>Reformulação:</em> “Como posso escrever poesia com regularidade tendo uma fonte de renda estável?”</p>",
    faq: [
      { q: "O que conta como “trabalho” se eu não tenho emprego?", a: "Qualquer contribuição: estudar, cuidar dos filhos ou da casa, voluntariado, projetos pessoais. Trabalho é o que você faz para contribuir, não só o que paga." },
      { q: "Qual a diferença entre diversão e descanso?", a: "Diversão é algo que te dá alegria enquanto você faz, com um toque de brincadeira. Rolar o celular por horas geralmente é distração, não diversão. Pense: quando foi a última vez que você perdeu a noção do tempo se divertindo?" },
      { q: "Como sei se meu problema é de gravidade?", a: "Pergunte: “Existe alguma ação que eu, pessoalmente, possa tomar para mudar isso?”. Se a resposta for não (leis, mercado, idade, fatos do passado), aceite o fato e reformule para algo que você pode mudar." }
    ],
    sections: [
      {
        title: "Saúde",
        fields: [
          { id: "p_saude_desc", type: "textarea", label: "Como está sua saúde (corpo, mente, emoções)?", rows: 3 },
          { id: "p_saude", type: "range", label: "Nota", min: 0, max: 10 }
        ]
      },
      {
        title: "Trabalho",
        fields: [
          { id: "p_trabalho_desc", type: "textarea", label: "Como está seu trabalho / contribuição?", rows: 3 },
          { id: "p_trabalho", type: "range", label: "Nota", min: 0, max: 10 }
        ]
      },
      {
        title: "Diversão",
        fields: [
          { id: "p_diversao_desc", type: "textarea", label: "O que você faz só pela alegria de fazer? Com que frequência?", rows: 3 },
          { id: "p_diversao", type: "range", label: "Nota", min: 0, max: 10 }
        ]
      },
      {
        title: "Amor",
        fields: [
          { id: "p_amor_desc", type: "textarea", label: "Como estão suas relações e conexões?", rows: 3 },
          { id: "p_amor", type: "range", label: "Nota", min: 0, max: 10 }
        ]
      },
      {
        title: "O problema que quero trabalhar",
        fields: [
          { id: "p_observacao", type: "textarea", label: "O que o painel te mostra?", rows: 3, placeholder: "Ex.: Trabalho está ocupando tudo e diversão está zerada." },
          { id: "p_problema", type: "textarea", label: "Problema que eu quero resolver", rows: 2 },
          { id: "p_gravidade", type: "select", label: "Dá para agir sobre ele?", options: ["", "Sim, dá para agir", "Não – é um problema de gravidade", "Não sei ainda"] },
          { id: "p_reformulacao", type: "textarea", label: "Reformulação (uma versão sobre a qual eu posso agir)", rows: 2, placeholder: "Comece com “Como eu poderia…”" }
        ]
      }
    ]
  },

  {
    id: "bussola",
    num: 3,
    title: "Sua bússola",
    short: "Visão de trabalho + visão de vida",
    chapter: "Cap. 2 – Construindo uma bússola",
    intro:
      "<p>Uma vida bem projetada é uma <strong>vida coerente</strong>: quando quem você é, no que acredita e o que você faz estão conectados. " +
      "Para isso você vai escrever duas reflexões curtas, que funcionam como uma bússola (não um mapa — ela aponta a direção, não o caminho exato).</p>" +
      "<ul>" +
      "<li><strong>Visão de trabalho</strong> – sua filosofia sobre trabalho: para que ele serve? O que é um bom trabalho? Como ele se relaciona com as pessoas, a sociedade, o dinheiro, o crescimento? <em>Não</em> é a descrição do emprego dos sonhos.</li>" +
      "<li><strong>Visão de vida</strong> – sua filosofia de vida: por que estamos aqui? Qual o sentido da vida? Como o indivíduo se relaciona com os outros? Onde entram família, país, o transcendente? O que é bem e mal?</li>" +
      "</ul>" +
      "<p>O livro sugere cerca de <strong>250 palavras cada</strong> (uns 30 minutos de escrita). Depois, você compara as duas e escreve sobre como elas conversam.</p>",
    how: [
      "Reserve 30 minutos sem distrações para a visão de trabalho. Use as perguntas-guia abaixo, mas escreva livremente.",
      "Faça o mesmo para a visão de vida.",
      "Leia as duas juntas e responda: onde elas se complementam? Onde se contradizem? Uma leva à outra?",
      "Não busque perfeição: esta é a versão 1. Você pode reescrever sempre que quiser."
    ],
    example:
      "<p><em>Trecho de visão de trabalho:</em> “Trabalho é a forma de trocar meus talentos por sustento e, ao mesmo tempo, melhorar a vida de alguém. Um bom trabalho me faz crescer e não exige que eu seja outra pessoa…”</p>" +
      "<p><em>Trecho de coerência:</em> “Minha visão de vida valoriza a família acima de tudo, mas meu trabalho atual me faz viajar 3 semanas por mês. Aqui existe um conflito que explica meu cansaço.”</p>",
    faq: [
      { q: "Não tenho uma filosofia de vida pronta. E agora?", a: "Quase ninguém tem. Escreva o que você acredita hoje, mesmo que pareça incompleto ou contraditório. O exercício é justamente descobrir." },
      { q: "Preciso escrever exatamente 250 palavras?", a: "Não. É um guia para ser curto o bastante para caber em 30 minutos e longo o bastante para dizer algo real. O contador abaixo do campo ajuda." },
      { q: "Posso falar de religião ou espiritualidade?", a: "Sim, se fizer parte de quem você é. O livro inclui isso explicitamente na visão de vida." }
    ],
    sections: [
      {
        title: "Visão de trabalho",
        hint: "Por que trabalhar? Para que serve o trabalho? O que significa um bom trabalho, ou um trabalho que vale a pena? Qual a relação entre trabalho e as pessoas, a sociedade, o dinheiro, a experiência e o crescimento?",
        fields: [{ id: "b_trabalho", type: "textarea", label: "Minha visão de trabalho", rows: 9, words: 250 }]
      },
      {
        title: "Visão de vida",
        hint: "Por que estamos aqui? Qual o sentido ou propósito da vida? Qual a relação entre o indivíduo e os outros? Onde entram família, país e o resto do mundo? O que é bom e o que é ruim? Existe algo maior — Deus, algo transcendente? Qual o papel da alegria, da tristeza, da justiça e da injustiça?",
        fields: [{ id: "b_vida", type: "textarea", label: "Minha visão de vida", rows: 9, words: 250 }]
      },
      {
        title: "Coerência",
        hint: "Onde suas visões se complementam? Onde entram em conflito? Uma leva à outra? Como?",
        fields: [
          { id: "b_coerencia", type: "textarea", label: "Como minhas visões se conectam", rows: 6 },
          { id: "b_coerencia_nota", type: "range", label: "Quanto minha vida atual está alinhada com minha bússola?", min: 0, max: 10 }
        ]
      }
    ]
  },

  {
    id: "diario",
    num: 4,
    title: "Diário dos bons momentos",
    short: "Registre energia e engajamento no dia a dia",
    chapter: "Cap. 3 – Encontrando o caminho",
    daily: true,
    intro:
      "<p>Esta é a ferramenta do <strong>dia a dia</strong>. Para descobrir o caminho, você precisa de pistas — e elas estão na sua rotina. " +
      "O <strong>Diário dos bons momentos</strong> registra, ao longo de algumas semanas, duas coisas sobre cada atividade:</p>" +
      "<ul>" +
      "<li><strong>Engajamento</strong> (0 a 10) – quão absorvido você estava. No máximo, é o estado de <em>flow</em>: o tempo passa e você nem percebe.</li>" +
      "<li><strong>Energia</strong> (-5 a +5) – a atividade te deu energia (positivo) ou te drenou (negativo)?</li>" +
      "</ul>" +
      "<p>Depois de 1 a 3 semanas, você reflete sobre os padrões usando o método <strong>AEIOU</strong>: " +
      "<strong>A</strong>tividades, <strong>E</strong>nvironments (ambientes), <strong>I</strong>nterações, <strong>O</strong>bjetos e <strong>U</strong>suários (as pessoas envolvidas) — a sigla vem do inglês.</p>",
    how: [
      "Todos os dias (ou dia sim, dia não), registre de 3 a 6 atividades marcantes: reuniões, tarefas, hobbies, conversas.",
      "Para cada uma, dê as notas de engajamento e energia. Anote algo curto sobre o porquê.",
      "Use o botão “+ Adicionar registro” — a data de hoje já vem preenchida.",
      "Uma vez por semana, olhe os registros (os mais altos e os mais baixos aparecem destacados) e preencha a reflexão AEIOU.",
      "Anote os insights: o que te energiza? O que te drena? O que te deixa em flow?"
    ],
    example:
      "<p><em>Registro:</em> “Reunião de planejamento com o time — engajamento 8, energia +3 — adoro organizar ideias em grupo quando todos participam.”</p>" +
      "<p><em>AEIOU – Interações:</em> “Me energizo em conversas pequenas (2 a 4 pessoas) com objetivo claro. Reuniões grandes e sem pauta me drenam.”</p>" +
      "<p><em>Insight:</em> “Ensinar alguém sempre aparece com energia alta, mesmo quando é cansativo.”</p>",
    faq: [
      { q: "Quantos registros preciso fazer?", a: "O livro sugere registrar por pelo menos três semanas. Com cerca de 30 a 50 registros os padrões já começam a aparecer." },
      { q: "Engajamento e energia não são a mesma coisa?", a: "Não. Você pode estar muito engajado e sair esgotado (ex.: uma negociação difícil), ou pouco engajado e com energia (ex.: uma caminhada leve). É o cruzamento dos dois que traz as pistas." },
      { q: "O que é o AEIOU na prática?", a: "São cinco lentes para olhar as atividades de alta ou baixa energia: O que exatamente você fazia (Atividade)? Onde estava (Ambiente)? Com quem e como interagia (Interações)? Com que objetos/ferramentas (Objetos)? Quem mais estava lá e que papel tinha (Usuários)?" },
      { q: "Esqueci de registrar alguns dias. Tudo bem?", a: "Tudo bem. Registre quando lembrar, mesmo que seja do dia anterior. Consistência importa mais que perfeição." }
    ],
    sections: [
      {
        title: "Registros",
        hint: "Engajamento: 0 = entediado, 10 = flow total. Energia: -5 = me drenou muito, +5 = me encheu de energia.",
        fields: [
          {
            id: "d_registros",
            type: "list",
            label: "Atividades",
            addLabel: "+ Adicionar registro",
            newestFirst: true,
            columns: [
              { id: "data", label: "Data", type: "date", default: "today" },
              { id: "atividade", label: "Atividade", type: "text", wide: true },
              { id: "engajamento", label: "Engajamento (0–10)", type: "number", min: 0, max: 10 },
              { id: "energia", label: "Energia (-5 a +5)", type: "number", min: -5, max: 5 },
              { id: "obs", label: "Por quê? / observações", type: "text", wide: true }
            ]
          }
        ]
      },
      {
        title: "Reflexão AEIOU",
        hint: "Olhe para os registros com energia/engajamento mais altos e mais baixos.",
        fields: [
          { id: "d_a", type: "textarea", label: "A – Atividades", hint: "Eram atividades estruturadas ou livres? Você liderava ou participava?", rows: 3 },
          { id: "d_e", type: "textarea", label: "E – Ambientes", hint: "Onde você estava? Como era o lugar e como você se sentia nele?", rows: 3 },
          { id: "d_i", type: "textarea", label: "I – Interações", hint: "Com pessoas ou máquinas? Formais ou informais? Novas ou conhecidas?", rows: 3 },
          { id: "d_o", type: "textarea", label: "O – Objetos", hint: "Estava usando algum objeto ou ferramenta que fez diferença?", rows: 3 },
          { id: "d_u", type: "textarea", label: "U – Usuários (pessoas)", hint: "Quem mais estava lá e como influenciou a experiência?", rows: 3 }
        ]
      },
      {
        title: "Insights",
        fields: [
          { id: "d_insights", type: "textarea", label: "O que eu aprendi sobre mim", rows: 5, placeholder: "Me energiza… / Me drena… / Entro em flow quando…" }
        ]
      }
    ]
  },

  {
    id: "ideacao",
    num: 5,
    title: "Destravando: ideias",
    short: "Mapas mentais e crenças disfuncionais",
    chapter: "Cap. 4 – Como sair do lugar",
    intro:
      "<p>Quando estamos travados, costumamos nos agarrar à primeira ideia. Designers fazem o contrário: <strong>geram muitas ideias</strong> antes de escolher. " +
      "A ferramenta do livro para isso é o <strong>mapa mental</strong>:</p>" +
      "<ol>" +
      "<li><strong>Escolha um tema</strong> central — de preferência algo que apareceu com energia alta no seu diário (ex.: “ensinar”, “natureza”, “bicicleta”).</li>" +
      "<li><strong>Associe livremente</strong>: escreva 5 a 6 palavras ligadas ao tema, depois palavras ligadas a essas, até 3 ou 4 camadas. Rápido, sem julgar.</li>" +
      "<li><strong>Destaque</strong> as palavras das camadas mais externas que chamam sua atenção.</li>" +
      "<li><strong>Combine</strong> duas ou três delas em um conceito de vida ou trabalho — e dê um nome a ele.</li>" +
      "</ol>" +
      "<p>Também vamos trabalhar as <strong>crenças disfuncionais</strong>: frases que você acredita e que te prendem (“já é tarde demais para mudar”). O livro mostra como reformulá-las.</p>",
    how: [
      "Faça pelo menos um mapa mental; o ideal são três (um para cada coisa que te energiza no diário).",
      "Na caixa de associações, escreva uma camada por linha, separando as palavras por vírgula. Não pense muito — velocidade ajuda a fugir do óbvio.",
      "Combine palavras das camadas externas em ideias concretas, mesmo que pareçam malucas.",
      "Liste crenças que te travam e escreva uma reformulação para cada uma."
    ],
    example:
      "<p><em>Tema:</em> Bicicleta<br><em>Camada 1:</em> viagem, liberdade, oficina, infância, cidade<br><em>Camada 2:</em> mapas, estrada, ferramentas, pai, mobilidade…<br><em>Camada 3:</em> fotografia, cicloturismo, ensinar crianças, urbanismo…</p>" +
      "<p><em>Ideia combinada:</em> “Fotografar e documentar rotas de cicloturismo para famílias.”</p>" +
      "<p><em>Crença:</em> “Se eu mudar de carreira, vou jogar fora tudo o que construí.” → <em>Reformulação:</em> “Minha experiência vai comigo; mudar é aproveitar o que aprendi de outro jeito.”</p>",
    faq: [
      { q: "Minhas ideias parecem bobas. Isso é normal?", a: "Muito normal e até desejável. Nesta fase o objetivo é quantidade. As ideias estranhas muitas vezes levam às interessantes. Julgue depois." },
      { q: "Como escolho o tema do mapa?", a: "Use os insights do Diário dos bons momentos: atividades com engajamento e energia altos são ótimos temas. Também pode usar um interesse antigo." },
      { q: "Quais são exemplos de crenças disfuncionais do livro?", a: "“Eu deveria saber onde estou indo agora”, “É tarde demais”, “Preciso encontrar a minha paixão primeiro”, “Tenho que achar a melhor versão possível da minha vida”, “Felicidade é ter tudo resolvido”. Cada uma tem uma reformulação mais útil." }
    ],
    sections: [1, 2, 3].map(function (n) {
      return {
        title: "Mapa mental " + n,
        fields: [
          { id: "i_mapa" + n + "_tema", type: "text", label: "Tema central" },
          { id: "i_mapa" + n + "_assoc", type: "textarea", label: "Associações (uma camada por linha)", rows: 4, placeholder: "Camada 1: …\nCamada 2: …\nCamada 3: …" },
          { id: "i_mapa" + n + "_ideia", type: "textarea", label: "Ideias combinadas (e seus nomes)", rows: 3 }
        ]
      };
    }).concat([
      {
        title: "Crenças disfuncionais → reformulações",
        fields: [
          {
            id: "i_crencas",
            type: "list",
            label: "Crenças",
            addLabel: "+ Adicionar crença",
            columns: [
              { id: "crenca", label: "Crença disfuncional", type: "text", wide: true },
              { id: "reformulacao", label: "Reformulação", type: "text", wide: true }
            ]
          }
        ]
      }
    ])
  },

  {
    id: "odisseia",
    num: 6,
    title: "Planos de Odisseia",
    short: "Três versões da sua vida nos próximos 5 anos",
    chapter: "Cap. 5 – Projete suas vidas",
    intro:
      "<p>Uma das ideias centrais do livro: <strong>você tem muitas vidas possíveis</strong>, não uma única “certa”. " +
      "Para enxergar isso, você vai desenhar <strong>três planos alternativos</strong> para os próximos cinco anos:</p>" +
      "<ol>" +
      "<li><strong>Vida 1 – O que você já faz</strong>: a sua vida atual continuada, ou a ideia que você já vem cultivando.</li>" +
      "<li><strong>Vida 2 – Se a vida 1 acabasse de repente</strong>: se aquele caminho deixasse de existir (a profissão sumiu, a empresa fechou), o que você faria?</li>" +
      "<li><strong>Vida 3 – Se dinheiro e imagem não importassem</strong>: se você tivesse o suficiente e ninguém fosse julgar, que vida viveria?</li>" +
      "</ol>" +
      "<p>Cada plano tem: um <strong>título de até seis palavras</strong>, uma <strong>linha do tempo</strong> de 5 anos (com marcos pessoais também, não só profissionais), " +
      "<strong>três perguntas</strong> que esse plano ajudaria a responder e um <strong>painel</strong> com quatro medidores: " +
      "Recursos (tenho o que preciso?), Gosto (o quanto me empolga?), Confiança (acho que consigo?) e Coerência (combina com minha bússola?).</p>",
    how: [
      "Faça as três. Mesmo que uma pareça improvável, ela ensina algo sobre o que você valoriza.",
      "Comece pela linha do tempo, ano a ano. Inclua trabalho, onde vive, relacionamentos, saúde, experiências.",
      "Dê um título curto e marcante a cada plano.",
      "Escreva três perguntas que o plano levanta (“Eu aguentaria morar longe da família?”).",
      "Preencha os quatro medidores sem pensar muito — é uma leitura intuitiva.",
      "Se puder, apresente os planos para alguém de confiança e observe o que te empolga ao falar."
    ],
    example:
      "<p><em>Vida 3 – “Professora de cerâmica no interior”</em><br>" +
      "Ano 1: curso intensivo de cerâmica; ainda no emprego atual. Ano 2: ateliê no fim de semana; primeiras vendas… Ano 5: escola própria e casa perto da serra.</p>" +
      "<p><em>Perguntas:</em> “Consigo me sustentar com aulas?”, “Eu me adaptaria a uma cidade pequena?”, “Ensinar todo dia continuaria prazeroso?”</p>" +
      "<p><em>Painel:</em> Recursos 3 · Gosto 9 · Confiança 5 · Coerência 8</p>",
    faq: [
      { q: "E se eu não conseguir pensar em três vidas diferentes?", a: "Use as perguntas-guia: a vida 2 é “se a atual sumisse”, a vida 3 é “se dinheiro e opinião dos outros não importassem”. Os mapas mentais da etapa anterior também são ótimas fontes." },
      { q: "Preciso escolher uma delas agora?", a: "Não. O objetivo é abrir possibilidades e perceber o que te atrai. A escolha vem depois, na etapa de prototipação e decisão." },
      { q: "O que é “Coerência” no painel?", a: "É o quanto esse plano combina com sua visão de trabalho e de vida (sua bússola, etapa 3)." }
    ],
    sections: [
      { n: 1, nome: "Vida 1 – O que você já faz" },
      { n: 2, nome: "Vida 2 – Se a vida 1 acabasse" },
      { n: 3, nome: "Vida 3 – Se dinheiro e imagem não importassem" }
    ].map(function (v) {
      var p = "o" + v.n + "_";
      return {
        title: v.nome,
        fields: [
          { id: p + "titulo", type: "text", label: "Título (até 6 palavras)", maxWords: 6 },
          { id: p + "ano1", type: "textarea", label: "Ano 1", rows: 2 },
          { id: p + "ano2", type: "textarea", label: "Ano 2", rows: 2 },
          { id: p + "ano3", type: "textarea", label: "Ano 3", rows: 2 },
          { id: p + "ano4", type: "textarea", label: "Ano 4", rows: 2 },
          { id: p + "ano5", type: "textarea", label: "Ano 5", rows: 2 },
          { id: p + "perguntas", type: "textarea", label: "Três perguntas que este plano levanta", rows: 3 },
          { id: p + "recursos", type: "range", label: "Recursos (tempo, dinheiro, habilidades, contatos)", min: 0, max: 10 },
          { id: p + "gosto", type: "range", label: "Gosto (o quanto me empolga)", min: 0, max: 10 },
          { id: p + "confianca", type: "range", label: "Confiança (acho que consigo)", min: 0, max: 10 },
          { id: p + "coerencia", type: "range", label: "Coerência (combina com minha bússola)", min: 0, max: 10 }
        ]
      };
    })
  },

  {
    id: "prototipos",
    num: 7,
    title: "Prototipação",
    short: "Conversas e experiências para testar ideias",
    chapter: "Cap. 6 – Prototipando",
    intro:
      "<p>Em vez de tomar uma grande decisão no escuro, designers <strong>constroem protótipos</strong>: testes pequenos e baratos que respondem perguntas. " +
      "Na vida, há dois tipos principais:</p>" +
      "<ul>" +
      "<li><strong>Conversas-protótipo</strong> – conversar com alguém que já vive a vida que você está imaginando. Não é pedir emprego: é pedir a <em>história</em> da pessoa. " +
      "“Como você chegou aqui? Como é seu dia? O que você mais gosta e menos gosta?”</li>" +
      "<li><strong>Experiências-protótipo</strong> – viver um pedaço da ideia: passar um dia acompanhando alguém, fazer um curso curto, um trabalho voluntário, um projeto de fim de semana.</li>" +
      "</ul>" +
      "<p>Todo bom protótipo começa com uma <strong>pergunta</strong> que você quer responder, geralmente vinda das “três perguntas” dos Planos de Odisseia.</p>",
    how: [
      "Liste as perguntas que você mais quer responder (use as dos Planos de Odisseia).",
      "Para cada pergunta, pense em quem poderia responder (conversa) ou em como experimentar (experiência).",
      "Registre as conversas: com quem, o que perguntar, o que aprendeu. Atualize o status conforme acontecem.",
      "Depois de cada protótipo, escreva o que aprendeu e qual o próximo passo.",
      "Dica do livro: pergunte no final de cada conversa “Quem mais você acha que eu deveria conhecer?”."
    ],
    example:
      "<p><em>Pergunta:</em> “Eu gostaria de trabalhar com design de interiores?”</p>" +
      "<p><em>Conversa:</em> Ana (designer há 10 anos, amiga de uma amiga) — “Como é um projeto do início ao fim? O que é mais difícil?” — <em>Aprendi:</em> 60% do tempo é lidar com fornecedores e obra.</p>" +
      "<p><em>Experiência:</em> Acompanhar a Ana em uma visita a obra no sábado.</p>",
    faq: [
      { q: "Como encontro pessoas para conversar?", a: "Comece pela sua rede: amigos, ex-colegas, grupos, LinkedIn, ex-alunos da sua escola/faculdade. Uma mensagem curta dizendo que admira o trabalho da pessoa e quer ouvir a história dela em 20–30 minutos funciona bem." },
      { q: "Não é estranho pedir para conversar com desconhecidos?", a: "A maioria das pessoas gosta de contar sua história e ajudar. Você não está pedindo emprego, só curiosidade genuína — isso muda tudo." },
      { q: "Qual o tamanho ideal de uma experiência-protótipo?", a: "O menor possível que ainda responda sua pergunta: algumas horas ou um fim de semana. Não é para largar o emprego e testar." }
    ],
    sections: [
      {
        title: "Perguntas que quero responder",
        fields: [{ id: "pr_perguntas", type: "textarea", label: "Perguntas", rows: 4, placeholder: "Uma pergunta por linha" }]
      },
      {
        title: "Conversas-protótipo",
        fields: [
          {
            id: "pr_conversas",
            type: "list",
            label: "Conversas",
            addLabel: "+ Adicionar conversa",
            columns: [
              { id: "pessoa", label: "Pessoa", type: "text" },
              { id: "tema", label: "O que quero entender", type: "text", wide: true },
              { id: "status", label: "Status", type: "select", options: ["Ideia", "Contato feito", "Agendada", "Feita"] },
              { id: "aprendi", label: "O que aprendi", type: "text", wide: true }
            ]
          }
        ]
      },
      {
        title: "Experiências-protótipo",
        fields: [
          {
            id: "pr_experiencias",
            type: "list",
            label: "Experiências",
            addLabel: "+ Adicionar experiência",
            columns: [
              { id: "experiencia", label: "Experiência", type: "text", wide: true },
              { id: "pergunta", label: "Pergunta que responde", type: "text", wide: true },
              { id: "status", label: "Status", type: "select", options: ["Ideia", "Planejada", "Feita"] },
              { id: "aprendi", label: "O que aprendi", type: "text", wide: true }
            ]
          }
        ]
      }
    ]
  },

  {
    id: "escolha",
    num: 8,
    title: "Escolher bem",
    short: "Reunir, reduzir, escolher e seguir em frente",
    chapter: "Cap. 9 – Escolhendo a felicidade",
    intro:
      "<p>Ter opções é ótimo, mas escolher pode ser paralisante. O livro propõe um processo de quatro passos:</p>" +
      "<ol>" +
      "<li><strong>Reunir e criar opções</strong> – liste todas as possibilidades que surgiram.</li>" +
      "<li><strong>Reduzir a uma lista viável</strong> – corte para <strong>3 a 5 opções</strong>. Com muitas opções, a gente não escolhe nenhuma. As que saem não morrem: só não são para agora.</li>" +
      "<li><strong>Escolher</strong> – use a cabeça (análise) <em>e</em> o coração (intuição, emoção, o corpo). Imagine-se vivendo cada opção por alguns dias e observe como se sente.</li>" +
      "<li><strong>Deixar ir e seguir em frente</strong> – depois de escolher, não fique remoendo o “e se…”. Quem mantém as portas abertas fica menos feliz com a escolha. Invista na opção escolhida.</li>" +
      "</ol>",
    how: [
      "Liste todas as opções que você tem (dos Planos de Odisseia, protótipos, ideias).",
      "Marque as 3 a 5 que vão para a lista viável.",
      "Para cada uma da lista viável, escreva o que a cabeça diz e o que o coração diz.",
      "Faça sua escolha e escreva por quê.",
      "Escreva o que você vai deixar ir e um primeiro passo concreto."
    ],
    example:
      "<p><em>Opções:</em> continuar no emprego e fazer pós; migrar para produto na mesma empresa; tirar 6 meses sabáticos; abrir consultoria…</p>" +
      "<p><em>Coração (produto):</em> “Quando imagino, sinto alívio e curiosidade.” <em>Cabeça:</em> “Salário parecido, curva de aprendizado alta.”</p>" +
      "<p><em>Deixo ir:</em> “A ideia de que preciso de um mestrado agora para ser levado a sério.”</p>",
    faq: [
      { q: "E se eu escolher errado?", a: "Não existe uma única escolha certa — você tem várias vidas boas possíveis. Uma escolha bem feita e bem vivida é melhor que a escolha “perfeita” que nunca acontece. E você sempre pode prototipar de novo." },
      { q: "Como ouvir o “coração”?", a: "O livro sugere viver cada opção mentalmente por alguns dias: acorde pensando “escolhi a opção A” e observe como se sente ao longo do dia. Meditação, escrita livre e conversar em voz alta também ajudam." }
    ],
    sections: [
      {
        title: "1. Reunir opções",
        fields: [{ id: "e_opcoes", type: "textarea", label: "Todas as opções", rows: 5, placeholder: "Uma por linha" }]
      },
      {
        title: "2. Lista viável (3 a 5)",
        fields: [
          {
            id: "e_viaveis",
            type: "list",
            label: "Opções viáveis",
            addLabel: "+ Adicionar opção",
            columns: [
              { id: "opcao", label: "Opção", type: "text", wide: true },
              { id: "cabeca", label: "O que a cabeça diz", type: "text", wide: true },
              { id: "coracao", label: "O que o coração diz", type: "text", wide: true }
            ]
          }
        ]
      },
      {
        title: "3 e 4. Escolher, deixar ir e seguir",
        fields: [
          { id: "e_escolha", type: "textarea", label: "Minha escolha e por quê", rows: 3 },
          { id: "e_deixar", type: "textarea", label: "O que vou deixar ir", rows: 2 },
          { id: "e_passo", type: "textarea", label: "Primeiro passo concreto", rows: 2 }
        ]
      }
    ]
  },

  {
    id: "fracasso",
    num: 9,
    title: "Imunidade ao fracasso",
    short: "Transforme erros em aprendizado",
    chapter: "Cap. 10 – Imunidade ao fracasso",
    daily: true,
    intro:
      "<p>Quem prototipa vai errar — e isso é bom. O livro propõe o <strong>exercício de reformulação do fracasso</strong> para você ficar “imune” a ele:</p>" +
      "<ol>" +
      "<li><strong>Registre</strong> seus fracassos (do período recente, ou de toda a vida).</li>" +
      "<li><strong>Classifique</strong> cada um:" +
      "<ul><li><em>Deslize</em> – um erro simples em algo que você normalmente faz bem. Reconheça, peça desculpas se preciso, siga em frente.</li>" +
      "<li><em>Fraqueza</em> – um erro recorrente, parte de quem você é. Talvez não valha a pena “consertar”; evite as situações que o disparam.</li>" +
      "<li><em>Oportunidade de crescimento</em> – um erro que não precisava ter acontecido e que você pode aprender a evitar. Esses são os que valem investimento.</li></ul></li>" +
      "<li><strong>Extraia o aprendizado</strong> das oportunidades de crescimento.</li>" +
      "</ol>",
    how: [
      "Use esta etapa sempre que algo der errado — é outra ferramenta do dia a dia.",
      "Descreva o fracasso de forma curta e objetiva.",
      "Classifique o tipo. Na dúvida entre fraqueza e oportunidade, pergunte: “Dá para mudar isso com um esforço razoável?”.",
      "Escreva o aprendizado ou a mudança que você vai fazer."
    ],
    example:
      "<p><em>Fracasso:</em> “Apresentei o projeto sem testar o link da demo e ela não abriu.” — <em>Deslize</em> — “Seguir com um checklist de 2 minutos antes de apresentações.”</p>" +
      "<p><em>Fracasso:</em> “Aceitei três projetos ao mesmo tempo e atrasei todos.” — <em>Oportunidade de crescimento</em> — “Preciso aprender a dizer não e estimar prazos com folga.”</p>",
    faq: [
      { q: "Não é desanimador listar fracassos?", a: "O objetivo é o oposto: ao classificar, você percebe que a maioria é deslize ou fraqueza conhecida, e só alguns pedem trabalho. Isso tira o peso e transforma o erro em informação." }
    ],
    sections: [
      {
        title: "Registro de fracassos",
        fields: [
          {
            id: "f_registros",
            type: "list",
            label: "Fracassos",
            addLabel: "+ Adicionar fracasso",
            newestFirst: true,
            columns: [
              { id: "data", label: "Data", type: "date", default: "today" },
              { id: "fracasso", label: "O que aconteceu", type: "text", wide: true },
              { id: "tipo", label: "Tipo", type: "select", options: ["", "Deslize", "Fraqueza", "Oportunidade de crescimento"] },
              { id: "aprendizado", label: "Aprendizado", type: "text", wide: true }
            ]
          }
        ]
      },
      {
        title: "Padrões",
        fields: [{ id: "f_padroes", type: "textarea", label: "Que padrões eu percebo?", rows: 3 }]
      }
    ]
  },

  {
    id: "equipe",
    num: 10,
    title: "Sua equipe",
    short: "Apoiadores, mentores e comunidade",
    chapter: "Cap. 11 – Montando uma equipe",
    intro:
      "<p>A última mentalidade é a <strong>colaboração radical</strong>. Ninguém projeta a vida sozinho. O livro sugere montar uma equipe com papéis diferentes:</p>" +
      "<ul>" +
      "<li><strong>Apoiadores</strong> – pessoas que torcem por você e com quem você pode falar abertamente.</li>" +
      "<li><strong>Participantes ativos</strong> – quem está diretamente envolvido nos seus projetos e protótipos.</li>" +
      "<li><strong>Família e amigos íntimos</strong> – quem é afetado pelas suas decisões.</li>" +
      "<li><strong>Mentores</strong> – pessoas com mais experiência que te dão conselhos (e ajudam você a encontrar seu próprio conselho).</li>" +
      "<li><strong>Time de design</strong> – um pequeno grupo (3 a 5 pessoas) que se encontra regularmente para acompanhar o design de vida de cada um.</li>" +
      "</ul>",
    how: [
      "Liste pessoas para cada papel. Nomes reais — isso torna o plano concreto.",
      "Escolha 3 a 5 pessoas para um possível time de design.",
      "Defina uma rotina de encontros (ex.: a cada 15 dias, por 1 hora) e o que será feito neles.",
      "Pense em como você pode apoiar essas pessoas também."
    ],
    example:
      "<p><em>Mentor:</em> Carlos, ex-chefe, que mudou de carreira aos 40.</p>" +
      "<p><em>Time de design:</em> Júlia, Marcos e Bia — encontro online toda segunda quinzena; cada um mostra o que prototipou e recebe sugestões.</p>",
    faq: [
      { q: "E se eu não tiver ninguém para o time de design?", a: "Comece com uma pessoa. Convide um amigo para fazer os exercícios junto com você, ou procure grupos e comunidades sobre desenvolvimento pessoal/carreira." }
    ],
    sections: [
      {
        title: "Pessoas",
        fields: [
          {
            id: "t_pessoas",
            type: "list",
            label: "Minha equipe",
            addLabel: "+ Adicionar pessoa",
            columns: [
              { id: "nome", label: "Nome", type: "text" },
              { id: "papel", label: "Papel", type: "select", options: ["", "Apoiador(a)", "Participante ativo", "Família / amigo íntimo", "Mentor(a)", "Time de design"] },
              { id: "como", label: "Como pode me ajudar / como posso ajudar", type: "text", wide: true }
            ]
          }
        ]
      },
      {
        title: "Rotina",
        fields: [{ id: "t_rotina", type: "textarea", label: "Como e quando vamos nos encontrar", rows: 3 }]
      }
    ]
  }
];
