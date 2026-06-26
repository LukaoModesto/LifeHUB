# LifeHUB Deployment Guide

Este documento descreve o plano de deploy do LifeHUB em produção.

Estratégia inicial:

- Frontend: Vercel
- Backend: Render
- Banco local atual: SQLite
- Banco de produção recomendado: PostgreSQL

O objetivo inicial é preparar o projeto para deploy sem quebrar o ambiente local.

---

## 1. Checklist antes do deploy

Antes de publicar, confirmar:

- Backend roda localmente sem erro
- Frontend roda localmente sem erro
- Login tradicional funciona
- Login com Google funciona
- Dashboard carrega após refresh
- Criação de evento funciona
- Edição de evento funciona
- Exclusão de evento funciona
- Criação de lembrete funciona
- Validação de eventos e lembretes funciona
- `.env` não está versionado
- `.env.example` está atualizado
- `requirements.txt` está atualizado
- `package.json` está atualizado
- README está atualizado
- CHANGELOG está atualizado

---

## 2. Variáveis de ambiente

### Backend

Arquivo local:

```env
ENVIRONMENT=development

SECRET_KEY=change-this-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

DATABASE_URL=sqlite:///./lifehub.db

FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173

GOOGLE_CLIENT_ID=your-google-client-id