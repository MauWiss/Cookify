import { toast } from "react-toastify";

/**
 * משמיע טקסט בקול שנבחר
 * @param {string} text הטקסט להשמעה
 * @param {string} voiceName שם הקול שנבחר
 */
export const speakText = (text, voiceName) => {
  const voices = window.speechSynthesis.getVoices();
  const isHebrew = /[\u0590-\u05FF]/.test(text);
  const selected = voices.find((v) => v.name === voiceName);

  if (isHebrew && !selected?.lang.includes("he")) {
    toast.warn(
      "Hebrew voice is not supported in your browser. Please use English 🙂",
    );
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  if (selected) utterance.voice = selected;
  utterance.rate = 1;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};
