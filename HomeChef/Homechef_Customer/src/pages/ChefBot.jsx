import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { generateGeminiReply, fetchPexelsImage } from "../api/api";
import { FaMicrophone, FaStop } from "react-icons/fa";
import ChatMessage from "../components/ChatMessage";
import VoiceSelector from "../components/VoiceSelector";

export default function ChefBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm ChefBot 🍽️\nAsk me anything about recipes, cooking ideas or ingredients you have!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
      if (!selectedVoice && voicesList.length > 0) {
        setSelectedVoice(voicesList[0].name);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const extractTitle = (text) => {
    const titleLine = text.match(/Title: (.+)/i);
    if (titleLine) return titleLine[1].trim();
    const headingLine = text.match(/^##\s*(.+)/m);
    if (headingLine) return headingLine[1].trim();
    return text.split("\n")[0].trim() || null;
  };

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
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
    } catch {
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
      sendMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = (e) => {
      toast.error("Voice recognition error: " + e.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
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

      <VoiceSelector
        voices={voices}
        selectedVoice={selectedVoice}
        onChange={setSelectedVoice}
      />

      <div
        ref={chatRef}
        className="h-[60vh] space-y-6 overflow-y-auto rounded-2xl border bg-gray-100 p-6 shadow dark:border-gray-700 dark:bg-gray-800"
      >
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            sender={msg.sender}
            text={msg.text}
            imageUrl={msg.imageUrl}
            voiceName={selectedVoice}
          />
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
          placeholder="e.g. Suggest a pasta recipe with mushrooms and cream"
          className="flex-1 rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
        />
        <button
          onClick={() => sendMessage()}
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
