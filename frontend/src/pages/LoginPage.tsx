import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { loginUser, loginWithGoogle } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setInfoMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Informe seu e-mail e senha.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      localStorage.setItem("lifehub_token", response.access_token);
      navigate("/dashboard");
    } catch {
      setErrorMessage("E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSuccess(credential?: string) {
    setErrorMessage("");
    setInfoMessage("");

    if (!credential) {
      setErrorMessage("Não foi possível obter o token do Google.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginWithGoogle({
        credential,
      });

      localStorage.setItem("lifehub_token", response.access_token);
      navigate("/dashboard");
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.detail || "Não foi possível entrar com Google.";

      setErrorMessage(backendMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#f8fafc] text-slate-900">
      <div className="grid min-h-[100dvh] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute left-[-10%] top-[-15%] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute bottom-[-15%] right-[-10%] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <CalendarDays size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">LifeHUB</h1>
              <p className="text-sm text-slate-300">Agenda pessoal</p>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur"
            >
              <Sparkles size={16} />
              LifeHUB Alpha
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-5xl font-black leading-tight tracking-tight"
            >
              Eventos, lembretes e notificações em um só lugar.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="mt-6 max-w-lg text-lg leading-8 text-slate-300"
            >
              Organize compromissos, configure lembretes e acompanhe seus avisos
              importantes em uma interface simples e responsiva.
            </motion.p>

            <div className="mt-10 grid gap-4">
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
                description="Login comum, Google Login, dashboard protegido e logout."
                color="success"
              />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            <MiniMetric
              icon={<CalendarDays size={18} />}
              label="Eventos"
              value="OK"
            />

            <MiniMetric icon={<Bell size={18} />} label="Lembretes" value="OK" />

            <MiniMetric
              icon={<ShieldCheck size={18} />}
              label="Auth"
              value="OK"
            />
          </div>
        </section>

        <section className="flex min-h-[100dvh] items-center justify-center px-4 py-6 sm:px-5 sm:py-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md sm:max-w-lg lg:max-w-md"
          >
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <CalendarDays size={27} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight">LifeHUB</h1>
                <p className="text-base text-slate-500">Agenda pessoal</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:rounded-[2rem] sm:p-7 lg:p-8">
              <div className="mb-6 sm:mb-7">
                <p className="text-sm font-semibold text-indigo-600 sm:text-base">
                  Bem-vindo de volta
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  Entrar na sua conta
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  Acesse sua agenda, eventos e lembretes.
                </p>
              </div>

              <div className="mb-5 flex justify-center overflow-hidden rounded-full">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    handleGoogleSuccess(credentialResponse.credential);
                  }}
                  onError={() => {
                    setErrorMessage("Não foi possível entrar com Google.");
                  }}
                  useOneTap={false}
                  text="continue_with"
                  shape="pill"
                  width="100%"
                />
              </div>

              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  ou
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    E-mail
                  </label>

                  <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 sm:h-14">
                    <Mail size={18} className="text-slate-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="seuemail@lifehub.com"
                      disabled={isLoading}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Senha
                  </label>

                  <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 sm:h-14">
                    <Lock size={18} className="text-slate-400" />

                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Digite sua senha"
                      disabled={isLoading}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed sm:text-base"
                    />
                  </div>
                </div>

                {infoMessage && (
                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
                    {infoMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-2 text-slate-500">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Manter conectado
                  </label>

                  <button
                    type="button"
                    className="text-left font-semibold text-indigo-600 transition hover:text-indigo-500"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:text-base"
                >
                  {isLoading ? "Entrando..." : "Entrar"}

                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-5 text-center text-sm text-slate-500 sm:text-base">
                Ainda não tenho conta{" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 transition hover:text-indigo-500"
                >
                  Criar cadastro
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${colorClasses[color]}`}
        >
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-300">
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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="mb-3 text-slate-300">{icon}</div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export default LoginPage;