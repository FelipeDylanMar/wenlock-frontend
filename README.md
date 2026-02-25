# Wenlock — App

Aplicação web (React + TypeScript) com listagem, cadastro, edição e visualização de usuários. Dados persistidos em **localStorage** (mock).

---

## Pré-requisitos

- **Node.js** 18+ (ou [Bun](https://bun.sh))

---

## Como rodar

```bash
# Na pasta app/
npm install
npm run dev
```

Ou com **Bun**:

```bash
bun install
bun run dev
```

Acesse **http://localhost:5173** (ou a URL exibida no terminal).

---

## Scripts

| Comando        | Descrição              |
|----------------|------------------------|
| `npm run dev`  | Servidor de desenvolvimento (Vite) |
| `npm run build`| Build de produção      |
| `npm run preview` | Preview do build   |
| `npm run lint` | ESLint                |

---

## Stack

- **React 19** + **TypeScript**
- **Vite** — build e dev server
- **React Router** — rotas
- **Tailwind CSS** — estilos
- **Zod** — validação de formulários

Estrutura em módulos: `src/modules/users` (páginas, serviços, validação, hooks).
