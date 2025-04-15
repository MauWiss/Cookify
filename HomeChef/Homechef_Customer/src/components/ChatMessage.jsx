import React from "react";
import { FaRobot, FaUser, FaVolumeUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { speakText } from "../hooks/useSpeech";

/**
 * קומפוננטה שמציגה הודעה אחת בצ'אט
 * @param {Object} props
 * @param {"bot"|"user"} props.sender - מי שלח את ההודעה
 * @param {string} props.text - הטקסט של ההודעה
 * @param {string} [props.imageUrl] - קישור לתמונה אם יש
 * @param {string} props.voiceName - שם הקול שנבחר להשמעה
 */
export default function ChatMessage({ sender, text, imageUrl, voiceName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col gap-2 ${
        sender === "user" ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`flex items-start gap-3 ${
          sender === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {sender === "bot" && (
          <FaRobot className="mt-1 text-xl text-green-500" />
        )}

        <div
          className={`relative max-w-[80%] whitespace-pre-line rounded-xl px-4 py-3 text-sm shadow-md transition-all duration-300 ${
            sender === "user"
              ? "rounded-br-none bg-blue-600 text-white"
              : "rounded-bl-none bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
          }`}
        >
          {text}
          {sender === "bot" && (
            <button
              onClick={() => speakText(text, voiceName)}
              title="Read aloud"
              className="absolute right-2 top-2 text-lg text-blue-500 hover:text-blue-700"
            >
              <FaVolumeUp />
            </button>
          )}
        </div>

        {sender === "user" && <FaUser className="mt-1 text-xl text-blue-500" />}
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated food"
          className="w-full max-w-md rounded-xl shadow"
        />
      )}
    </motion.div>
  );
}
