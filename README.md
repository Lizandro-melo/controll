# 🚗 Sistema de Gestão de Frotas

Um sistema web desenvolvido com **Next.js**, **TypeScript** e **Prisma ORM** para **gerenciamento de veículos, clientes e manutenção de frota**.  
O projeto inclui autenticação, dashboard analítico e CRUDs de veículos com foco em usabilidade e interface moderna.

---

## 🧩 Funcionalidades Principais

### 🔐 Autenticação
- Login por CPF e senha com máscara automática.
- Controle de sessão via cookies (`nookies`).
- Redirecionamento automático conforme o status de autenticação.
- Validação e feedback de erro com alertas dinâmicos.

### 📊 Dashboard
- Resumo de indicadores da frota:
  - Total de veículos
  - Peças cadastradas
  - Clientes ativos
  - Receita potencial
- Bloco de **alertas de manutenção**.
- Cards de resumo financeiro e status da frota.

### 🚘 Gestão de Veículos
- Listagem de veículos com dados principais (modelo, placa, KM, status).
- Categorização por tipo (`CARRO` | `MOTO`).
- Exibição dos custos de **aluguel**, **manutenção** e **seguro**.
- Formulário de cadastro com:
  - Modelo, tipo, quilometragem, placa e seguro.
  - Modal interativo para novo veículo.
  - Integração com `react-hook-form`.

### 🧭 Estrutura de Navegação
- Interface organizada em **layout responsivo** com barra lateral.
- Páginas principais:
  - `/auth` – Login do sistema.
  - `/auth/resetpass` – Recuperação de senha.
  - `/` – Dashboard principal.
  - `/veiculos` – Gestão de veículos.

---

## ⚙️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|--------------|
| Framework | **Next.js 14**, **React 18** |
| Linguagem | **TypeScript** |
| Banco de Dados | **Prisma ORM** |
| Estilização | **TailwindCSS**, **Shadcn UI** |
| Autenticação | **Cookies (nookies)** |
| Formulários | **React Hook Form** |
| Ícones | **React Icons** |
| Tipografia | **Google Fonts (Montserrat)** |

---

## 🏗️ Estrutura do Projeto

```
📁 src
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label-input.tsx
│   │   ├── dialog.tsx
│   │   ├── nav.tsx
│   │   ├── central.tsx
│   │   └── response-alert.tsx
│
├── pages/
│   ├── index.tsx               # Dashboard principal
│   ├── veiculos/index.tsx      # Gestão de veículos
│   └── auth/
│       ├── index.tsx           # Tela de login
│       └── resetpass.tsx       # Redefinição de senha
│
├── provider/
│   └── provider_auth.tsx       # Contexto de autenticação
│
├── prisma/
│   └── schema.prisma           # Modelos e schema do banco
```

---

## 🚀 Como Executar o Projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2️⃣ Instalar dependências
```bash
pnpm i
```

### 3️⃣ Configurar o banco de dados
Edite o arquivo `.env` com sua URL do banco de dados e execute:
```bash
pnpx prisma migrate dev
```

### 4️⃣ Rodar o projeto
```bash
pnpm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 👤 Usuário de Desenvolvimento

Durante o desenvolvimento, o projeto utiliza um usuário padrão para testes:

```ts
login: "beta"
senha: "admin"
```

---

## 🧠 Próximos Passos
- [ ] Conectar o backend real com Prisma e API REST.
- [ ] Implementar cadastro de clientes e alertas de manutenção.
- [ ] Adicionar autenticação JWT.
- [ ] Dashboard dinâmico com gráficos (Recharts).
- [ ] Testes unitários e integração com CI/CD.

---

## Imagens

<p align="center">
  <img src="https://github.com/Lizandro-melo/controll/blob/master/public/Login.jpg" width="600" alt="Login Preview">
</p>

<p align="center">
  <img src="https://github.com/Lizandro-melo/controll/blob/master/public/dash.jpg" width="600" alt="Dashboard Preview">
</p>

<p align="center">
  <img src="https://github.com/Lizandro-melo/controll/blob/master/public/veiculos.jpg" width="600" alt="Veiculos Preview">
</p>

<p align="center">
  <img src="https://github.com/Lizandro-melo/controll/blob/master/public/detalhes.jpg" width="600" alt="Detalhes Preview">
</p>

