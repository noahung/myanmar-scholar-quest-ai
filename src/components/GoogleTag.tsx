// This component injects the Google tag (gtag.js) into the <head> of every page.
import { useEffect } from "react";

export function GoogleTag() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Prevent duplicate tag injection
    if (document.getElementById("google-gtag-js")) return;
    // Inject the gtag.js script
    const script = document.createElement("script");
    script.id = "google-gtag-js";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-6NJFRDW4EH";
    document.head.appendChild(script);
    // Inject the inline config script
    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-6NJFRDW4EH');
    `;
    document.head.appendChild(inlineScript);
  }, []);
  return null;
}
