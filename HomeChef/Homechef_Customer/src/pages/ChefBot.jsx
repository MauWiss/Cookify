import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { generateGeminiReply } from "../api/api";

export default function ChefBot() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
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
      <h1 className="mb-6 text-center text-3xl font-bold">
        👨‍🍳 ChefBot – Your AI Cooking Assistant
      </h1>

      <div
        ref={chatRef}
        className="h-[60vh] space-y-4 overflow-y-auto rounded-xl bg-gray-100 p-4 shadow dark:bg-gray-800"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] whitespace-pre-line rounded-xl px-4 py-2 text-sm ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm italic text-gray-400">
            ChefBot is thinking...
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask ChefBot about anything cooking..."
          className="flex-1 rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-900"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
