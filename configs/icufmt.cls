% Classe icufmt: Classe para escrita de monografias do Instituto de Computação

% Desenvolvida por: Mauricio Fernando Lima Pereira (mauricio@ic.ufmt.br) 



% identificacao
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{./configs/icufmt}[2014/08/29]


% ccdigo inicial e carregamento de pacotes
%\LoadClass[11pt,a4paper,oneside,capchap, capsec]{abnt} % classe base para a monografia
\LoadClass[
a4paper, % tamanho da página
12pt, % tamanho da fonte do texto
oneside, % impressão de um lado
% twosite, %para impressão em frente e verso. Oposto a oneside. Descomente esse e comente onesite
% espacoumemeio, % espaçamento do trabalho
%pnumromarab,
%abntfigtabnum, 
chapter=TITLE , % títulos de capítulos convertidos em letras maiúsculas
section=TITLE,		% títulos de seções convertidos em letras maiúsculas
english,			% idioma adicional para hifenização
brazil,				% o último idioma é o principal do documento
times
]{abntex2}


\RequirePackage{ifthen} % para testes
\RequirePackage{lastpage} % para ficha catalogrÃ¡fica
\RequirePackage[left=3.5cm, right=2.5cm, top=3cm, bottom=2.5cm]{geometry}
%\RequirePackage{fancyhdr}]

\RequirePackage{setspace}
\RequirePackage{datetime}

% ---
% Pacotes básicos 
% ---
\RequirePackage[T1]{fontenc}		% Selecao de codigos de fonte.
\RequirePackage[utf8]{inputenc}		% Codificacao do documento (conversão automática dos acentos)

\RequirePackage{amsmath}
\RequirePackage{amsfonts}  
\RequirePackage{amssymb}   
\RequirePackage[brazil]{babel}


\RequirePackage{indentfirst}		% Indenta o primeiro parágrafo de cada seção.
\RequirePackage{color}				% Controle das cores
\RequirePackage{graphicx}			% Inclusão de gráficos
\RequirePackage{microtype} 			% para melhorias de justificação

% ---
% Pacotes de citações
% ---
\RequirePackage[brazilian,hyperpageref]{backref}	 % Paginas com as citações na bibl
\RequirePackage[alf]{abntex2cite}	% Citações padrão ABNT



% ajustando a distancia de indentação do paragrafo
\parindent 20mm

% ajustando a distância extra entre parágrafos
\parskip 3mm 



%ajustando tamanho do capitulo e seções

% Tipos de fontes
\RequirePackage{pslatex} %times, helvetica e courier
\RequirePackage{mathptmx} % fontes matemÃ¡ticas em ps

% Controle de linhas orfÃ£s e viÃºvas (desabilitar)
\widowpenalty10000 % 10000 significa virtualmente infinito. 
\clubpenalty10000

\newlanguage\nohyphen
\newcommand\nh[1]{\language\nohyphen #1}


%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%
%% Variaveis para escrita do pré texto da monografia
%%
%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\def\ProjetoMonografia{Projeto de Trabalho de Conclusão}
\def\Monografia{Monografia}
\def\EspecializacaoEngWeb{Engenharia de Sistemas Web}
\def\EspecializacaoBD{Banco de Dados}
\def\GraduacaoCO{Ciência da Computação}
\def\GraduacaoSI{Sistemas de Informação}


%% definindo variaveis para ajuste da especialização
\def\universidade{Universidade Federal de Mato Grosso}
\def\instituto{Instituto de Computa\c{c}\~{a}o}
\def\especializacao#1{\gdef\@icufmtEspecializacao{#1}}
\def\local{Cuiab\'{a} - MT}
\def\tipoTrabalho#1{\gdef\@icufmtTipoTrabalho{#1}}
\def\graduacao#1{\gdef\@icufmtGraduacao{#1}}
\def\nomeCursoGraduacao#1{\gdef\@icufmtNomeCursoGraduacao{#1}}

%\instituicao \@universidade

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Variaveis e comandos para inserção de membros de banca
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% definições para inserção do primeiro membro da banca
\def\membroBancaPNome#1{\gdef\@icMembroBancaPNome{#1}}
\def\membroBancaPEndereco#1{\gdef\@icMembroBancaPEndereco{#1}}
\newcommand{\PrimeiroMembroBanca}[2]{\membroBancaPNome{#1}
									 \membroBancaPEndereco{#2}
									}                                    
\newcommand{\imprimirPrimeiroMembroBanca}{\@icMembroBancaPNome \\ \@icMembroBancaPEndereco \\ }                                    

%% definições para inserção do segundo membro da banca
\def\membroBancaSNome#1{\gdef\@icMembroBancaSNome{#1}}
\def\membroBancaSEndereco#1{\gdef\@icMembroBancaSEndereco{#1}}
\newcommand{\SegundoMembroBanca}[2]{\membroBancaSNome{#1}
									 \membroBancaSEndereco{#2}
									}                                    
\newcommand{\imprimirSegundoMembroBanca}{\@icMembroBancaSNome \\ \@icMembroBancaSEndereco \\ }      

%% definições para inserção do terceiro membro da banca (caso necessário)
\def\membroBancaTNome#1{\gdef\@icMembroBancaTNome{#1}}
\def\membroBancaTEndereco#1{\gdef\@icMembroBancaTEndereco{#1}}
\newcommand{\TerceiroMembroBanca}[2]{\membroBancaTNome{#1}
									 \membroBancaTEndereco{#2}
									}                                    
\newcommand{\imprimirTerceiroMembroBanca}{\@icMembroBancaTNome \\ \@icMembroBancaTEndereco \\ }  

%%% Configurações da data da defesa para trabalho final
\def\diaDefesa#1{\gdef\@icDiaDefesa{#1}}
\def\mesDefesa#1{\gdef\@icMesDefesa{#1}}
\def\anoDefesa#1{\gdef\@icAnoDefesa{#1}}

\newcommand{\DataDefesa}[3]{\diaDefesa{#1}
\mesDefesa{#2}
\anoDefesa{#3}
}
\newcommand{\ImprimirDataDefesa}{Trabalho aprovado em \@icDiaDefesa \ de \@icMesDefesa \ de \@icAnoDefesa. \\}




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
%%
%%
%%	Criação das opções de monografia disponiveis na classe
%%  e das definições de nomes de cada uma
%%  
%%
%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%ajustando um valor padrão
\especializacao{Engenharia de Sistemas Web}
\tipoTrabalho{Projeto de Monografia}

%% Opções disponíveis para escrita do trabalho

% Variavel booleana para indicar que nivel de trabalho é (graduacao,pos)
% true indica trabalho de monografia de graduaçao
% false indica trabalho de monografia de pós graduação
\newboolean{TrabalhoGraduacao}

% Variavel booleanda para indicar se é PTCC ou TCC
\newboolean{TrabalhoFinal}
% true indica trabalho de conclusao do curso
% false indica projeto do trabalho de conclusao do curso

% opcao para ptcc de graduação (padrão Ciência da Computação)
\DeclareOption{PTCC}
{\tipoTrabalho{\ProjetoMonografia}
 \nomeCursoGraduacao{\GraduacaoCO}
 \setboolean{TrabalhoGraduacao}{true}
 \setboolean{TrabalhoFinal}{false}
}%
%
% opcao para tcc de graduação (padrão Ciência da Computação)
\DeclareOption{TCC}
{\tipoTrabalho{\Monografia}
 \setboolean{TrabalhoGraduacao}{true}
 \nomeCursoGraduacao{\GraduacaoCO}
  \setboolean{TrabalhoFinal}{true}
}%
%
% Mudando a opcao de curso para Sistemas de Informação
\DeclareOption{SI}
{\nomeCursoGraduacao{\GraduacaoSI}
}%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%
%% OPCOES DE PÓS GRADUAÇÃO
%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Opcao para ptcc de especialização 
\DeclareOption{EspecializacaoPTCC}
{
\setboolean{TrabalhoGraduacao}{false}
\setboolean{TrabalhoFinal}{false} 
\tipoTrabalho{\ProjetoMonografia}
\especializacao{Especifique o tipo de especialização}
}%
%
% Opcao para tcc de especialização 
\DeclareOption{EspecializacaoTCC}
{
\setboolean{TrabalhoGraduacao}{false}
\setboolean{TrabalhoFinal}{true} 
\tipoTrabalho{\Monografia}
\especializacao{Especifique o tipo}
}%
% 
\DeclareOption{EngWeb}
{
\especializacao{\EspecializacaoEngWeb}
}
%
\DeclareOption{BD}
{
\especializacao{\EspecializacaoBD}
}
% Definindo como padrão um documento de monografia de pré projeto para bacharelado em ciência da computação
\ExecuteOptions{PTCC}
%% Processando as opcoes escolhidas pelo usuario
\ProcessOptions
\newcommand{\cabecalhoCapa}[1]{
	% verificando o tipo de trabalho que está sendo gerado
	\ifthenelse{\boolean{TrabalhoGraduacao}}{
	\begin{center}
	\setlength{\parskip}{1.0mm}	
	\par	
	\MakeUppercase{\large\universidade}
	\par
	\MakeUppercase{\large \instituto}
	\par
	\MakeUppercase{Coordena\c{c}\~{a}o de Ensino de Graduação em} 
	\par 
	\MakeUppercase{\@icufmtNomeCursoGraduacao }	
	\par
	\setlength{\parskip}{3mm}
	\end{center}	
	}%fim do then
	{%"inicio do else	
	\begin{center}
	\setlength{\parskip}{1.0pt}	
	\par	
	\MakeUppercase{\large\universidade}
	\par
	\MakeUppercase{\large\instituto}
	\par
	\MakeUppercase{Coordena\c{c}\~{a}o de Ensino de Especializa\c{c}\~ao
em}  
	\par 
	\MakeUppercase{\@icufmtEspecializacao}	
	\par
	\end{center}
	}% fim do else
}




% % iniciando os comandos para montagem da capa e contracapa

\AtBeginDocument{
% capa do texto
% inicia colocando o logo da UFMT
\begin{center}
\includegraphics[height=2cm]{./configs/logo}
\end{center}
%
\begin{center}
\cabecalhoCapa
\par
\vspace{\stretch{5}}
\textbf{\Large\MakeUppercase\@title}
\par
%\vspace{8cm}
\vspace{\stretch{3}}
%%
\textbf{\MakeUppercase\@author} % autor da monografia
\vspace{\stretch{6}}
\par
\textbf{\MakeUppercase\local} % autor da monografia
\par
\the\year
\end{center}
%fim da capa do texto
% % % % % % % % % % % % % %
%
% % Iniciando a contra-capa
\newpage
\pagestyle{empty}
\pagenumbering{gobble}
%\centering
% inicia colocando o logo da UFMT
\begin{center}
	\includegraphics[height=2cm]{logo}
\end{center}
\cabecalhoCapa
\par
\begin{center}
\vspace{\stretch{2}}
\textbf{\Large\MakeUppercase\@title}
\par
\vspace{2cm}
\textbf{\MakeUppercase\@author} % autor da monografia
%inserindo o nome do autor do trabalho
\par
\vspace*{\stretch{1}}
%%
%%%inserindo o nome do orientador (ou orientadora)
\textbf{\orientadorname} \imprimirorientador \par
%%
%%%inserindo o nome do coorientador (ou coorientadora)
\abntex@ifnotempty{\imprimircoorientador}{\textbf{\coorientadorname} \imprimircoorientador \par}
\end{center}
%
\vspace*{\stretch{1}}
% % formantando de acordo com o tipo de monografia que foi definido 
% verificando o tipo de trabalho que foi definido na inclusão do pacote icufmt
% Possibilidades TCC, PTCC
% trabalhos de graduação
\vspace*{\stretch{2}}
\ifthenelse{\boolean{TrabalhoGraduacao}}%
{
\ifthenelse{\boolean{TrabalhoFinal}}
{
	\begin{flushright}
	\begin{minipage}[l]{0.57\textwidth}
		\setlength{\parskip}{1.0pt}	
		%%\onehalfspacing 
		\@icufmtTipoTrabalho \ apresentada ao
		Curso de \@icufmtNomeCursoGraduacao, do Instituto de
		Computa\c{c}\~{a}o
		da Universidade Federal de Mato Grosso,
		como requisito para obtenção do título de Bacharel em \@icufmtNomeCursoGraduacao
	\end{minipage}
\end{flushright}
}
{ % % PTCC de graduação
\begin{flushright}
\begin{minipage}[l]{0.6\textwidth}
\setlength{\parskip}{1.0pt}	
\@icufmtTipoTrabalho \ apresentado ao
Curso de \@icufmtNomeCursoGraduacao, do Instituto de
Computa\c{c}\~{a}o
da Universidade Federal de Mato Grosso,
como requisito para elabora\c{c}\~{a}o
da Monografia do Curso de Gradua\c{c}\~{a}o em
\@icufmtNomeCursoGraduacao.
\end{minipage}
\end{flushright}	
% fim da descrição de PTCC
}
% fim das possibilidades de trabalho de graduação
}
%
% Contracapa da Especialização (Pós-Graduação)
%
{
% Monografia de conclusão da (especializacao)
\ifthenelse{\boolean{TrabalhoFinal}}
{
\begin{flushright}
\begin{minipage}[l]{0.57\textwidth}
\@icufmtTipoTrabalho \ apresentada ao
Curso de Especializa\c{c}\~{a}o em \@icufmtEspecializacao, do Instituto de
Computa\c{c}\~{a}o
da Universidade Federal de Mato Grosso,
como requisito para obtenção do título de Especialista em
\@icufmtEspecializacao.
\end{minipage}
\end{flushright}
% fim da definição de monografia da especialização
}
% PTCC de especialização
{
\begin{flushright}
\begin{minipage}[l]{0.57\textwidth}

\@icufmtTipoTrabalho \ apresentado ao
Curso de Especializa\c{c}\~{a}o em \@icufmtEspecializacao, do Instituto de
Computa\c{c}\~{a}o
da Universidade Federal de Mato Grosso,
como requisito para elabora\c{c}\~{a}o
da Monografia do Curso de Especializa\c{c}\~{a}o em
\@icufmtEspecializacao.
\end{minipage}
\end{flushright}	
}
% fim da verificação de Especialização
}
% incluindo cidade e ano
\vspace{\stretch{4}}
\begin{center}
\par
\textbf{\MakeUppercase\local} % autor da monografia
\par
\the\year
% % fim das configurações da página de rosto
\pagestyle{plain}
\newpage
\end{center}
\pagenumbering{roman}
} % fim AtBeginDocument


% Controle do espaçamento entre um parágrafo e outro:
\setlength{\parskip}{0.2cm}  % tente também \onelineskip


%%-------------------------------------------------------------------------------
%%
%%	Ajustando os detalhes do capítulo
%%
%%-------------------------------------------------------------------------------
\RequirePackage[Sonny]{fncychap}
%%\RequirePackage[Lenny]{./fncychap/fncychap}
%%\RequirePackage[Sonny]{fncychap}
%\RequirePackage{color}
% % ---- ajustando como devem aparecer os titulos de capitulos
 \makeatletter
\ChNameUpperCase
\ChTitleUpperCase
\ChNameVar{\Large\raggedleft}  
\ChNumVar{\huge} % sets the style for digit
\ChTitleVar{\huge\raggedleft} % sets the style for title
\ChRuleWidth{1pt} %
\ChNumVar{\fontsize{40}{41}}
%\ChNumVar{\fontsize{30}{31}\usefont{OT1}{ptm}{m}{n}\selectfont}

% %
% % montando as características do capítulo
 \renewcommand{\DOCH}{%
 \setlength{\fboxrule}{\RW} % Let fbox lines be controlled by
 \CTV\FmN{\@chapapp}\space \color{white}{\rule{0pt}{40pt}
 \color{black}{\CNoV\thechapter} }\par\nobreak
 \mghrulefill{\RW}\par\nobreak
 
 \vskip 5\p@ \color{black}}
%
% \renewcommand{\DOTI}[1]{%
% \CTV\FmTi{#1}\par\nobreak
%% \CNV\FmTi{#1}\par\nobreak
% \mghrulefill{\RW}\par\nobreak
% \fontsize{12}{13}\usefont{OT1}{ptm}{m}{n}\selectfont
% \vskip 30\p@
% }
% 
% \renewcommand{\DOTIS}[1]{%
%% \CTV\FmTi{#1}\par\nobreak
%\CNV\FmTi{#1}\par\nobreak
% \mghrulefill{\RW}\par\nobreak
% \fontsize{20}{21}\usefont{OT1}{ptm}{m}{n}\selectfont
% \vskip 20\p@}


%\renewcommand{\DOTI}[1]{%
%\CTV\FmTi{#1}\par\nobreak
%\mghrulefill{\RW}\par\nobreak
%\vskip 20\p@
%}
%%
%\renewcommand{\DOTIS}[1]{%
%\CTV\FmTi{#1}\par\nobreak
%\mghrulefill{\RW}\par\nobreak
%\vskip 20\p@}
% 
\makeatother

% ajustando a característica da seção e subseção
\setsecheadstyle{\large\bfseries}
\setsubsecheadstyle{\large\bfseries}
\setsubsubsecheadstyle{\large\bfseries}


% % %
% % %   fim do trecho formatando titulo do capitulo 
% % 
%ajustando para que títulos fiquem em letra maiuscula
%\setboolean{ABNTcapchap}{true}
%\setboolean{ABNTcapsec}{true}