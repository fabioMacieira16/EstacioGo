# Arquitetura do Campus Route

## Objetivo

Definir uma estrutura React Native + TypeScript simples, profissional e adequada ao MVP do Campus Route. A arquitetura separa navegacao, apresentacao, acesso a dados e tipos sem criar camadas que ainda nao sao necessarias.

## Stack

- **React Native:** construcao da interface mobile.
- **Expo:** ambiente de desenvolvimento e execucao inicial no Expo Go.
- **Expo Router:** navegacao baseada na estrutura de arquivos em `app/`.
- **TypeScript:** tipagem das entidades, parametros de navegacao e contratos de servico.
- **Firebase:** plataforma de backend.
- **Cloud Firestore:** persistencia de campuses, buildings, floors, rooms e routes.
- **Firebase Authentication:** preparada para administradores em fase futura.
- **react-native-maps:** mapa, markers e Polyline.
- **expo-location:** preparada para localizacao atual em fase futura; nao e dependencia da origem fixa do MVP.

## Principios

1. `app/` define rotas e telas do Expo Router; regras de negocio nao ficam nos arquivos de rota.
2. Componentes sao reutilizaveis e recebem dados por propriedades.
3. Hooks coordenam estado e efeitos de uma funcionalidade, sem conter componentes visuais grandes.
4. Services encapsulam casos de uso e acesso ao backend.
5. Firebase fica isolado em `src/firebase/`; a interface nao importa o SDK diretamente.
6. Tipos compartilhados ficam em `src/types/`.
7. Constantes e utilitarios nao dependem de telas.
8. Funcionalidades administrativas e localizacao avancada ficam previstas, mas nao serao implementadas na estrutura inicial do MVP.

## Estrutura de pastas

```text
CampusRoute/
├── app/                         # Rotas e telas do Expo Router
│   ├── _layout.tsx              # Layout raiz da navegacao
│   ├── index.tsx                # Tela inicial de consulta
│   └── route/
│       └── [roomId].tsx         # Tela de rota de uma sala
├── src/
│   ├── components/              # Componentes visuais reutilizaveis
│   │   ├── MapView/
│   │   ├── RoomSearch/
│   │   └── RoomSummary/
│   ├── hooks/                   # Hooks de estado e ciclo de vida
│   ├── services/                # Casos de uso e integracoes da aplicacao
│   │   ├── roomService.ts
│   │   └── routeService.ts
│   ├── firebase/                # Inicializacao e adaptadores do Firebase
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   └── firestore.ts
│   ├── types/                   # Interfaces e tipos compartilhados
│   │   ├── campus.ts
│   │   ├── building.ts
│   │   ├── floor.ts
│   │   ├── room.ts
│   │   ├── route.ts
│   │   └── user.ts
│   ├── constants/               # Valores fixos da aplicacao
│   │   ├── map.ts
│   │   └── routes.ts
│   └── utils/                   # Funcoes puras e pequenas transformacoes
│       ├── coordinates.ts
│       └── roomCode.ts
├── assets/                      # Imagens, icones e recursos estaticos
│   └── images/
├── firebase/                    # Arquivos de infraestrutura do Firebase
│   └── firestore.rules
├── __tests__/                   # Testes unitarios e de integracao futuros
├── app.json                     # Configuracao do Expo
├── package.json                 # Dependencias e scripts
├── tsconfig.json                # Configuracao TypeScript
└── README.md                    # Execucao e visao geral
```

## Responsabilidade das pastas

### `app/`

Contem exclusivamente as rotas reconhecidas pelo Expo Router. Cada arquivo representa uma tela ou um layout de navegacao. A pasta deve encaminhar eventos para hooks, services e componentes, sem consultar o Firestore diretamente.

### `src/components/`

Contem componentes visuais reutilizaveis, como campo de busca, resumo de sala, estado de carregamento e mapa. Cada componente deve ter uma responsabilidade visual clara e nao conhecer detalhes de navegacao global.

### `src/hooks/`

Contem hooks para encapsular estado e efeitos, por exemplo busca de sala, carregamento de rota, autenticacao e localizacao futura. Hooks podem usar services, mas nao devem renderizar a interface inteira.

### `src/services/`

Contem casos de uso e orquestracao da aplicacao. `roomService` coordena consulta de salas; `routeService` coordena recuperacao e validacao de rotas. Essa camada permite trocar dados simulados por Firestore sem reescrever as telas.

### `src/firebase/`

Contem a inicializacao do SDK, instancia do Firestore, autenticacao e adaptadores de baixo nivel. Nenhuma tela deve importar `firebase/firestore` diretamente.

### `src/types/`

Contem contratos TypeScript das entidades do Firestore e tipos usados entre telas, componentes, hooks e services. Os nomes devem permanecer consistentes com as colecoes `users`, `campuses`, `buildings`, `floors`, `rooms` e `routes`.

### `src/constants/`

Contem valores estaveis, como configuracao da regiao inicial do mapa, origem fixa do MVP, nomes de rotas e limites de entrada. Nao deve conter estado mutavel.

### `src/utils/`

Contem funcoes puras e independentes de React, como normalizacao de codigo de sala e validacao de coordenadas. Nao deve conter acesso ao Firebase.

### `assets/`

Contem imagens e outros recursos estaticos usados pelo aplicativo. Coordenadas e dados de salas nao devem ser tratados como assets; pertencem aos services e ao Firestore.

### `firebase/`

Contem arquivos de infraestrutura e seguranca do projeto Firebase, especialmente `firestore.rules`. As regras devem ser mantidas separadas da inicializacao do SDK usada pelo aplicativo.

### `__tests__/`

Contem testes de funcoes, services e hooks. O MVP deve priorizar testes de normalizacao, consulta, vinculo sala-rota e estados de erro.

## Arquivos iniciais

### Navegacao

- `app/_layout.tsx`: layout raiz minimo do Expo Router.
- `app/index.tsx`: ponto de entrada da consulta de salas.
- `app/route/[roomId].tsx`: rota dinamica reservada para a visualizacao do caminho.

### Firebase e services

- `src/firebase/config.ts`: contrato de configuracao do Firebase por variaveis de ambiente.
- `src/firebase/firestore.ts`: ponto de acesso ao Firestore.
- `src/firebase/auth.ts`: ponto de acesso a autenticacao futura.
- `src/services/roomService.ts`: contrato inicial para consulta de sala.
- `src/services/routeService.ts`: contrato inicial para consulta de rota.

### Tipos, constantes e utilitarios

- `src/types/coordinates.ts`: latitude e longitude.
- `src/types/campus.ts`: entidade campus.
- `src/types/building.ts`: entidade building.
- `src/types/floor.ts`: entidade floor.
- `src/types/room.ts`: entidade room.
- `src/types/route.ts`: entidade route e pontos da Polyline.
- `src/types/user.ts`: entidade user e papel futuro.
- `src/constants/map.ts`: configuracao inicial do mapa.
- `src/constants/routes.ts`: nomes das rotas do Expo Router.
- `src/utils/coordinates.ts`: validacao de coordenadas.
- `src/utils/roomCode.ts`: normalizacao de codigo de sala.

### Componentes e hooks reservados

- `src/components/MapView/index.tsx`: componente visual do mapa, inicialmente esqueleto.
- `src/components/RoomSearch/index.tsx`: componente visual da busca, inicialmente esqueleto.
- `src/components/RoomSummary/index.tsx`: resumo da sala encontrada, inicialmente esqueleto.
- `src/hooks/useRoomSearch.ts`: contrato do estado de busca.
- `src/hooks/useRoute.ts`: contrato do estado de carregamento da rota.

## Fluxo de dependencias

```text
app/ -> hooks/ -> services/ -> firebase/
  |       |          |
  +-----> components/+
          |
       types/, constants/, utils/
```

- `components/` pode depender de `types/`, `constants/` e `utils/`.
- `hooks/` pode depender de `services/` e `types/`.
- `services/` pode depender de `firebase/`, `types/` e `utils/`.
- `firebase/` nao depende de `app/` ou `components/`.
- `utils/` deve permanecer independente de React e Firebase.

## O que nao sera criado agora

- telas de login e administracao;
- CRUD de salas e rotas;
- gerenciamento de usuarios;
- hook de localizacao em producao;
- algoritmos de roteamento;
- Cloud Functions;
- camada de estado global;
- camada de API adicional entre app e Firebase.

Esses itens podem ser adicionados quando houver requisito real. A estrutura inicial evita complexidade prematura e preserva pontos claros de extensao.

---
*Arquitetura definida em 28 de agosto de 2026.*
