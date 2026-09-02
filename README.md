# Estácio Go — Encontre seu caminho.

Estácio Go é uma solução de navegação interna desenvolvida para ajudar os alunos a localizar salas, laboratórios e outros espaços da instituição, mostrando de forma visual o caminho até o destino.

Estácio Go
│
├── 🏫 Salas
├── 🔬 Laboratórios
├── 📚 Biblioteca
├── 🏢 Secretaria
├── 🚻 Banheiros
└── 📍 Outros locais

## Dependências do projeto
React Native
TypeScript
Expo
Expo Router
Firebase
react-native-maps
expo-location

## qualidade 
ESLint
Prittier
Jest

## Segurança Firebase

### Modelo de acesso

- O catálogo ativo de campus, blocos, andares, salas e rotas pode ser lido publicamente no MVP para permitir a busca sem cadastro.
- Documentos inativos só podem ser lidos por um administrador ativo.
- Criação, edição e exclusão de dados administrativos exigem um documento `users/{uid}` com `role: "admin"` e `active: true`.
- A coleção `users` não pode ser criada, editada ou excluída pelo cliente. O primeiro administrador deve ser provisionado pelo Firebase Console ou por uma ferramenta confiável.
- O papel `student` não concede escrita. A autenticação é uma camada adicional; ela não substitui as regras do Firestore.
- A localização do aluno é solicitada pelo dispositivo e não é gravada no Firestore pelo aplicativo.

### Configuração e credenciais

Os valores `EXPO_PUBLIC_FIREBASE_*` são configurações do cliente Firebase e podem aparecer no bundle web; eles não são credenciais administrativas. Segredos como chaves de service account, tokens privados e credenciais de backend nunca devem ser adicionados ao aplicativo. Copie `.env.example` para `.env` localmente e mantenha `.env` fora do Git.

As regras estão em `firebase/firestore.rules`. A validação do cliente melhora a experiência, mas a validação de segurança é feita novamente pelas regras no servidor.

### Como testar as regras

1. Instale o Firebase CLI e autentique-se no projeto correto:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use <project-id>
   ```

2. Valide e publique somente as regras:

   ```bash
   firebase deploy --only firestore:rules
   ```

3. Teste no Firebase Emulator Suite usando contas com os seguintes cenários:

   - usuário não autenticado: pode ler documento ativo de `rooms`/`routes`, mas não documento inativo nem escrever;
   - usuário `student` ativo: mantém apenas leitura pública e não pode criar, editar ou excluir dados;
   - usuário `admin` inativo ou sem documento `users`: não pode administrar nada;
   - usuário `admin` ativo: pode administrar dados com schema válido;
   - qualquer usuário: não pode criar/editar/excluir `users` nem elevar `role` para `admin`;
   - admin: deve ser rejeitado ao enviar campos extras, tipos inválidos, coordenadas fora dos limites, rota com menos de dois pontos ou rota cujo primeiro/último ponto não coincida com origem/destino;
   - admin: não pode alterar `createdAt` em atualizações.

   Para execução local, inicie o emulador com `firebase emulators:start --only firestore,auth` e execute testes usando o SDK apontando para `localhost`. Nunca use credenciais de produção em testes automatizados.


## Como executar o projeto
1. Clone o repositório do projeto:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto:
   ```bash
   npx expo start --clear --tunnel
   ```


## passo a serem implemetados
este usuários anônimos, STUDENT, ADMIN ativo, ADMIN inativo e tentativas de escrever dados inválidos. O Firebase CLI não estava instalado neste ambiente, portanto a compilação específica das Rules deve ser executada com esses comandos.