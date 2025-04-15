import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { generateGeminiReply, fetchPexelsImage } from "../api/api";
import {
  FaRobot,
  FaUser,
  FaMicrophone,
  FaStop,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function ChefBot() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm ChefBot 👨‍🍳\nAsk me anything about recipes, cooking ideas or ingredients you have!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  // 🧠 טוען קולות מהדפדפן
  useEffect(() => {
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
      if (!selectedVoice && voicesList.length > 0) {
        setSelectedVoice(voicesList[0].name);
      }

      const hasHebrew = voicesList.some((v) => v.lang === "he-IL");
      if (!hasHebrew) {
        toast.warn(
          "Hebrew voice is not supported in your browser. Please use English 🙂",
        );
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakText = (text) => {
    const isHebrew = /[\u0590-\u05FF]/.test(text);
    const selected = voices.find((v) => v.name === selectedVoice);

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

  const extractTitle = (text) => {
    const titleLine = text.match(/Title: (.+)/i);
    if (titleLine) return titleLine[1].trim();
    const headingLine = text.match(/^##\s*(.+)/m);
    if (headingLine) return headingLine[1].trim();
    const firstLine = text.split("\n")[0].trim();
    return firstLine.length > 0 ? firstLine : null;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await generateGeminiReply(input);
      const reply =
        res.data?.content || "Sorry, I couldn't generate a response.";
      const title = extractTitle(reply);
      const imageUrl = title ? await fetchPexelsImage(title) : null;

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, imageUrl },
      ]);
    } catch (err) {
      toast.error("ChefBot is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessageWithText = async (text) => {
    const newMessage = { sender: "user", text };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const res = await generateGeminiReply(text);
      const reply =
        res.data?.content || "Sorry, I couldn't generate a response.";
      const title = extractTitle(reply);
      const imageUrl = title ? await fetchPexelsImage(title) : null;

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, imageUrl },
      ]);
    } catch (err) {
      toast.error("ChefBot is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Your browser does not support voice input.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "he-IL";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessageWithText(transcript);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      toast.error("Voice recognition error: " + event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="mx-auto max-w-3xl p-4 text-gray-900 dark:text-white">
      <ToastContainer />
      <h1 className="mb-4 text-center text-4xl font-extrabold">
        ChefBot 🍽️ <span className="text-blue-500">AI Chat</span>
      </h1>

      <div className="mb-4 text-center">
        <label className="mr-2 font-semibold">Choose Voice:</label>
        <select
          value={selectedVoice || ""}
          onChange={(e) => setSelectedVoice(e.target.value)}
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

      <div
        ref={chatRef}
        className="h-[60vh] space-y-6 overflow-y-auto rounded-2xl border bg-gray-100 p-6 shadow dark:border-gray-700 dark:bg-gray-800"
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col gap-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <FaRobot className="mt-1 text-xl text-green-500" />
              )}
              <div
                className={`relative max-w-[80%] whitespace-pre-line rounded-xl px-4 py-3 text-sm shadow-md transition-all duration-300 ${
                  msg.sender === "user"
                    ? "rounded-br-none bg-blue-600 text-white"
                    : "rounded-bl-none bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {msg.text}
                {msg.sender === "bot" && (
                  <button
                    onClick={() => speakText(msg.text)}
                    title="Read aloud"
                    className="absolute right-2 top-2 text-lg text-blue-500 hover:text-blue-700"
                  >
                    <FaVolumeUp />
                  </button>
                )}
              </div>
              {msg.sender === "user" && (
                <FaUser className="mt-1 text-xl text-blue-500" />
              )}
            </div>
            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="Generated food"
                className="w-full max-w-md rounded-xl shadow"
              />
            )}
          </motion.div>
        ))}
        {loading && (
          <div className="text-sm italic text-gray-400">
            ChefBot is typing...
          </div>
        )}
        {isListening && (
          <div className="text-sm font-semibold text-green-500">
            🎙️ Listening...
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="e.g. Suggest a pasta recipe with tuna and lemon"
          className="flex-1 rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-md transition hover:bg-green-700"
        >
          Send
        </button>
        {!isListening ? (
          <button
            onClick={handleVoiceInput}
            className="rounded-full bg-gray-300 px-3 py-2 text-black hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            <FaMicrophone />
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="rounded-full bg-red-500 px-3 py-2 text-white hover:bg-red-600"
          >
            <FaStop />
          </button>
        )}
      </div>
    </div>
  );
}
