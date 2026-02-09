

import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext.jsx";

const Chatbot = () => {
  const { backendUrl } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const isUserAtBottom = useRef(true);

  // Auto scroll (only if user is at bottom)
  useEffect(() => {
    if (isUserAtBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/chatbot/chat`,
        { message: userMessage }
      );

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: res.data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Chat Window */}
      {open && (
        <div className="w-80 md:w-96 h-[520px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-500 text-white px-5 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <p className="text-xs opacity-80">Online • Ready to help</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-2xl font-bold hover:scale-110 transition"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 px-4 py-3 space-y-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-500"
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.target;
              isUserAtBottom.current =
                scrollTop + clientHeight >= scrollHeight - 10;
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow
                    ${
                      msg.sender === "user"
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl text-sm animate-pulse">
                  Bot is typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask something..."
              className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-500 text-white px-5 py-2 rounded-full transition shadow"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-500 text-white font-semibold shadow-xl flex items-center justify-center hover:scale-110 transition animate-bounce"
      >
        Ask Me!
      </button>
    </div>
  );
};

export default Chatbot;




