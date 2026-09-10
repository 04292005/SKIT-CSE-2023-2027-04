import { useState, useEffect, useRef } from "react";

export function useSpeechSynthesis(lang: string = "en") {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  // Indian language BCP-47 prefixes for regional fallback
  const indianPrefixes = ["hi", "gu", "mr", "bn", "ta", "te", "kn"];

  const getVoice = (voices: SpeechSynthesisVoice[], targetLang: string): SpeechSynthesisVoice | undefined => {
    const langPrefix = targetLang.split("-")[0].toLowerCase();
    const normalized = targetLang.replace("_", "-").toLowerCase();

    // 1. Exact locale match
    let voice = voices.find((v) => v.lang.replace("_", "-").toLowerCase() === normalized);
    if (voice) return voice;

    // 2. Same language prefix (e.g. hi-IN, hi-PK …)
    voice = voices.find((v) => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
    if (voice) return voice;

    // 3. Any other Indian language voice (graceful regional fallback)
    if (indianPrefixes.includes(langPrefix)) {
      voice = voices.find((v) =>
        indianPrefixes.some((p) => v.lang.split(/[-_]/)[0].toLowerCase() === p)
      );
      if (voice) return voice;
    }

    // 4. English fallback — never fail silently
    return voices.find((v) => v.lang.startsWith("en"));
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      gu: "gu-IN",
      mr: "mr-IN",
      bn: "bn-IN",
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN"
    };
    const targetLang = langMap[lang] || langMap[lang.slice(0, 2)] || "en-US";
    utterance.lang = targetLang;

    const run = () => {
      if (!synthRef.current) return;
      const voices = synthRef.current.getVoices();
      utterance.voice = getVoice(voices, targetLang) || null;

      utterance.onstart = () => { setIsPlaying(true); setIsPaused(false); };
      utterance.onend = () => { setIsPlaying(false); setIsPaused(false); };
      utterance.onerror = () => { setIsPlaying(false); setIsPaused(false); };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    };

    const voices = synthRef.current.getVoices();
    if (voices.length === 0) {
      const handler = () => {
        synthRef.current?.removeEventListener("voiceschanged", handler);
        run();
      };
      synthRef.current.addEventListener("voiceschanged", handler);
    } else {
      run();
    }
  };

  const pause = () => {
    if (synthRef.current && isPlaying && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return {
    isPlaying,
    isPaused,
    speak,
    pause,
    resume,
    stop,
    isSupported: typeof window !== "undefined" && !!window.speechSynthesis,
  };
}
