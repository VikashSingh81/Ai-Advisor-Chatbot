import { useState, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import jsPDF from "jspdf";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(() => {
    const saved = localStorage.getItem("ai_chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [persona, setPersona] = useState("Mentor");
  const [panelMode, setPanelMode] = useState(false); // keep but don't use
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("ai_chat_history", JSON.stringify(chat));
  }, [chat]);

  const triggerSpark = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#fbbf24", "#f59e0b", "#ffffff"],
    });
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    const userMsg = { text: message, sender: "user" };
    setChat((prev) => [...prev, userMsg]);

    const currentMsg = message;
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: currentMsg,
        persona: persona.toLowerCase(),
        panelMode: false, // 🔥 FORCE SINGLE MODE
      });

      // 🔥 ONLY SINGLE RESPONSE
      const botMsg = {
        text: res.data.reply || "⚠️ No response",
        sender: "bot",
        persona: persona.toLowerCase(),
      };

      setChat((prev) => [...prev, botMsg]);
      triggerSpark();

    } catch (error) {
      console.error(error);

      setChat((prev) => [
        ...prev,
        {
          text: "⚠️ API not working (quota or key issue)",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Conversation History", 10, 10);
    let y = 20;
    chat.forEach((msg) => {
      const txt = `${msg.sender.toUpperCase()}: ${msg.text}`;
      const split = doc.splitTextToSize(txt, 180);
      doc.text(split, 10, y);
      y += (split.length * 7);
    });
    doc.save("history.pdf");
  };

  const personaImages = {
    Mentor: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    Developer: "https://images.unsplash.com/photo-1556157382-97eda2d62296",
    HR: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    Critic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  };

  return (
    <div className="h-screen flex bg-[#050505] text-zinc-300 overflow-hidden font-sans">

      {/* SIDEBAR */}
      <div className="w-72 bg-blue-950 p-8 flex flex-col border-r border-blue-800 shadow-2xl">
        <h1 className="text-2xl font-black mb-10 italic text-amber-500 tracking-tighter">
          ADVISOR<span className="text-zinc-600">.AI</span>
        </h1>

        <div className="space-y-3 mb-10">
          <button onClick={() => setChat([])} className="w-full text-left text-[16px] font-black tracking-[0.2em] text-zinc-300 hover:text-amber-500 py-3 border-b border-white/10 transition-all duration-300 uppercase">RESET SESSION ⭮</button>
          <button onClick={downloadPDF} className="w-full text-left text-[16px] font-black tracking-[0.2em] text-zinc-300 hover:text-amber-500 py-3 border-b border-white/10 transition-all duration-300 uppercase">EXPORT_PDF 📄</button>
        </div>

        <div className="flex flex-col gap-2 mb-10">
          <label className="text-[18px] font-black italic tracking-[0.2em] text-yellow uppercase">
            EXPERT<span className="text-amber-500">.SELECTION</span>
          </label>

          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="bg-transparent border-b border-amber-900/50 py-2 outline-none text-amber-100 cursor-pointer text-sm"
          >
            {Object.keys(personaImages).map(p => <option key={p} className="bg-black">{p}</option>)}
          </select>
        </div>

        {/* 🔥 FIXED BUTTON (NO TOGGLE NOW) */}
        <div className="mt-auto flex flex-col items-center group">
          <div className="relative">
            <img
              src={personaImages[persona]}
              alt="expert"
              className="h-32 w-32 rounded-full object-cover border border-amber-900/50"
            />
          </div>

          <button className="mt-6 px-4 py-1 text-[10px] tracking-widest border border-zinc-800 text-zinc-600 cursor-not-allowed">
            SINGLE_ACTIVE
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col bg-[#050505]">

        <div className="flex-1 p-10 overflow-y-auto space-y-8">
          {chat.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xl`}>
                {msg.sender === "bot" && (
                  <span className="text-[9px] tracking-widest text-amber-700 block mb-2 font-black uppercase">
                    {msg.persona}
                  </span>
                )}
                <div className={`p-5 ${
                  msg.sender === "user"
                    ? "bg-amber-600 text-black font-bold"
                    : "bg-[#0f0f0f] text-zinc-300"
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && <div className="text-amber-900 animate-pulse">PROCESSING...</div>}
        </div>

        {/* INPUT */}
        <div className="p-10 bg-black">
          <div className="flex gap-4 bg-[#0a0a0a] p-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent p-4 outline-none text-amber-50"
              placeholder="Enter query..."
            />
            <button
              onClick={sendMessage}
              className="px-8 py-4 bg-amber-600 text-black"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;