import { useState } from "react";
import type { ReactNode } from "react";
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
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-900">
      <section className="relative flex min-h-screen items-center justify-center px-5 py-6">
        <div className="absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-160px] h-[460px] w-[460px] rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-100/60 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_410px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
            className="hidden lg:block"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                <CalendarDays size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">
                  LifeHUB
                </h1>
                <p className="text-sm font-medium text-slate-500">
                  Agenda pessoal inteligente
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur-xl">
                <Sparkles size={16} />
                Última atualização
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 xl:text-5xl">
                Eventos, lembretes e notificações em um só lugar.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-500">
                O LifeHUB permite criar eventos, adicionar lembretes e acompanhar
                avisos importantes diretamente pelo painel.
              </p>
            </div>

            <div className="mt-8 grid max-w-xl gap-3">
              <UpdateCard
                icon={<CalendarDays size={20} />}
                title="Eventos conectados ao backend"
                description="Crie compromissos reais e visualize sua agenda."
                color="primary"
              />

              <UpdateCard
                icon={<Bell size={20} />}
                title="Lembretes por evento"
                description="Configure avisos antes dos seus compromissos."
                color="warning"
              />

              <UpdateCard
                icon={<ShieldCheck size={20} />}
                title="Autenticação protegida"
                description="Login, cadastro, dashboard protegido e logout."
                color="success"
              />
            </div>

            <div className="mt-5 grid max-w-xl grid-cols-3 gap-3">
              <MiniMetric icon={<Clock3 size={16} />} label="Eventos" value="OK" />
              <MiniMetric icon={<Bell size={16} />} label="Lembretes" value="OK" />
              <MiniMetric icon={<ShieldCheck size={16} />} label="Auth" value="OK" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.42 }}
            className="rounded-[2rem] border border-white/80 bg-white/78 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12),0_10px_30px_rgba(79,70,229,0.12)] ring-1 ring-slate-200/60 backdrop-blur-2xl sm:p-7"
          >
            <div className="mb-7 lg:hidden">
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

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Acesse sua agenda, eventos e lembretes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white"
            >
              <GoogleIcon />
              Continuar com Google
            </button>

            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                ou
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  E-mail
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                  <Mail size={18} className="text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seuemail@lifehub.com"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Senha
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
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
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 px-4 py-3 text-sm font-medium text-indigo-600">
                  {infoMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-600">
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
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(79,70,229,0.28)] transition hover:bg-indigo-500 hover:shadow-[0_18px_36px_rgba(79,70,229,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
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

            <Link
              to="/register"
              className="mt-5 block rounded-2xl border border-slate-200/80 bg-white/65 px-4 py-3 text-center text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-600"
            >
              Ainda não tenho conta
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function UpdateCard({
  icon,
  title,
  description,
  color,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color: "primary" | "success" | "warning";
}) {
  const colorClasses = {
    primary: "bg-indigo-100 text-indigo-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorClasses[color]}`}
        >
          {icon}
        </div>

        <div>
          <p className="font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
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