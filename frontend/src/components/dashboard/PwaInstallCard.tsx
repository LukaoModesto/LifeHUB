import { useEffect, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Download,
  Share2,
  Smartphone,
} from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

function PwaInstallCard() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function checkInstallStatus() {
      const isStandaloneDisplay = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

      const isIosStandalone =
        (window.navigator as NavigatorWithStandalone).standalone === true;

      setIsInstalled(isStandaloneDisplay || isIosStandalone);
    }

    function checkDevice() {
      const userAgent = window.navigator.userAgent.toLowerCase();

      setIsIosDevice(/iphone|ipad|ipod/.test(userAgent));
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();

      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
      setMessage("LifeHUB instalado com sucesso.");
    }

    checkInstallStatus();
    checkDevice();

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstallApp() {
    setMessage("");

    if (!installPrompt) {
      setMessage(
        "Use o menu do navegador para adicionar o LifeHUB à tela inicial."
      );
      return;
    }

    await installPrompt.prompt();

    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setMessage("Instalação iniciada.");
    } else {
      setMessage("Instalação cancelada.");
    }

    setInstallPrompt(null);
  }

  if (isInstalled) {
    return (
      <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={23} />
          </div>

          <div>
            <h3 className="text-base font-black text-emerald-900">
              LifeHUB instalado
            </h3>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              O app já está rodando como PWA neste dispositivo.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Smartphone size={23} />
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900">
            Instalar LifeHUB
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Adicione o LifeHUB à tela inicial para acessar como aplicativo.
          </p>
        </div>
      </div>

      {installPrompt && (
        <button
          type="button"
          onClick={handleInstallApp}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.99]"
        >
          <Download size={18} />
          Instalar app
        </button>
      )}

      {isIosDevice && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Share2 size={17} />
            No iPhone
          </div>

          <ol className="space-y-2 text-sm leading-6 text-slate-500">
            <li>1. Abra pelo Safari.</li>
            <li>2. Toque no botão de compartilhar.</li>
            <li>3. Escolha “Adicionar à Tela de Início”.</li>
          </ol>
        </div>
      )}

      {!installPrompt && !isIosDevice && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          No Android/Chrome, use o menu do navegador e escolha “Adicionar à tela
          inicial” ou “Instalar app”.
        </div>
      )}

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <BellRing size={18} className="mt-0.5 shrink-0 text-amber-600" />

        <p className="text-sm leading-6 text-amber-700">
          Notificações no celular serão melhoradas na próxima etapa. O som de
          notificações push depende do sistema do aparelho.
        </p>
      </div>

      {message && (
        <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
          {message}
        </div>
      )}
    </section>
  );
}

export default PwaInstallCard;