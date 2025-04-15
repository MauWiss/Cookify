import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { generateGeminiReply } from "../api/api";
import { FaRobot, FaUser } from "react-icons/fa";
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
  const chatRef = useRef(null);

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
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      toast.error("ChefBot is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="mx-auto max-w-3xl p-4 text-gray-900 dark:text-white">
      <h1 className="mb-6 text-center text-4xl font-extrabold">
        ChefBot🍽️ <span className="text-blue-500">AI Chat</span>
      </h1>

      <div
        ref={chatRef}
        className="h-[60vh] space-y-4 overflow-y-auto rounded-2xl border bg-gray-100 p-6 shadow dark:border-gray-700 dark:bg-gray-800"
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <FaRobot className="mt-1 text-xl text-blue-500" />
            )}
            <div
              className={`max-w-[80%] whitespace-pre-line rounded-xl px-4 py-3 text-sm shadow-md transition-all duration-300 ${
                msg.sender === "user"
                  ? "rounded-br-none bg-blue-600 text-white"
                  : "rounded-bl-none bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <FaUser className="mt-1 text-xl text-blue-500" />
            )}
          </motion.div>
        ))}
        {loading && (
          <div className="text-sm italic text-gray-400">
            ChefBot is typing...
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
      </div>
    </div>
  );
}
