import React from "react";
import { FaVolumeMute } from "react-icons/fa";

export default function VoiceSelector({ voices, selectedVoice, onChange }) {
  return (
    <div className="mb-4 text-center">
      <label className="mr-2 font-semibold">Choose Voice:</label>
      <select
        value={selectedVoice || ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border p-2 dark:bg-gray-800 dark:text-white"
      >
        {voices.map((voice, idx) => (
          <option key={idx} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <button
        onClick={() => window.speechSynthesis.cancel()}
        title="Stop Speech"
        className="ml-4 text-red-500 hover:text-red-700"
      >
        <FaVolumeMute size={20} />
      </button>
    </div>
  );
}
