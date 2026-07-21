import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback": () => void
        }
      ) => number
    }
  }
}

interface RecaptchaWidgetProps {
  siteKey: string
  onVerify: (token: string | null) => void
}

export function RecaptchaWidget({ siteKey, onVerify }: RecaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (window.grecaptcha?.render) {
      setScriptLoaded(true)
      return
    }

    const existingScript = document.getElementById("recaptcha-script")
    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptLoaded(true))
      return
    }

    const script = document.createElement("script")
    script.id = "recaptcha-script"
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || widgetIdRef.current !== null) return

    widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => onVerify(token),
      "expired-callback": () => onVerify(null),
    })
  }, [scriptLoaded, siteKey, onVerify])

  return <div ref={containerRef} />
}