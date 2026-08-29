# Campus Route

## Visão geral

Campus Route é um aplicativo mobile desenvolvido para o Laboratório de Transformação Digital (LTD) da faculdade.

O objetivo é facilitar a localização de salas de aula dentro da instituição.

O problema principal é que, principalmente no início de cada semestre, alunos têm dificuldade para encontrar suas salas. Eles precisam procurar placas, perguntar informações ou caminhar pela unidade até localizar a sala correta, causando perda de tempo e possíveis atrasos.

O Campus Route permitirá que o aluno informe uma sala, por exemplo F101, e visualize uma rota desde um ponto de origem da faculdade até a sala desejada.

O aplicativo terá também uma área administrativa para cadastro e gerenciamento de salas e rotas.

---

# Objetivo do projeto

Criar uma solução mobile simples, funcional e escalável para navegação interna da faculdade.

O sistema deve permitir:

1. Localizar uma sala.
2. Visualizar informações da sala.
3. Visualizar a rota até a sala.
4. Exibir a rota graficamente no mapa.
5. Utilizar a localização do dispositivo quando disponível.
6. Permitir que administradores cadastrem salas.
7. Permitir que administradores criem e editem rotas.
8. Armazenar os dados no Firebase.

---

# Público-alvo

## Aluno

Utiliza o aplicativo para encontrar salas.

## Administrador

Responsável pelo cadastro e manutenção das salas e rotas.

---

# Stack tecnológica obrigatória

Utilizar preferencialmente:

- React Native
- TypeScript
- Expo
- Expo Router
- Firebase
- Firebase Authentication
- Cloud Firestore
- react-native-maps
- Expo Location

Ferramentas de qualidade:

- ESLint
- Prettier
- Jest

Não adicionar novas tecnologias sem justificar a necessidade.

---

# Decisões arquiteturais

## Mobile

O aplicativo será desenvolvido utilizando React Native com TypeScript.

Expo deve ser utilizado para simplificar o desenvolvimento e gerenciamento do projeto mobile.

Expo Router deve ser utilizado para navegação.

---

# Backend

Firebase será utilizado como backend.

## Authentication

Firebase Authentication será responsável pela autenticação dos usuários.

Existem dois papéis principais:

- STUDENT
- ADMIN

---

# Banco de dados

Cloud Firestore será utilizado para armazenamento.

Coleções principais:

- users
- campuses
- buildings
- floors
- rooms
- routes

---

# Modelo conceitual de Room

Uma sala deve possuir, no mínimo:

- id
- code
- name
- buildingId
- floor
- description
- destination
- routeId
- active
- createdAt
- updatedAt

Exemplo:

{
  "code": "F101",
  "name": "Sala F101",
  "buildingId": "bloco-f",
  "floor": 1,
  "description": "Sala de aula",
  "destination": {
    "latitude": -3.000123,
    "longitude": -38.500123
  },
  "routeId": "entrada-f101",
  "active": true
}

---

# Modelo conceitual de Route

Uma rota deve possuir:

- id
- name
- origin
- destination
- coordinates
- active
- createdAt
- updatedAt

Exemplo:

{
  "name": "Entrada Principal → F101",
  "origin": {
    "latitude": -3.000001,
    "longitude": -38.500001
  },
  "destination": {
    "latitude": -3.000123,
    "longitude": -38.500123
  },
  "coordinates": [
    {
      "latitude": -3.000001,
      "longitude": -38.500001
    },
    {
      "latitude": -3.000050,
      "longitude": -38.500050
    },
    {
      "latitude": -3.000080,
      "longitude": -38.500080
    },
    {
      "latitude": -3.000123,
      "longitude": -38.500123
    }
  ],
  "active": true
}

---

# Conceito de rotas

O Campus Route NÃO deve depender inicialmente de algoritmos automáticos de navegação.

As rotas serão cadastradas previamente.

Uma rota é representada por uma sequência de coordenadas.

Exemplo:

ENTRADA
   |
   |
   ●
   |
   ●
   |
   ●──────── F101

Cada ponto do caminho corresponde a uma coordenada geográfica.

O aplicativo deverá utilizar Polyline para desenhar a rota.

---

# Google Maps / Google Directions

Não utilizar Google Directions API no MVP.

Não implementar inicialmente:

- Google Routes API
- Google Directions API
- Google Places
- cálculo automático de rotas
- menor caminho
- Dijkstra
- A*

Essas funcionalidades podem ser consideradas em versões futuras.

A primeira versão deve utilizar rotas previamente cadastradas.

---

# Mapa

Utilizar react-native-maps.

O mapa deverá suportar:

- localização da faculdade;
- origem;
- destino;
- localização do usuário;
- Marker;
- Polyline;
- zoom;
- centralização da rota.

Criar um componente reutilizável chamado:

CampusMap

Esse componente deve receber propriedades como:

- origin
- destination
- routeCoordinates
- userLocation

A lógica de negócio não deve ficar dentro do componente de mapa.

---

# Localização

Expo Location deverá ser utilizado para obter a localização do dispositivo.

IMPORTANTE:

A localização GPS pode apresentar baixa precisão dentro de prédios.

Portanto:

A localização do usuário NÃO pode ser uma dependência obrigatória para o funcionamento do MVP.

O sistema deve continuar funcionando mesmo quando:

- GPS estiver indisponível;
- usuário negar permissão;
- sinal estiver impreciso;
- usuário estiver dentro do prédio.

O sistema deve permitir utilizar uma origem previamente cadastrada.

---

# MVP

O MVP obrigatório é:

LOGIN
↓
HOME
↓
Pesquisar sala
↓
Selecionar sala
↓
Visualizar detalhes
↓
Iniciar navegação
↓
Mapa
↓
Origem → Rota → Destino

Área administrativa:

LOGIN
↓
ADMIN
↓
Gerenciar salas
↓
Gerenciar rotas

---

# Funcionalidades do aluno

O aluno deve poder:

- realizar login;
- pesquisar sala;
- visualizar salas;
- selecionar sala;
- visualizar bloco;
- visualizar andar;
- visualizar descrição;
- visualizar mapa;
- visualizar rota;
- visualizar destino;
- visualizar sua localização quando disponível;
- iniciar navegação.

---

# Funcionalidades administrativas

O administrador deve poder:

## Salas

- criar;
- consultar;
- editar;
- desativar;
- excluir.

## Rotas

- criar;
- consultar;
- editar;
- excluir;
- ativar/desativar.

## Editor de rotas

O administrador deverá futuramente poder:

1. abrir o mapa;
2. selecionar origem;
3. tocar no mapa para adicionar pontos;
4. definir destino;
5. visualizar Polyline;
6. remover pontos;
7. limpar rota;
8. salvar a rota no Firestore.

---

# Segurança

Alunos:

- podem consultar salas;
- podem consultar rotas;
- não podem modificar salas;
- não podem modificar rotas.

Administradores:

- podem consultar;
- podem criar;
- podem editar;
- podem desativar;
- podem excluir.

Firebase Authentication e Firestore Security Rules devem ser utilizados.

Nunca colocar credenciais privadas diretamente no código.

---

# Estrutura recomendada

app/
├── _layout.tsx
├── index.tsx
│
├── login/
│   └── index.tsx
│
├── home/
│   └── index.tsx
│
├── navigation/
│   └── [roomId].tsx
│
├── rooms/
│   └── index.tsx
│
└── admin/
    ├── index.tsx
    ├── rooms.tsx
    └── routes.tsx

src/
├── components/
│   ├── Map/
│   ├── RoomCard/
│   ├── SearchRoom/
│   ├── RouteInfo/
│   └── Loading/
│
├── services/
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   └── firestore.ts
│   │
│   ├── roomService.ts
│   └── routeService.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useRooms.ts
│   └── useLocation.ts
│
├── types/
│   ├── Room.ts
│   ├── Route.ts
│   └── User.ts
│
├── utils/
│   ├── distance.ts
│   └── coordinates.ts
│
└── constants/
    └── map.ts

---

# Princípios de desenvolvimento

Sempre seguir:

- Clean Code;
- SOLID quando aplicável;
- separação de responsabilidades;
- componentes pequenos;
- funções pequenas;
- TypeScript fortemente tipado;
- evitar código duplicado;
- evitar lógica de negócio dentro da UI;
- evitar acesso direto ao Firebase nas telas;
- utilizar services/hooks apropriados;
- tratamento adequado de erros;
- loading states;
- empty states;
- validação de dados.

---

# Regras importantes para o agente

## Regra 1 — Não aumentar o escopo

Não adicionar funcionalidades que não estejam relacionadas ao objetivo do Campus Route sem autorização.

## Regra 2 — Não trocar a stack

Não substituir React Native, Expo, TypeScript ou Firebase sem apresentar justificativa técnica antes.

## Regra 3 — Não implementar tudo de uma vez

Desenvolver em pequenas etapas.

Cada etapa deve:

1. ser planejada;
2. implementada;
3. testada;
4. revisada;
5. documentada.

## Regra 4 — Priorizar MVP

Sempre priorizar funcionalidades necessárias para o MVP antes de funcionalidades futuras.

## Regra 5 — Não inventar dados

Coordenadas reais da faculdade não devem ser inventadas.

Durante desenvolvimento utilizar dados mockados claramente identificados.

Quando a localização real da faculdade estiver disponível, substituir os mocks.

## Regra 6 — GPS interno

Nunca assumir que o GPS funciona perfeitamente dentro da faculdade.

O aplicativo deve funcionar sem localização em tempo real.

## Regra 7 — Rotas

As rotas inicialmente serão cadastradas manualmente.

Não implementar roteamento automático sem autorização.

---

# Qualidade

Antes de considerar uma tarefa concluída:

- verificar TypeScript;
- executar lint;
- executar testes;
- verificar erros de runtime;
- verificar comportamento no Android;
- verificar tratamento de erros;
- verificar loading;
- verificar estados vazios;
- verificar permissões.

---

# Testes

Priorizar testes para:

- autenticação;
- salas;
- rotas;
- permissões;
- serviços;
- funções de cálculo;
- componentes importantes;
- navegação.

Não criar testes artificiais apenas para aumentar cobertura.

---

# Fora do MVP

Não implementar inicialmente:

- realidade aumentada;
- mapa 3D;
- inteligência artificial;
- reconhecimento de voz;
- visão computacional;
- beacons Bluetooth;
- sensores internos;
- Google Directions;
- Google Routes;
- Google Places;
- cálculo automático de menor rota;
- navegação curva a curva;
- integração com horários de aula;
- notificações avançadas.

Essas funcionalidades podem ser consideradas como roadmap futuro.

---

# Roadmap

## Fase 1
Planejamento e arquitetura.

## Fase 2
Configuração React Native + Expo.

## Fase 3
Configuração Firebase.

## Fase 4
Authentication.

## Fase 5
Cadastro e consulta de salas.

## Fase 6
Mapa.

## Fase 7
Rotas utilizando Polyline.

## Fase 8
Área administrativa.

## Fase 9
Editor de rotas.

## Fase 10
Localização do usuário.

## Fase 11
Testes.

## Fase 12
Segurança.

## Fase 13
Documentação.

## Fase 14
Build e apresentação.

---

# Critério de sucesso do MVP

O projeto será considerado funcional quando:

1. Um administrador conseguir cadastrar uma sala.
2. Um administrador conseguir associar uma rota à sala.
3. A rota possuir coordenadas.
4. Um aluno conseguir pesquisar a sala.
5. O aluno conseguir selecionar a sala.
6. O aplicativo conseguir recuperar a rota do Firebase.
7. O mapa conseguir exibir origem e destino.
8. O mapa conseguir desenhar a Polyline.
9. O aluno conseguir visualizar claramente o caminho.
10. O aplicativo continuar funcionando quando o GPS não estiver disponível.

---

# Visão futura

Após o MVP, considerar:

- múltiplas entradas;
- múltiplos blocos;
- múltiplos andares;
- mapas internos;
- rotas acessíveis;
- escadas/elevadores;
- cálculo automático de rotas;
- algoritmo A*;
- localização mais precisa;
- QR Codes para definir origem;
- integração com horários de aula;
- notificações;
- analytics;
- mapa da planta baixa da faculdade.

---

# Regra final

O objetivo principal do Campus Route é resolver um problema real da faculdade de maneira simples.

Sempre preferir:

SIMPLES + FUNCIONAL + TESTÁVEL

em vez de:

COMPLEXO + DIFÍCIL DE MANTER.

Toda decisão técnica deve considerar que o projeto será desenvolvido academicamente no LTD e deverá ser apresentado como uma solução real.