# Show Maker

Rede social focada na postagem de melhores momentos em jogos online.

## Rodando localmente

Clonando o projeto e instalando as dependências

```bash
  git clone https://github.com/fefezoka/showmaker
  cd showmaker
  npm install
```

Configurando o arquivo .env.example e iniciando o projeto

```bash
  # Copiar o arquivo contendo as variáveis de ambiente e dados de conexão
  cp .env.example .env

  # Rodar o projeto
  npm run dev
```

## Stack utilizada

- [Next JS](https://github.com/vercel/next.js/)
- [Typescript](https://github.com/microsoft/TypeScript)
- [Prisma](https://github.com/prisma/prisma) - ORM
- [MongoDB](https://github.com/mongodb/mongo)

## Bibliotecas

- [tRPC](https://github.com/trpc/trpc) - Rotas API typesafe
- [Stitches](https://github.com/stitchesjs/stitches) - CSS in JS
- [React Hook Form](https://github.com/react-hook-form) - Validação de formulários
- [Zod](https://github.com/colinhacks/zod) - Criação de schemas e validação
- [Radix](https://github.com/radix-ui) - Componentes UI acessíveis
- [Next Auth](https://github.com/nextauthjs/next-auth) - Autenticação

## Funcionalidades

- **Autenticação**
- **Criar, editar, excluir, comentar e favoritar posts**
- **Feed de posts**
- **Download dos vídeos**
- **Perfil de usuário**
- **Seguir usuários**
- **Página de configurações** Nessa aba é possível conectar sua conta com alguns providers (twitch e osu) que aparecerão no perfil do usuário
