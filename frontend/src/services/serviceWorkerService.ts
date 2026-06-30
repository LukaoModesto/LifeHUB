export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("LifeHUB Service Worker registrado.");
      })
      .catch((error) => {
        console.warn("Não foi possível registrar o Service Worker.", error);
      });
  });
}