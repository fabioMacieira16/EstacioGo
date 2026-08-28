# Modelo de dados Firebase - Campus Route

**Banco:** Cloud Firestore  
**Escopo inicial:** uma unidade com salas e rotas previamente cadastradas  
**Convencao de status:** `active: true` significa que o documento pode ser usado nas consultas publicas.

## Decisoes gerais

- As seis entidades sao colecoes de primeiro nivel: `users`, `campuses`, `buildings`, `floors`, `rooms` e `routes`.
- IDs sao strings estaveis, gerados pelo sistema ou definidos no seed. O codigo visivel da sala nao deve ser usado como ID, pois pode mudar.
- Relacionamentos sao armazenados como IDs, e nao como documentos aninhados. Isso facilita consultas, atualizacoes e a futura area administrativa.
- Datas usam `Timestamp` do Firestore.
- Coordenadas usam objetos com `latitude` e `longitude` do tipo `number`.
- Consultas publicas devem sempre filtrar `active == true`. As Security Rules nao filtram resultados: elas rejeitam documentos inativos.
- A exclusao administrativa existe por requisito, mas a operacao normal deve ser a desativacao. A exclusao definitiva fica restrita a correcao de dados ou limpeza autorizada.

## 1. Colecao `users`

Representa usuarios autenticados e seu nivel de acesso. Alunos nao precisam de documento para consultar o mapa anonimamente; a colecao e principalmente para administradores e evolucoes de autenticacao.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|------|------|-------------|-----------|
| `uid` | `string` | Sim | Mesmo ID do usuario no Firebase Authentication. |
| `name` | `string` | Sim | Nome de exibicao. |
| `email` | `string` | Sim | Email associado a conta. |
| `role` | `string` | Sim | Papel do usuario. Valores previstos: `student` ou `admin`. |
| `active` | `boolean` | Sim | Indica se a conta pode acessar recursos administrativos. |
| `createdAt` | `Timestamp` | Sim | Data de criacao. |
| `updatedAt` | `Timestamp` | Sim | Data da ultima alteracao. |

### Relacionamentos

- `uid` corresponde ao `request.auth.uid`.
- `role == "admin"` autoriza operacoes administrativas nas colecoes de dados.
- Nao possui referencia obrigatoria a campus no MVP; se houver administradores por unidade, adicionar `campusIds` ou uma colecao de permissoes posteriormente.

### Exemplo: `users/admin-ltd-001`

```json
{
  "uid": "admin-ltd-001",
  "name": "Administrador LTD",
  "email": "admin@exemplo.edu.br",
  "role": "admin",
  "active": true,
  "createdAt": "Timestamp(2026-08-27T10:00:00Z)",
  "updatedAt": "Timestamp(2026-08-27T10:00:00Z)"
}
```

## 2. Colecao `campuses`

Representa uma unidade ou campus que possui uma origem fixa para o mapa.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|------|------|-------------|-----------|
| `name` | `string` | Sim | Nome da unidade. |
| `shortName` | `string` | Nao | Nome curto ou sigla. |
| `defaultOrigin` | `map` | Sim | Origem fixa do MVP. |
| `defaultOrigin.latitude` | `number` | Sim | Latitude entre -90 e 90. |
| `defaultOrigin.longitude` | `number` | Sim | Longitude entre -180 e 180. |
| `active` | `boolean` | Sim | Permite ou bloqueia uso da unidade. |
| `createdAt` | `Timestamp` | Sim | Data de criacao. |
| `updatedAt` | `Timestamp` | Sim | Data da ultima alteracao. |

### Relacionamentos

- Um campus possui muitos `buildings`, `rooms` e `routes`.
- `buildings.campusId`, `rooms.campusId` e `routes.campusId` devem apontar para um campus ativo ou historicamente existente.

### Exemplo: `campuses/campus-principal`

```json
{
  "name": "Campus Principal",
  "shortName": "Campus Centro",
  "defaultOrigin": {
    "latitude": -3.000001,
    "longitude": -38.500001
  },
  "active": true,
  "createdAt": "Timestamp(2026-08-27T10:00:00Z)",
  "updatedAt": "Timestamp(2026-08-27T10:00:00Z)"
}
```

## 3. Colecao `buildings`

Representa blocos ou edificios de um campus.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|------|------|-------------|-----------|
| `campusId` | `string` | Sim | ID do campus ao qual pertence. |
| `code` | `string` | Sim | Codigo do bloco, como `F`. |
| `name` | `string` | Sim | Nome legivel do bloco. |
| `description` | `string` | Nao | Informacao complementar. |
| `active` | `boolean` | Sim | Indica se o bloco esta disponivel. |
| `createdAt` | `Timestamp` | Sim | Data de criacao. |
| `updatedAt` | `Timestamp` | Sim | Data da ultima alteracao. |

### Relacionamentos

- Cada building pertence a um `campus`.
- Um building possui muitos `floors` e `rooms`.
- `code` deve ser unico dentro do campus, validado pela camada administrativa.

### Exemplo: `buildings/bloco-f`

```json
{
  "campusId": "campus-principal",
  "code": "F",
  "name": "Bloco F",
  "description": "Bloco de salas de aula",
  "active": true,
  "createdAt": "Timestamp(2026-08-27T10:00:00Z)",
  "updatedAt": "Timestamp(2026-08-27T10:00:00Z)"
}
```

## 4. Colecao `floors`

Representa um andar de um building. A entidade evita repetir informacoes de andar em cada sala e prepara o sistema para filtros futuros.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|------|------|-------------|-----------|
| `campusId` | `string` | Sim | ID do campus. |
| `buildingId` | `string` | Sim | ID do building. |
| `number` | `number` | Sim | Numero do andar; pode ser `0`, `1`, `2` ou outro convencionado. |
| `name` | `string` | Sim | Nome exibido, como `1o andar`. |
| `active` | `boolean` | Sim | Indica se o andar esta disponivel. |
| `createdAt` | `Timestamp` | Sim | Data de criacao. |
| `updatedAt` | `Timestamp` | Sim | Data da ultima alteracao. |

### Relacionamentos

- Cada floor pertence a um `building` e a um `campus`.
- Um floor possui muitas `rooms`.
- `buildingId` e `campusId` devem ser coerentes entre si.

### Exemplo: `floors/bloco-f-andar-1`

```json
{
  "campusId": "campus-principal",
  "buildingId": "bloco-f",
  "number": 1,
  "name": "1o andar",
  "active": true,
  "createdAt": "Timestamp(2026-08-27T10:00:00Z)",
  "updatedAt": "Timestamp(2026-08-27T10:00:00Z)"
}
```

## 5. Colecao `rooms`

Representa uma sala consultavel pelo aluno.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|------|------|-------------|-----------|
| `campusId` | `string` | Sim | ID do campus. |
| `buildingId` | `string` | Sim | ID do bloco. |
| `floorId` | `string` | Sim | ID do andar. |
| `code` | `string` | Sim | Codigo visivel e pesquisavel, como `F101`. |
| `codeNormalized` | `string` | Sim | Codigo em formato normalizado para busca, como `F101`. |
| `name` | `string` | Sim | Nome exibido, como `Sala F101`. |
| `description` | `string` | Nao | Tipo ou descricao da sala. |
| `destination` | `map` | Sim | Coordenada do destino no mapa. |
| `routeId` | `string` | Nao | ID da rota ativa vinculada. Nulo ou ausente quando nao houver rota. |
| `active` | `boolean` | Sim | Sala disponivel para consulta. |
| `createdAt` | `Timestamp` | Sim | Data de criacao. |
| `updatedAt` | `Timestamp` | Sim | Data da ultima alteracao. |

### Relacionamentos

- Cada room pertence a um `campus`, `building` e `floor`.
- `routeId`, quando presente, aponta para uma `route` do mesmo campus.
- Uma sala possui no maximo uma rota ativa no MVP.
- O codigo deve ser unico por campus. A unicidade deve ser controlada no fluxo administrativo, pois Rules nao oferecem uma restricao unique nativa.

### Exemplo: `rooms/room-f101`

```json
{
  "campusId": "campus-principal",
  "buildingId": "bloco-f",
  "floorId": "bloco-f-andar-1",
  "code": "F101",
  "codeNormalized": "F101",
  "name": "Sala F101",
  "description": "Sala de aula",
  "destination": {
    "latitude": -3.000123,
    "longitude": -38.500123
  },
  "routeId": "route-entrada-f101",
  "active": true,
  "createdAt": "Timestamp(2026-08-27T10:00:00Z)",
  "updatedAt": "Timestamp(2026-08-27T10:00:00Z)"
}
```

## 6. Colecao `routes`

Representa um percurso interno previamente medido e pronto para ser desenhado como Polyline.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|------|------|-------------|-----------|
| `campusId` | `string` | Sim | ID do campus. |
| `name` | `string` | Sim | Nome legivel da rota. |
| `origin` | `map` | Sim | Ponto inicial da rota. |
| `destination` | `map` | Sim | Ponto final da rota. |
| `coordinates` | `array<map>` | Sim | Lista ordenada usada diretamente pela Polyline. |
| `active` | `boolean` | Sim | Rota disponivel para consulta publica. |
| `createdAt` | `Timestamp` | Sim | Data de criacao. |
| `updatedAt` | `Timestamp` | Sim | Data da ultima alteracao. |

Cada item de `coordinates` deve conter `latitude` e `longitude`. A ordem do array e a ordem do percurso; nao e necessario armazenar `order` dentro de cada ponto.

### Relacionamentos

- Cada route pertence a um `campus`.
- Uma route pode ser referenciada por uma ou mais salas no futuro, mas no MVP cada sala usa no maximo uma rota ativa.
- `origin` deve ser compatível com a origem fixa do campus no MVP.
- `destination` deve ser compatível com `rooms.destination` da sala vinculada.

### Exemplo: `routes/route-entrada-f101`

```json
{
  "campusId": "campus-principal",
  "name": "Entrada Principal para F101",
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
  "active": true,
  "createdAt": "Timestamp(2026-08-27T10:00:00Z)",
  "updatedAt": "Timestamp(2026-08-27T10:00:00Z)"
}
```

## IDs

| Colecao | Estrategia recomendada | Exemplo |
|---------|------------------------|---------|
| `users` | ID igual ao `uid` do Firebase Authentication | `admin-ltd-001` |
| `campuses` | Slug estavel definido no seed ou ID automatico | `campus-principal` |
| `buildings` | Slug estavel por campus | `bloco-f` |
| `floors` | Slug composto por building e andar | `bloco-f-andar-1` |
| `rooms` | ID tecnico estavel, separado do codigo visivel | `room-f101` |
| `routes` | ID tecnico estavel | `route-entrada-f101` |

Nao usar o codigo `F101` como ID definitivo da sala. O campo `codeNormalized` permite pesquisa e evita acoplar referencias ao texto apresentado ao usuario.

## Indices necessarios

O Firestore cria automaticamente indices simples. Para o MVP, as consultas abaixo normalmente podem usar esses indices simples:

| Colecao | Campos consultados | Finalidade |
|----------|--------------------|-----------|
| `rooms` | `campusId ==`, `codeNormalized ==`, `active ==` | Buscar uma sala ativa por codigo. |
| `rooms` | `campusId ==`, `active ==`, `buildingId ==` | Listar salas ativas de um bloco. |
| `rooms` | `campusId ==`, `active ==`, `floorId ==` | Listar salas ativas de um andar. |
| `routes` | `campusId ==`, `active ==` | Listar ou validar rotas ativas. |
| `buildings` | `campusId ==`, `active ==` | Listar blocos ativos. |
| `floors` | `buildingId ==`, `active ==` | Listar andares ativos. |

Se o Firestore solicitar um indice composto para uma consulta com mais de um campo, criar o indice sugerido pelo console e registrar sua definicao em `firestore.indexes.json`. Para a consulta principal do MVP, evitar `orderBy` desnecessario reduz a necessidade de indices compostos.

## Consultas principais

### Buscar sala por codigo

```text
rooms
  where campusId == "campus-principal"
  where codeNormalized == "F101"
  where active == true
  limit 1
```

### Recuperar a rota da sala

1. Ler a sala ativa.
2. Obter `routeId`.
3. Ler `routes/{routeId}`.
4. Confirmar `active == true` e `campusId` igual ao da sala.

### Listar dados de uma unidade

```text
buildings where campusId == "campus-principal" and active == true
floors where buildingId == "bloco-f" and active == true
rooms where campusId == "campus-principal" and active == true
```

## Regras de integridade

- Todo documento de `rooms` deve referenciar um campus, building e floor coerentes.
- Todo documento de `routes` deve referenciar um campus existente.
- Uma sala e sua rota devem pertencer ao mesmo campus.
- Uma rota ativa deve conter ao menos dois pontos com latitude e longitude validas.
- O primeiro ponto de `coordinates` deve representar a origem e o ultimo deve representar o destino.
- `rooms.destination` e `routes.destination` devem coincidir dentro da precisao adotada pelo levantamento.
- `routes.origin` deve coincidir com `campuses.defaultOrigin` no MVP.
- `active` e obrigatorio nas seis colecoes.
- `createdAt` nao deve mudar depois da criacao; `updatedAt` deve ser atualizado em toda alteracao.
- Exclusao de um campus, building ou floor que ainda possua dependentes deve ser bloqueada pela camada administrativa ou precedida de desativacao/migracao.
- Unicidade de codigo de sala nao e garantida nativamente pelo Firestore. O fluxo administrativo deve consultar antes de criar e, em uma versao robusta, usar uma reserva de chave ou transacao.

## Salas desativadas

Usar desativacao logica: atualizar `active` para `false` e preservar o documento. Uma sala desativada:

- nao aparece em consultas publicas, que sempre filtram `active == true`;
- nao pode ser vinculada a uma nova rota ativa;
- pode permanecer no banco para historico e eventual reativacao;
- deve ser reativada somente depois de confirmar seus relacionamentos e dados.

A exclusao definitiva deve ser excepcional, feita por administrador e preferencialmente depois de remover ou substituir referencias. O aplicativo nao deve exibir a sala desativada como se fosse inexistente sem tratar a mensagem internamente de forma segura.

## Rotas desativadas

Usar desativacao logica: atualizar `active` para `false` e preservar as coordenadas. Uma rota desativada:

- nao pode ser lida pela consulta publica;
- nao deve ser desenhada no mapa;
- pode continuar referenciada por uma sala para preservar historico, mas essa sala deve ser tratada como sem rota disponivel;
- deve ser substituida por outra rota antes de uma sala voltar a ser navegavel.

Excluir definitivamente uma rota somente quando nenhum dado ativo depender dela ou quando for uma correcao administrativa controlada.

## Seed minimo para demonstracao

Criar pelo menos:

- um documento em `campuses`;
- um documento em `buildings`;
- um documento em `floors`;
- um documento em `rooms` para `F101`;
- um documento em `routes` vinculado a `F101`;
- um usuario administrador provisionado fora do aplicativo.

O seed deve usar o mesmo formato do Firestore de producao, mesmo que a primeira demonstracao utilize uma fonte simulada local.

## Observacao sobre administradores

O primeiro administrador nao deve ser criado por uma tela publica, pois isso permitiria elevar privilegios. A conta deve ser criada no Firebase Console ou por uma ferramenta administrativa confiavel; depois, um documento correspondente em `users/{uid}` recebe `role: "admin"` e `active: true`.

---
*Modelo revisado em 27 de agosto de 2026.*