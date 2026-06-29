# HUNOTASK 🚀

> Kanban task manager built with Next.js, Supabase and Clerk
> Plataforma de gestão de tarefas ágil, multi-idioma e de alta fluidez orientada à experiência do usuário (UX).

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?logo=clerk&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel)

![Drag and drop demo](https://private-user-images.githubusercontent.com/80772336/614813625-23f22323-c598-4df2-b22e-598c07a69b74.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODI3NjcwMDEsIm5iZiI6MTc4Mjc2NjcwMSwicGF0aCI6Ii84MDc3MjMzNi82MTQ4MTM2MjUtMjNmMjIzMjMtYzU5OC00ZGYyLWIyMmUtNTk4YzA3YTY5Yjc0LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA2MjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNjI5VDIwNTgyMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWJjM2QxYmI2YjEzODliY2JmNWQ4YTg4MGQ2YmM0NWMyMWNlN2Y0NzkzYTRhZTY2NTAyOGEzZTg5NTE2MDQ0NzcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRmdpZiJ9.Fbl80ttR3H7tt771z4vjydTxsQBf6WB5D3dFgQjO1f8)

Live Demo: https://hunotask.vercel.app

## 🛠️ Stack Tecnológico

- **Core:** Next.js (App Router) + React
- **Autenticação:** Clerk (com injeção de claims personalizados no JWT)
- **Banco de Dados & Realtime:** Supabase (PostgreSQL)
- **Drag & Drop:** @dnd-kit/core & @dnd-kit/sortable
- **Internacionalização:** next-intl (Suporte nativo EN | PT)
- **UI & Estilos:** Tailwind CSS + Shadcn UI + Lucide Icons

## 🏗️ Arquitetura de Banco de Dados e Segurança (RLS)

A base de dados foi projetada com um modelo relacional estrito em PostgreSQL (boards → columns → tasks), utilizando Row Level Security (RLS) ativado em 100% das tabelas para garantir o isolamento dos dados:

- **Injeção de Identidade:** Por meio de uma função SQL `requesting_user_id()`, o motor extrai diretamente o claim `sub` do token JWT fornecido pelo Clerk.
- **Políticas de Acesso em Cascata:** Foram implementadas políticas `EXISTS` nas tabelas filhas (columns e tasks) que verificam a propriedade da tabela pai (boards.user_id), impedindo que um usuário mal-intencionado tente mutar ou ler registros adjacentes via manipulação de IDs nas requisições.
- **Mutações Atômicas em Lote:** Para evitar o problema das N+1 queries ao reordenar tarefas, foi desenvolvida a função `update_tasks_order(p_tasks JSONB)` com `SECURITY DEFINER`, permitindo atualizar os índices `sort_order` e `column_id` de múltiplos registros em uma única transação de rede.

## 💡 Desafios Técnicos e Soluções de Engenharia

Além de implementar operações CRUD básicas, o desenvolvimento do projeto se concentrou em resolver gargalos de desempenho e fricções complexas de UX:

### 1. Motor de Drag & Drop com Optimistic Updates em Memória

**O Problema:** No início existia um atraso perceptível ao esperar a resposta do banco de dados para sincronizar cada movimento de cartão durante o arraste, gerando latência visual, interrupções na interface e consumo excessivo de rede.

**A Solução:** Implementei um motor de reordenamento puramente local dentro do evento `handleDragOver`, mutando o estado do React com matrizes bidimensionais e `splice()`. Assim o usuário percebe um movimento instantâneo (Optimistic UI). A sincronização assíncrona com o Supabase é postergada estrategicamente até o evento `handleDragEnd`, utilizando um `useRef` como ponte transacional para um possível rollback.

### 2. Resolução do Conflito de Navegação Mobile (Scroll vs. Drag)

**O Problema:** Ao revisar o funcionamento da aplicação em dispositivos móveis, foi fácil notar uma competição constante entre o scroll nativo do navegador e o início do arraste dos cartões. Inicialmente tentei ajustar os parâmetros dos sensores, mas ou a interface não permitia scroll, ou as tarefas não eram capturadas com precisão.

**A Solução:** Combinei `useSensors` com um `TouchSensor` configurado com restrições de ativação (delay: 50ms, tolerance: 10px) e apliquei isolamento CSS estrito via `touch-none` exclusivamente sobre o contêiner mais próximo da unidade do componente. Para resolver colisões entre colunas vizinhas, foi utilizada uma função `customCollisionDetection` com estratégia híbrida que avalia o ponteiro direto (`pointerWithin`) como prioridade antes de recorrer à proximidade dos cantos (`closestCorners`).

### 3. Orquestração de Middleware: Autenticação (Clerk) e i18n (next-intl)

**O Problema:** Como o projeto não foi concebido inicialmente com traduções, ao integrar a internacionalização o gerenciador de rotas gerava conflito entre next-intl e Clerk, causando loops de redirecionamento e erros 404 ao tentar resolver os prefixos de localização (`/en/*`, `/pt/*`) junto às rotas protegidas.

**A Solução:** Estruturei um matcher de rotas unificado no Middleware do Next.js, fazendo com que o interceptor do Clerk avalie o estado da sessão respeitando e propagando a reescrita dinâmica do subdiretório de idioma gerenciado pelo next-intl, conforme indicado na documentação do Clerk sobre `combineMiddleware`.

### 4. Eliminação de Re-renders em Cascata (Supabase Provider)

**O Problema:** A atualização automática dos tokens em segundo plano pelo Clerk disparava o cliente do Supabase, cancelando assinaturas em tempo real e gerando flashes visuais na interface (UI flashing).

**A Solução:** Desacoplei a reatividade da sessão encapsulando o token dentro de um `useRef`. Isso permitiu manter uma instância estática e persistente do cliente Supabase, que recupera o token mais recente de forma assíncrona e imutável, melhorando o desempenho e a experiência do usuário.

## 🗄️ Esquema do Banco de Dados

![Supabase Schema](https://private-user-images.githubusercontent.com/80772336/614816234-125547f9-7463-47a6-85e5-5d9bc64d55cb.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODI3Njc0NTksIm5iZiI6MTc4Mjc2NzE1OSwicGF0aCI6Ii84MDc3MjMzNi82MTQ4MTYyMzQtMTI1NTQ3ZjktNzQ2My00N2E2LTg1ZTUtNWQ5YmM2NGQ1NWNiLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA2MjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNjI5VDIxMDU1OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWY5ZDc0MDNjMTg2MzAyYjFkNmQyMGExOTMyOTBhYzBmMjg0ZjEzYTFkYjE5N2M3NjE0NTAwYWQ1ODcxNDdkMDUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.CcmFRnuDAj5BYw6SMc2WUrV9YYp-3tbf3o1g5j--jus)

## 💻 Instalação e Desenvolvimento Local

1. **Clonar o repositório:**

```bash
git clone https://github.com/Althalost/HUNO-Task
cd hunotask
```

2. **Instalar dependências:**

```bash
npm install
```

3. **Configurar variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz com as seguintes variáveis:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhYmdjaW9p...
```

4. **Executar o servidor de desenvolvimento:**

```bash
npm run dev
```

---
