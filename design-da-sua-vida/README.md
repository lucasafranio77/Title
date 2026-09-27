# O Design da Sua Vida – caderno interativo

Aplicação web para aplicar, no dia a dia, as ferramentas do livro **O Design da Sua Vida** (*Designing Your Life*), de Bill Burnett e Dave Evans. No final, uma etapa com IA avalia o que você preencheu e ajuda a transformar tudo em um plano de ação.

## Como abrir

Não precisa instalar nada: basta abrir o arquivo `index.html` no navegador (Chrome, Edge, Firefox ou Safari).

Para usar no celular ou em vários lugares, você pode publicar a pasta em qualquer hospedagem estática (por exemplo, GitHub Pages). Os dados continuam salvos só no navegador de cada dispositivo. Para levá-los de um lugar para outro, use **Exportar** e **Importar**.

## Etapas

| # | Etapa | Ferramenta do livro |
|---|-------|---------------------|
| 1 | Mentalidades do designer | Curiosidade, viés para a ação, reformulação, consciência do processo, colaboração radical |
| 2 | Onde você está | Painel Saúde / Trabalho / Diversão / Amor + problemas de gravidade |
| 3 | Sua bússola | Visão de trabalho, visão de vida e coerência |
| 4 | Diário dos bons momentos *(dia a dia)* | Registro de engajamento e energia + reflexão AEIOU |
| 5 | Destravando: ideias | Mapas mentais + crenças disfuncionais e reformulações |
| 6 | Planos de Odisseia | Três vidas alternativas para os próximos 5 anos |
| 7 | Prototipação | Conversas-protótipo e experiências-protótipo |
| 8 | Escolher bem | Reunir, reduzir, escolher (cabeça + coração), deixar ir |
| 9 | Imunidade ao fracasso *(dia a dia)* | Registro e classificação de fracassos |
| 10 | Sua equipe | Apoiadores, mentores e time de design |
| ✦ | Avaliação com IA | Avaliação, plano de 30 dias, revisão semanal e mais |

Cada etapa tem uma explicação do conceito, um passo a passo, um exemplo, dúvidas frequentes e uma caixa para **perguntar à IA** como preencher.

## Uso no dia a dia

- **Página inicial**: registro rápido do diário, seu painel de vida, suas tarefas e o progresso das etapas.
- **Diário dos bons momentos**: anote de 3 a 6 atividades por dia. Os destaques (o que mais e o que menos te dá energia) são calculados automaticamente.
- **Tarefas**: as ações sugeridas pela IA viram tarefas com checkbox em um clique.
- **Revisão semanal**: uma vez por semana, peça a *Revisão semanal* na etapa de IA.

## A etapa de IA

A IA recebe tudo o que você preencheu e responde como um coach do método do livro. Os modos disponíveis são: avaliação completa, plano de ação de 30 dias, comparação dos Planos de Odisseia, planejamento de protótipos, revisão semanal e ajuda para decidir. Também dá para conversar livremente.

Há duas formas de usar:

1. **Direto no app**: em ⚙️ Configurações, cole uma chave da API da Anthropic (crie em [console.anthropic.com](https://console.anthropic.com/settings/keys)). O uso é cobrado pela Anthropic de acordo com o volume de texto. A chave fica salva só no seu navegador e é enviada apenas para a API da Anthropic.
2. **Sem chave**: clique em **“Copiar para usar no Claude.ai”**. O pedido é copiado junto com todos os seus dados; é só colar numa conversa em [claude.ai](https://claude.ai).

Modelo padrão: Claude Opus 5 (com Claude Sonnet 5 como opção mais barata).

## Privacidade

- Os dados ficam no `localStorage` do navegador. Nenhum servidor próprio é usado.
- Os dados só saem do seu computador quando você usa a IA (e vão apenas para a API da Anthropic).
- Faça backups de vez em quando com **Exportar**: limpar os dados do navegador apaga tudo.

## Estrutura

```
design-da-sua-vida/
├── index.html      # página única
├── css/styles.css  # estilos (tema claro/escuro, responsivo, impressão)
└── js/
    ├── steps.js    # conteúdo das etapas: explicações, exemplos, FAQ e campos
    ├── ai.js       # prompts, chamada ao Claude (SDK oficial via CDN) e markdown
    └── app.js      # interface, navegação, salvamento, tarefas e chat
```

Para ajustar textos, perguntas ou campos, edite `js/steps.js`. Cada etapa é um objeto com `intro`, `how`, `example`, `faq` e `sections`.
