import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { api } from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("lucas10@lifehub.com");
  const [password, setPassword] = useState("123456");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setInfoMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("lifehub_token", response.data.access_token);

      navigate("/dashboard");
    } catch {
      setErrorMessage("E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleAuth() {
    setErrorMessage("");
    setInfoMessage("Login com Google será adicionado em breve.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      <section className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-100/70 blur-3xl" />

        <div className="relative grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_430px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden lg:block"
          >
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <CalendarDays size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">LifeHUB</h1>
                <p className="text-sm font-medium text-slate-400">
                  Agenda pessoal inteligente
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur">
                <Sparkles size={16} />
                Produtividade sem bagunça
              </div>

              <h2 className="text-5xl font-bold leading-tight tracking-tight text-slate-950">
                Sua rotina mais clara, organizada e previsível.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-slate-500">
                Organize eventos, configure lembretes importantes e acompanhe
                seus compromissos em uma experiência simples, bonita e eficiente.
              </p>
            </div>

            <div className="mt-10 grid max-w-xl gap-4">
              <PreviewCard />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h1 className="text-lg font-bold tracking-tight">LifeHUB</h1>
                  <p className="text-xs font-medium text-slate-400">
                    Agenda pessoal
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Bem-vindo de volta
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Entrar na sua conta
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Acesse sua agenda, eventos e lembretes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white"
            >
              <GoogleIcon />
              Continuar com Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                ou
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  E-mail
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                  <Mail size={18} className="text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="lucas10@lifehub.com"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Senha
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                  <Lock size={18} className="text-slate-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {infoMessage && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-600">
                  {infoMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                  Manter conectado
                </label>

                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Esqueci minha senha
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Entrando..." : "Entrar"}

                {!isLoading && (
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Ainda não tem conta?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Criar conta
              </Link>
            </p>

            <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Conta de teste
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Use <strong>lucas10@lifehub.com</strong> para testar a
                    integração com o backend.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function PreviewCard() {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-xl shadow-slate-200/80 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Hoje</p>
          <h3 className="text-xl font-bold">Sua agenda</h3>
        </div>

        <div className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          3 eventos
        </div>
      </div>

      <div className="space-y-3">
        <PreviewEvent
          icon={<CalendarDays size={20} />}
          title="Reunião com o time"
          description="10:00 - 11:00"
          color="primary"
        />

        <PreviewEvent
          icon={<CheckCircle2 size={20} />}
          title="Entrega do projeto"
          description="14:00 - 15:30"
          color="success"
        />

        <PreviewEvent
          icon={<Bell size={20} />}
          title="Consulta médica"
          description="16:30 - 17:30"
          color="danger"
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniMetric icon={<Clock3 size={16} />} label="Hoje" value="3" />
        <MiniMetric icon={<Bell size={16} />} label="Alertas" value="1" />
        <MiniMetric icon={<ShieldCheck size={16} />} label="Seguro" value="JWT" />
      </div>
    </div>
  );
}

function PreviewEvent({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "success" | "danger";
}) {
  const colorClasses = {
    primary: "bg-indigo-100 text-indigo-600",
    success: "bg-emerald-100 text-emerald-600",
    danger: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorClasses[color]}`}
      >
        {icon}
      </div>

      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="mb-2 text-indigo-500">{icon}</div>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default LoginPage;