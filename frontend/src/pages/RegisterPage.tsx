import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";

import { loginUser, registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("Lucas Andrade");
  const [email, setEmail] = useState("lucas10@lifehub.com");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("123456");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setInfoMessage("");

    if (!name.trim()) {
      setErrorMessage("Informe seu nome.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Informe seu e-mail.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não conferem.");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const tokenData = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("lifehub_token", tokenData.access_token);

      navigate("/dashboard");
    } catch {
      setErrorMessage(
        "Não foi possível criar sua conta. Verifique os dados ou tente outro e-mail."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleAuth() {
    setErrorMessage("");
    setInfoMessage("Cadastro com Google será adicionado em breve.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-900">
      <section className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-160px] h-[460px] w-[460px] rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-100/60 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.10),transparent_30%)]" />

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42 }}
          className="relative w-full max-w-[440px]"
        >
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/70 bg-white/70 px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
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
          </div>

          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur-xl">
              <Sparkles size={16} />
              Comece sua organização
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2.3rem] bg-gradient-to-br from-indigo-200/50 via-white/30 to-cyan-200/50 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/80 bg-white/78 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12),0_10px_30px_rgba(79,70,229,0.12)] ring-1 ring-slate-200/60 backdrop-blur-2xl sm:p-8">
              <div className="text-center">
                <p className="text-sm font-semibold text-indigo-600">
                  Criar conta
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Comece no LifeHUB
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Crie sua conta para organizar eventos, lembretes e
                  compromissos em um só lugar.
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

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nome
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                    <UserRound size={18} className="text-slate-400" />

                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

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
                      placeholder="Crie uma senha"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirmar senha
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                    <Lock size={18} className="text-slate-400" />

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Repita sua senha"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(79,70,229,0.28)] transition hover:bg-indigo-500 hover:shadow-[0_18px_36px_rgba(79,70,229,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Criando conta..." : "Criar conta"}

                  {!isLoading && (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>
              <Link
              to="/login" 
              className="mt-6 block rounded-2xl border border-slate-200/80 bg-white/65 px-4 py-3 text-center text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-600"
              >
                Já tenho uma conta
                </Link>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/60 px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur-xl">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Seus dados ficam protegidos no LifeHUB
            </div>
          </div>
        </motion.div>
      </section>
    </main>
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

export default RegisterPage;