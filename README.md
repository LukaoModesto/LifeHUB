# LifeHUB

LifeHUB é uma aplicação de produtividade pessoal desenvolvida com foco em agenda, eventos, lembretes e notificações. O projeto possui backend em FastAPI e frontend em React, com autenticação tradicional por e-mail/senha e login com Google.

O objetivo do LifeHUB é centralizar compromissos, lembretes e futuramente metas, sessões de atividade e acompanhamento de progresso em uma interface moderna, responsiva e preparada para evoluir como PWA.

---

## Status do projeto

Em desenvolvimento ativo.

### Funcionalidades já implementadas

* Cadastro de usuário
* Login com e-mail e senha
* Login com Google
* Autenticação com JWT
* Rotas protegidas
* Dashboard autenticado
* Criação de eventos
* Listagem de eventos
* Edição de eventos
* Exclusão de eventos
* Validação de eventos no frontend e backend
* Criação de lembretes por evento
* Listagem de lembretes por evento
* Exclusão de lembretes
* Validação de lembretes no frontend e backend
* Busca de eventos no dashboard
* Calendário mensal funcional
* Modal de eventos por dia
* Painel de notificações
* Notificações do navegador
* Som de notificação
* Sidebar responsiva
* Configuração por variáveis de ambiente
* Estrutura preparada para deploy

---

## Tecnologias utilizadas

### Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* SQLite
* Pydantic
* Pydantic Settings
* Passlib
* Bcrypt
* Python-JOSE
* Google Auth

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Framer Motion
* Lucide React
* React OAuth Google

---

## Estrutura do projeto

```text
LifeHUB/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── database.py
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── lifehub.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── CHANGELOG.md
├── README.md
└── .gitignore
```

---

## Configuração do backend

Entre na pasta do backend:

```bash
cd backend
```

Crie e ative o ambiente virtual:

```bash
python -m venv .venv
```

No Windows PowerShell:

```bash
.\.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie um arquivo `.env` dentro da pasta `backend` com base no `.env.example`:

```env
SECRET_KEY=change-this-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./lifehub.db
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
```

Execute o servidor:

```bash
python -m uvicorn main:app --reload
```

A API estará disponível em:

```text
http://localhost:8000
```

A documentação Swagger estará disponível em:

```text
http://localhost:8000/docs
```

---

## Configuração do frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` dentro da pasta `frontend` com base no `.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Execute o frontend:

```bash
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

---

## Variáveis de ambiente

### Backend

| Variável                      | Descrição                              |
| ----------------------------- | -------------------------------------- |
| `SECRET_KEY`                  | Chave usada para assinar os tokens JWT |
| `ALGORITHM`                   | Algoritmo usado no JWT                 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tempo de expiração do token            |
| `DATABASE_URL`                | URL de conexão com o banco de dados    |
| `FRONTEND_URL`                | URL permitida no CORS                  |
| `GOOGLE_CLIENT_ID`            | Client ID do Google OAuth              |

### Frontend

| Variável                | Descrição                                   |
| ----------------------- | ------------------------------------------- |
| `VITE_API_URL`          | URL base da API backend                     |
| `VITE_GOOGLE_CLIENT_ID` | Client ID do Google OAuth usado no frontend |

---

## Autenticação

O LifeHUB possui dois fluxos de autenticação:

### Login tradicional

O usuário informa e-mail e senha. O backend valida as credenciais e retorna um token JWT.

### Login com Google

O frontend recebe o `id_token` do Google e envia para o backend. O backend valida o token usando o Google Client ID, cria o usuário automaticamente caso ele ainda não exista e retorna o JWT padrão do LifeHUB.

Dessa forma, o restante da aplicação continua usando a autenticação própria do projeto.

---

## Rotas principais da API

### Usuários

```text
POST /users/register
POST /users/login
POST /users/google-login
GET  /users/me
GET  /users/
```

### Eventos

```text
POST   /events/
GET    /events/
GET    /events/{event_id}
PUT    /events/{event_id}
DELETE /events/{event_id}
```

### Lembretes de eventos

```text
POST   /events/{event_id}/reminders/
GET    /events/{event_id}/reminders/
DELETE /events/{event_id}/reminders/{reminder_id}
```

### Motor de lembretes

```text
GET   /reminders/due
PATCH /reminders/{reminder_id}/sent
```

---

## Validações implementadas

### Eventos

* Título obrigatório
* Título com limite de caracteres
* Descrição com limite de caracteres
* Data obrigatória
* Horário de início obrigatório
* Horário final maior que o horário inicial
* Bloqueio de criação de evento no passado
* Bloqueio de movimentação de evento futuro para o passado

### Lembretes

* O lembrete precisa ter valor maior que zero
* O lembrete não pode passar de 30 dias antes do evento
* Não é possível criar lembrete para evento que já começou
* Não é possível criar lembrete cujo horário de disparo já passou
* Não é possível duplicar o mesmo lembrete no mesmo evento

---

## Segurança

O projeto já conta com algumas práticas importantes de segurança:

* Senhas armazenadas com hash
* Autenticação com JWT
* Rotas protegidas por Bearer Token
* Variáveis sensíveis fora do código
* `.env` ignorado pelo Git
* Validação de dados no frontend e no backend
* CORS configurado por variável de ambiente
* Validação do token do Google no backend
* Separação entre token do Google e token interno da aplicação

---

## Comandos úteis

### Rodar backend

```bash
cd backend
python -m uvicorn main:app --reload
```

### Rodar frontend

```bash
cd frontend
npm run dev
```

### Atualizar dependências Python

```bash
cd backend
pip freeze > requirements.txt
```

### Verificar status do Git

```bash
git status
```

---
## Deploy

O plano inicial de deploy do LifeHUB é:

- Frontend na Vercel
- Backend no Render
- Banco PostgreSQL em produção futuramente

As instruções detalhadas estão no arquivo [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Roadmap

### Próximas melhorias

* Melhorar tratamento visual de erros
* Melhorar documentação da API
* Criar testes automatizados
* Preparar deploy do backend
* Preparar deploy do frontend
* Configurar banco PostgreSQL para produção
* Melhorar fluxo de notificações como PWA
* Adicionar Service Worker
* Implementar metas
* Implementar sessões de atividade
* Implementar painel de progresso
* Implementar eventos compartilhados
* Implementar grupos de notificação

---

## Padrão de commits

O projeto utiliza commits semânticos no estilo Conventional Commits.

Exemplos:

```text
feat: add google login
fix: correct reminder validation
docs: update project readme
chore: configure backend environment settings
refactor: improve event validation
```

---

## Autor

Desenvolvido por Lucas Andrade. =D

GitHub: [LukaoModesto](https://github.com/LukaoModesto)
Linkedin: https://www.linkedin.com/in/lucasoliveira-o-dev/
