# PRD - Campus Route

**Versao:** 1.0  
**Data:** 27 de agosto de 2026  
**Responsavel institucional:** Laboratorio de Transformacao Digital (LTD)  
**Status:** Documento de definicao do produto

## 1. Visao do produto

Campus Route e um aplicativo mobile de orientacao interna para ajudar alunos a encontrar salas de aula dentro da faculdade. O usuario informa o codigo de uma sala, como `F101`, e visualiza no mapa o destino e um caminho previamente cadastrado a partir de uma origem fixa.

O produto sera desenvolvido com React Native, TypeScript, Expo, Expo Router, Firebase, Cloud Firestore e `react-native-maps`. As rotas nao serao calculadas em tempo real: cada uma sera armazenada como uma lista ordenada de coordenadas e apresentada por meio de uma Polyline.

O produto deve ser simples o suficiente para ser concluido academicamente, mas organizado com separacao entre interface, regras de negocio e acesso a dados, permitindo sua evolucao para uma solucao real.

## 2. Problema

No inicio de cada semestre, alunos novos ou que ainda nao conhecem a unidade tem dificuldade para localizar suas salas. Eles precisam procurar placas, perguntar a funcionarios ou caminhar por diferentes areas ate encontrar o local correto.

Essa situacao causa:

- atrasos para alunos e professores;
- perda de tempo no deslocamento;
- dependencia de atendimento presencial para uma duvida simples;
- inseguranca para visitantes e alunos em sua primeira experiencia na unidade.

## 3. Objetivo

### Objetivo geral

Permitir que um aluno encontre visualmente uma sala da faculdade a partir de uma origem conhecida, reduzindo o tempo e a incerteza para chegar ao destino.

### Objetivos especificos

- oferecer consulta de sala sem login obrigatorio;
- exibir a identificacao e a localizacao legivel da sala encontrada;
- recuperar uma rota ativa previamente cadastrada no Firebase;
- desenhar origem, destino e percurso no mapa;
- validar o conceito com dados simulados antes do levantamento de coordenadas reais;
- estabelecer uma base tecnica segura para futura manutencao administrativa.

## 4. Publico-alvo

### Publico primario

Alunos da faculdade, especialmente calouros, alunos transferidos e pessoas que visitam uma unidade pela primeira vez.

### Publico secundario

Professores, funcionarios e visitantes que precisem localizar salas ou outros espacos em uma etapa futura.

### Instituicao beneficiada

O LTD e a faculdade, que ganham uma solucao demonstravel para reduzir duvidas de localizacao e melhorar a experiencia de chegada dos alunos.

## 5. Personas

### Persona 1 - Ana, caloura

- **Perfil:** aluna no primeiro semestre, conhece pouco a unidade.
- **Necessidade:** encontrar a sala da primeira aula sem chegar atrasada.
- **Frustracao:** placas pouco familiares e receio de perguntar varias vezes.
- **Objetivo no Campus Route:** informar `F101` e entender rapidamente para onde caminhar.

### Persona 2 - Rafael, aluno veterano em uma nova unidade

- **Perfil:** ja conhece a faculdade de origem, mas nao conhece o novo campus ou bloco.
- **Necessidade:** localizar salas em um espaco diferente.
- **Frustracao:** codigos de salas e blocos nao sao intuitivos fora do contexto local.
- **Objetivo no Campus Route:** consultar uma sala e confirmar visualmente o bloco, andar e caminho.

### Persona 3 - Camila, responsavel por dados do LTD

- **Perfil:** pessoa que futuramente manterá os dados de salas e rotas.
- **Necessidade:** corrigir ou atualizar informacoes sem alterar o aplicativo manualmente.
- **Frustracao:** dados desatualizados tornam qualquer mapa pouco confiavel.
- **Objetivo no Campus Route:** administrar salas, rotas e vinculos em uma versao posterior.

## 6. User stories

### Usuario aluno ou visitante

- Como aluno, quero abrir o aplicativo sem fazer login para consultar uma sala rapidamente.
- Como aluno, quero informar o codigo de uma sala, como `F101`, para localizar seu destino.
- Como aluno, quero ver o bloco e o andar da sala para confirmar que encontrei o local correto.
- Como aluno, quero ver a origem, o destino e o caminho no mapa para saber por onde caminhar.
- Como aluno, quero receber uma mensagem clara quando a sala nao existir ou estiver inativa.
- Como aluno, quero saber quando uma sala existe, mas ainda nao possui rota disponivel.
- Como aluno, quero receber uma orientacao compreensivel quando houver falha de internet.

### Administrador, em versao futura

- Como administrador, quero cadastrar e editar salas para manter o catalogo atualizado.
- Como administrador, quero desativar uma sala sem apagar seu historico para evitar consultas invalidas.
- Como administrador, quero cadastrar e editar os pontos de uma rota para representar o percurso real.
- Como administrador, quero vincular uma sala a uma rota para disponibilizar a navegacao correta.
- Como administrador, quero que apenas pessoas autorizadas alterem os dados do campus.

## 7. Requisitos funcionais

### Consulta de salas

- **RF-01:** O aplicativo deve permitir consulta sem autenticacao obrigatoria.
- **RF-02:** O aplicativo deve disponibilizar um campo para informar o codigo da sala.
- **RF-03:** O sistema deve normalizar a entrada o suficiente para aceitar variacoes simples, como espacos extras e diferenca entre maiusculas e minusculas.
- **RF-04:** O sistema deve localizar somente salas ativas.
- **RF-05:** O sistema deve exibir codigo, nome ou descricao, bloco e andar da sala encontrada.
- **RF-06:** O sistema deve informar quando a sala nao for encontrada ou estiver inativa.

### Rotas e mapa

- **RF-07:** O sistema deve usar uma origem fixa configurada para a unidade no MVP.
- **RF-08:** O sistema deve recuperar uma rota ativa vinculada a sala consultada.
- **RF-09:** O mapa deve exibir um marcador de origem e um marcador de destino.
- **RF-10:** O mapa deve desenhar as coordenadas ordenadas da rota com uma Polyline.
- **RF-11:** O mapa deve ajustar a camera para manter a rota, a origem e o destino visiveis.
- **RF-12:** O sistema deve informar quando a sala nao possui rota ativa.

### Estados e dados

- **RF-13:** O aplicativo deve exibir estado de carregamento enquanto consulta os dados.
- **RF-14:** O aplicativo deve exibir uma mensagem de erro e permitir nova tentativa quando a consulta falhar por rede ou servico.
- **RF-15:** O sistema deve manter salas, rotas, origem, coordenadas, status de atividade e vinculo entre sala e rota no modelo de dados.
- **RF-16:** O sistema deve permitir leitura dos dados necessarios ao usuario e bloquear escrita publica no Firestore.

### Preparacao para evolucao

- **RF-17:** A estrutura deve permitir autenticar usuarios administrativos com Firebase Authentication em uma versao futura.
- **RF-18:** A estrutura deve permitir substituir dados simulados por dados reais sem reescrever a camada de interface.

## 8. Requisitos nao funcionais

- **RNF-01 - Plataforma:** a primeira validacao deve ocorrer no Expo Go com foco em Android.
- **RNF-02 - Tecnologia:** o projeto deve utilizar React Native, TypeScript, Expo, Expo Router, Firebase, Cloud Firestore, `react-native-maps` e Expo Location conforme a stack definida.
- **RNF-03 - Usabilidade:** a consulta principal deve ser curta, legivel e utilizavel por uma pessoa que nao conhece a unidade.
- **RNF-04 - Desempenho:** com uma quantidade academica de salas e rotas, a consulta e a abertura do mapa devem apresentar retorno percebido como rapido, com carregamento visivel quando necessario.
- **RNF-05 - Confiabilidade:** falhas de rede, dados ausentes e rota invalida nao devem encerrar ou travar o aplicativo.
- **RNF-06 - Seguranca:** o Firestore nao deve aceitar alteracoes anonimas ou de usuarios sem autorizacao administrativa.
- **RNF-07 - Manutenibilidade:** a interface nao deve acessar o Firestore diretamente; repositorios ou servicos devem concentrar o acesso aos dados.
- **RNF-08 - Qualidade:** TypeScript, ESLint, Prettier e Jest devem estar configurados e documentados.
- **RNF-09 - Privacidade:** a localizacao do usuario nao deve ser coletada no MVP, pois a origem sera fixa. A permissao de localizacao fica para uma fase futura.
- **RNF-10 - Documentacao:** o projeto deve conter instrucoes de execucao, arquitetura, modelo de dados, criterios de aceite e roteiro de demonstracao.

## 9. Regras de negocio

- **RN-01:** O codigo de uma sala deve ser unico dentro da unidade ou campus.
- **RN-02:** Somente salas ativas podem aparecer como resultado de uma consulta.
- **RN-03:** Uma sala pode ter no maximo uma rota ativa no MVP.
- **RN-04:** Uma rota deve possuir origem, destino e pelo menos dois pontos ordenados para ser considerada desenhavel.
- **RN-05:** Os pontos da Polyline devem ser exibidos na ordem armazenada; o aplicativo nao deve recalcular a rota.
- **RN-06:** A rota vinculada e a sala devem pertencer ao mesmo campus ou unidade.
- **RN-07:** Uma rota inativa nao pode ser usada na consulta publica.
- **RN-08:** Sala sem rota ativa deve permanecer identificavel, mas o sistema deve informar que a navegacao ainda nao esta disponivel.
- **RN-09:** A origem do MVP e fixa e nao depende de permissao de GPS.
- **RN-10:** Dados iniciais podem ser simulados, mas devem seguir o mesmo formato dos dados esperados no Firestore.
- **RN-11:** Consultas publicas podem ler dados publicados; escritas e alteracoes devem ser restritas a uma futura area administrativa autorizada.

## 10. Fluxos principais

### Fluxo 1 - Consultar uma sala com rota

1. Usuario abre o aplicativo.
2. Aplicativo apresenta o campo de busca.
3. Usuario informa `F101`.
4. Usuario aciona a busca.
5. Aplicativo normaliza o codigo e consulta a sala ativa.
6. Aplicativo recupera a rota ativa vinculada.
7. Aplicativo abre a tela de resultado.
8. Mapa exibe a origem fixa, o destino e a Polyline.
9. Camera e zoom sao ajustados para enquadrar o percurso.

### Fluxo 2 - Sala inexistente ou inativa

1. Usuario informa um codigo que nao existe ou esta inativo.
2. Aplicativo consulta os dados.
3. Aplicativo nao abre uma rota invalida.
4. Aplicativo apresenta mensagem clara e permite nova consulta.

### Fluxo 3 - Sala sem rota disponivel

1. Usuario informa uma sala ativa.
2. Aplicativo encontra a sala.
3. Aplicativo nao encontra uma rota ativa vinculada.
4. Aplicativo exibe os dados da sala e informa que o caminho ainda nao esta disponivel.

### Fluxo 4 - Falha de rede

1. Usuario realiza uma consulta.
2. Firebase ou a rede nao responde.
3. Aplicativo encerra o carregamento com uma mensagem compreensivel.
4. Usuario pode tentar novamente.

### Fluxo 5 - Administracao futura

1. Administrador autentica-se.
2. Sistema verifica autorizacao administrativa.
3. Administrador cria ou altera sala e rota.
4. Sistema valida unicidade, atividade, campus e pontos da rota.
5. Sistema grava os dados e atualiza o vinculo.
6. Nova consulta publica passa a utilizar somente dados ativos e validos.

## 11. Criterios de aceitacao

- **CA-01:** Dada uma sala ativa `F101` com rota ativa, ao pesquisar `F101`, o usuario visualiza codigo, bloco, andar, origem, destino e Polyline.
- **CA-02:** Dado um codigo inexistente, ao concluir a busca, o sistema informa que a sala nao foi encontrada e nao exibe uma rota inventada.
- **CA-03:** Dada uma sala inativa, ao pesquisar seu codigo, o sistema nao a oferece como destino navegavel.
- **CA-04:** Dada uma sala ativa sem rota ativa, o sistema mostra os dados da sala e informa que a rota nao esta disponivel.
- **CA-05:** Dada uma rota com pontos ordenados, a Polyline respeita a ordem dos pontos armazenados.
- **CA-06:** Dado que a origem e fixa, a consulta continua funcionando sem permissao de localizacao.
- **CA-07:** Dada uma falha de rede, o aplicativo mostra estado de erro, nao trava e permite nova tentativa.
- **CA-08:** Dado que a rota possui pontos validos, a camera enquadra origem, destino e percurso sem ocultar os marcadores.
- **CA-09:** Dados simulados documentados permitem demonstrar o fluxo completo em uma unidade e pelo menos uma sala.
- **CA-10:** Uma tentativa de escrita publica no Firestore e rejeitada pelas regras de seguranca.

## 12. MVP

### Escopo incluido

- aplicativo mobile executado no Expo Go;
- tela inicial com busca por codigo de sala;
- consulta publica sem login obrigatorio;
- uma unidade ou campus simulado;
- salas ativas com codigo, descricao, bloco e andar;
- origem fixa;
- rotas previamente cadastradas como coordenadas;
- vinculo de uma sala a uma rota;
- mapa com marcadores e Polyline;
- ajuste de camera para enquadrar a rota;
- estados de carregamento, sucesso, sala inexistente, sala sem rota e falha de rede;
- Cloud Firestore e dados simulados com formato compativel;
- regras que impedem escrita publica;
- testes unitarios dos principais comportamentos e documentacao de execucao.

### Demonstracao minima

O caso demonstravel deve seguir o fluxo:

`Abrir app -> informar F101 -> encontrar sala -> recuperar rota -> exibir origem, destino e Polyline`

### Escopo explicitamente excluido do MVP

- painel ou telas de CRUD administrativo;
- login obrigatorio para alunos;
- origem baseada em GPS;
- marcador e acompanhamento da posicao do usuario;
- calculo de distancia ou tempo;
- Google Directions, rotas externas ou algoritmo de menor caminho;
- multiplas unidades ou entradas configuraveis;
- notificacoes, chat e orientacao passo a passo;
- publicacao em lojas e suporte prioritario a iOS;
- dados reais antes de levantamento e validacao presencial.

## 13. Funcionalidades futuras

### Prioridade alta apos o MVP

- autenticacao de administradores com Firebase Authentication;
- autorizacao por papel ou custom claim;
- cadastro, edicao, ativacao e desativacao de salas;
- cadastro e edicao de rotas e pontos;
- vinculo e troca de rota de uma sala;
- painel administrativo mobile protegido ou painel web separado, decidido apos validar o fluxo de dados.

### Prioridade media

- selecao de multiplas entradas e unidades;
- filtros por bloco, andar e tipo de ambiente;
- levantamento e substituicao gradual dos dados simulados por coordenadas reais;
- historico basico de alteracoes administrativas;
- suporte a outros espacos, como biblioteca, secretaria, laboratorios e banheiros.

### Prioridade posterior

- origem pela localizacao atual;
- marcador atualizado do usuario;
- distancia aproximada e estimativa de percurso;
- rotas acessiveis, considerando elevadores, rampas e restricoes;
- orientacao passo a passo e alternativas de percurso;
- publicacao em lojas e suporte ampliado a iOS.

## 14. Riscos

| Risco | Impacto | Tratamento |
|------|---------|------------|
| Coordenadas simuladas nao representam o caminho real | Alto | Usar dados simulados apenas na demonstracao e validar coordenadas presencialmente antes do uso institucional. |
| Polyline indica um percurso proibido ou impraticavel | Alto | Criar procedimento de revisao dos pontos e aprovar cada rota com o LTD ou responsavel da unidade. |
| Regras do Firestore permitem escrita indevida | Alto | Bloquear escrita publica, testar com usuario anonimo e documentar a autorizacao futura. |
| Sala aponta para rota de outro campus | Alto | Validar campus, atividade e vinculo na camada de dominio e nas regras de dados. |
| Dados desatualizados reduzem a confianca no produto | Alto | Manter status ativo e planejar administracao antes de usar o app com dados reais. |
| Configuracao nativa do mapa dificulta o Expo Go | Medio | Testar `react-native-maps` cedo e documentar chaves e configuracoes necessarias. |
| GPS aumenta complexidade sem melhorar a primeira validacao | Medio | Manter origem fixa no MVP e adiar Expo Location para uma fase especifica. |
| Escopo administrativo atrasa a entrega academica | Medio | Manter CRUD fora do MVP e usar seed ou dados simulados. |
| Falha de rede deixa o usuario sem orientacao | Medio | Implementar estados de erro, nova tentativa e mensagens claras. |
| Formatos de codigo de sala sao inconsistentes | Baixo | Definir normalizacao, unicidade e exemplos antes de cadastrar dados reais. |

## 15. Metricas de sucesso

As metricas abaixo sao adequadas ao MVP academico e podem ser medidas em uma demonstracao ou teste controlado com alunos.

### Metricas principais

- **Taxa de sucesso da busca:** pelo menos 90% das consultas de salas cadastradas chegam a uma tela de mapa valida.
- **Conclusao do fluxo:** pelo menos 90% dos participantes conseguem sair da busca e identificar o percurso sem ajuda externa.
- **Tempo ate a rota:** mediana de ate 10 segundos entre iniciar a busca e visualizar o mapa em uma rede funcional.
- **Confiabilidade do dado:** 100% das salas usadas na demonstracao possuem codigo, destino e rota coerentes.
- **Cobertura de estados:** 100% dos cenarios definidos no aceite sao demonstrados ou testados, incluindo sala inexistente, sala sem rota e falha de rede.

### Metricas qualitativas

- participantes entendem o que fazer na primeira tela sem explicacao longa;
- participantes reconhecem a origem e o destino no mapa;
- participantes consideram a Polyline coerente com o caminho apresentado;
- LTD consegue explicar como os dados reais serao levantados e mantidos;
- banca ou avaliadores reconhecem separacao entre MVP, evolucoes e riscos.

### Limites de interpretacao

O MVP nao deve ser avaliado como sistema de navegacao de precisao ou como substituto de um levantamento arquitetonico da unidade. As metricas validam a clareza do fluxo, a integridade do modelo e a demonstracao do conceito; a eficacia em ambiente real dependera da qualidade das coordenadas e de testes presenciais posteriores.

---
*PRD criado em 27 de agosto de 2026 com base na analise do projeto Campus Route.*