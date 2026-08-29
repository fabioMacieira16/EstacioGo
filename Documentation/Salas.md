# Modulo de salas

## Escopo

O modulo permite que alunos pesquisem salas por codigo ou nome, consultem seus dados, selecionem uma sala e abram a tela reservada para iniciar a navegacao. Administradores podem listar, criar, editar, desativar e excluir salas.

A tela de rota ainda exibe apenas a sala selecionada. A Polyline e a recuperacao da rota pertencem ao modulo de mapas e serao integradas posteriormente.

## Separacao de responsabilidades

- `src/types/room.ts`: contrato `Room` e `RoomInput`.
- `src/utils/roomCode.ts`: normalizacao do codigo e validacao de dados obrigatorios.
- `src/services/roomService.ts`: leitura, busca e escrita na colecao `rooms`.
- `src/hooks/useRoomSearch.ts`: estado da pesquisa publica.
- `src/hooks/useRooms.ts`: listagem e operacoes administrativas.
- `src/components/RoomSearch`: campo de busca por codigo ou nome.
- `src/components/RoomSummary`: informacoes e selecao de uma sala.
- `src/components/RoomForm`: formulario administrativo.
- `app/index.tsx`: consulta publica.
- `app/route/[roomId].tsx`: sala selecionada e ponto de entrada da navegacao.
- `app/admin/rooms.tsx`: gerenciamento administrativo.

## Dados

Cada documento `rooms/{roomId}` usa:

```json
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
```

## Regras aplicadas no cliente

- codigo e nome sao obrigatorios;
- bloco e descricao sao obrigatorios;
- andar deve ser inteiro;
- latitude e longitude devem ser numeros finitos;
- codigo e normalizado para maiusculas antes da gravacao;
- pesquisa considera apenas salas ativas;
- desativacao preserva o documento e altera `active` para `false`;
- exclusao permanente existe para administracao, mas deve ser usada com cautela.

## Proximos passos do modulo

1. Confirmar a autorizacao `admin` nas Security Rules.
2. Adicionar consulta de rota vinculada ao selecionar a sala.
3. Integrar `RoomSummary` e `RoomForm` a um design visual consistente.
4. Adicionar testes do service com Firestore Emulator ou mocks do SDK.
