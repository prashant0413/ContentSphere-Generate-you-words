import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = 'http://localhost:5000/api/content/generate';

// ─── Icons ───────────────────────────────────────────────────────────────────
const BotIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
    <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 7a5 5 0 00-5 5v3h10v-3a5 5 0 00-5-5zm-2 6a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);
const AttachIcon = ({ dark }) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={dark ? "#6b7280" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);
const MenuIcon = ({ dark }) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={dark ? "#9ca3af" : "#6b7280"} strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = ({ dark }) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={dark ? "#9ca3af" : "#6b7280"} strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const SearchIcon = ({ dark }) => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke={dark ? "#6b7280" : "#9ca3af"} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="6" /><path d="M21 21l-4.35-4.35" />
  </svg>
);
const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="#9ca3af">
    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
  </svg>
);
const ChatBubbleIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const SunIcon = ({ dark }) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={dark ? "#f9d71c" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = ({ dark }) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={dark ? "#9ca3af" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const XSmIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke={color || "currentColor"} strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Content Modes ────────────────────────────────────────────────────────────
const CONTENT_MODES = [
  {
    id: "email",
    label: "Email",
    emoji: "✉️",
    color: "#4f86f7",
    placeholder: "Describe the email — recipient, purpose, tone…",
  },
  {
    id: "blog",
    label: "Blog Post",
    emoji: "📝",
    color: "#10b981",
    placeholder: "What's the topic, audience, and key points to cover?",
  },
  {
    id: "social",
    label: "Social Post",
    emoji: "📣",
    color: "#f59e0b",
    placeholder: "Platform, message, tone — what's this post about?",
  },
  {
    id: "summary",
    label: "Summary",
    emoji: "📋",
    color: "#8b5cf6",
    placeholder: "Paste the content or describe what you want summarized…",
  },
];

// ─── Data ────────────────────────────────────────────────────────────────────
function getNow() {
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

const SUGGESTIONS = ["Summarize a document", "Write an email", "Explain a concept", "Brainstorm ideas"];

const HISTORY = [
  { id: 1, title: "Product description help", preview: "Tell me about the product…", time: "Now" },
  { id: 2, title: "Email campaign ideas", preview: "Here are 5 subject lines…", time: "2h ago" },
  { id: 3, title: "Python script review", preview: "The issue is on line 42…", time: "Yesterday" },
  { id: 4, title: "Blog post outline", preview: "Here's a 5-section structure…", time: "Mon" },
  { id: 5, title: "Travel itinerary", preview: "Day 1: Arrive in Tokyo…", time: "Sun" },
];

const INIT_MESSAGES = [
  { id: 1, role: "bot", text: "Hi there! I'm ContentSphere, your AI assistant. How can I help you today?", time: "9:41 AM" },
  { id: 2, role: "user", text: "Can you help me write a product description?", time: "9:42 AM" },
  { id: 3, role: "bot", text: "Of course! Tell me about the product — what it does, who it's for, and any key features you'd like highlighted.", time: "9:42 AM" },
];

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return width;
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────
function TypingIndicator({ dark }) {
  return (
    <div style={s.msgRow}>
      <div style={s.botAvatar}>A</div>
      <div style={{
        ...s.bubble,
        background: dark ? "#1e2130" : "white",
        border: `1px solid ${dark ? "#2d3348" : "#f3f4f6"}`,
        display: "flex", gap: 5, alignItems: "center", padding: "12px 16px",
        borderBottomLeftRadius: 4,
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: dark ? "#6b7280" : "#9ca3af", display: "inline-block",
            animation: `aiBounce 1.2s infinite ${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Message ──────────────────────────────────────────────────────────────────
function Message({ message, dark }) {
  const isUser = message.role === "user";
  const mode = message.modeId ? CONTENT_MODES.find(m => m.id === message.modeId) : null;
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const SOURCE_META = {
    redis_cache: { label: "⚡ Redis Cache",  bg: "#fff3e0", color: "#e65100" },
    mysql_cache: { label: "🗄️ MySQL Cache", bg: "#e3f2fd", color: "#1565c0" },
    gemini_api:  { label: "🤖 Gemini AI",   bg: "#e8f5e9", color: "#2e7d32" },
  };

  const sourceMeta = message.source ? SOURCE_META[message.source] : null;

  return (
    <div style={{ ...s.msgRow, flexDirection: isUser ? "row-reverse" : "row" }}>
      <div style={isUser
        ? { ...s.userAvatar, background: dark ? "#0f3028" : "#E1F5EE", color: dark ? "#34d399" : "#0F6E56" }
        : s.botAvatar
      }>{isUser ? "U" : "A"}</div>
      <div style={{ maxWidth: "75%" }}>
        {isUser && mode && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 10,
              background: mode.color + "22", color: mode.color, border: `1px solid ${mode.color}44`,
            }}>
              {mode.emoji} {mode.label}
            </span>
          </div>
        )}

        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ position: "relative" }}>
          <div style={{
            ...s.bubble,
            ...(isUser
              ? { background: "#534AB7", color: "white", border: "1px solid #534AB7" }
              : { background: dark ? "#1e2130" : "white", color: dark ? "#e2e8f0" : "#111827", border: `1px solid ${dark ? "#2d3348" : "#f3f4f6"}` }
            ),
            borderBottomRightRadius: isUser ? 4 : 16,
            borderBottomLeftRadius: isUser ? 16 : 4,
            whiteSpace: "pre-wrap",
          }}>
            {message.text}
          </div>

          {!isUser && (hovered || copied) && (
            <button onClick={handleCopy} title={copied ? "Copied!" : "Copy to clipboard"} style={{
              position: "absolute", bottom: 8, right: 8,
              width: 26, height: 26,
              border: `1px solid ${dark ? "#3d4460" : "#e5e7eb"}`,
              borderRadius: 6,
              background: dark ? "#2d3348" : "#f9fafb",
              color: copied ? "#1D9E75" : (dark ? "#9ca3af" : "#6b7280"),
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s", padding: 0,
            }}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          )}
        </div>

        {/* Source badge */}
        {sourceMeta && (
          <div style={{ marginTop: 5 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 10,
              background: sourceMeta.bg, color: sourceMeta.color,
            }}>
              {sourceMeta.label}
            </span>
          </div>
        )}

        <div style={{ ...s.time, textAlign: isUser ? "right" : "left", color: dark ? "#4b5563" : "#9ca3af" }}>
          {message.time}
        </div>
      </div>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ label, onClick, dark }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...s.chip,
        background: hov ? (dark ? "#2d3348" : "#f3f4f6") : (dark ? "#1e2130" : "white"),
        borderColor: hov ? (dark ? "#4b5563" : "#9ca3af") : (dark ? "#2d3348" : "#e5e7eb"),
        color: dark ? "#9ca3af" : "#6b7280",
      }}>{label}</button>
  );
}

// ─── ModeTab ──────────────────────────────────────────────────────────────────
function ModeTab({ mode, active, onClick, dark }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 5, padding: "4px 11px",
        borderRadius: 20, border: "1px solid", fontSize: 12,
        fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.15s", whiteSpace: "nowrap",
        borderColor: active ? mode.color : (dark ? "#2d3348" : "#e5e7eb"),
        background: active ? (mode.color + "1a") : hov ? (dark ? "#2d3348" : "#f3f4f6") : (dark ? "#1e2130" : "white"),
        color: active ? mode.color : (dark ? "#9ca3af" : "#6b7280"),
        boxShadow: active ? `0 0 0 1px ${mode.color}44` : "none",
      }}>
      <span style={{ fontSize: 13 }}>{mode.emoji}</span>
      <span>{mode.label}</span>
    </button>
  );
}

// ─── DarkModeToggle ───────────────────────────────────────────────────────────
function DarkModeToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle} title={dark ? "Light mode" : "Dark mode"}
      style={{
        width: 34, height: 34, border: "none", background: dark ? "#2d3348" : "#f3f4f6",
        borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, padding: 0, transition: "background 0.2s",
      }}>
      {dark ? <SunIcon dark={dark} /> : <MoonIcon dark={dark} />}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ activeId, onSelect, onNew, onClose, isMobile, dark, onToggleDark }) {
  const bg = dark ? "#13151f" : "white";
  const border = dark ? "#1e2130" : "#f3f4f6";
  const tp = dark ? "#e2e8f0" : "#111827";
  const tm = dark ? "#4b5563" : "#9ca3af";
  return (
    <div style={{ ...s.sidebar, width: isMobile ? 280 : 256, background: bg }}>
      <div style={{ ...s.sidebarHeader, borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={s.logoIcon}><BotIcon size={15} /></div>
          <span style={{ ...s.logoText, color: tp }}>ContentSphere</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
          {isMobile && <button onClick={onClose} style={s.ghostBtn}><CloseIcon dark={dark} /></button>}
        </div>
      </div>
      <div style={{ padding: "10px 10px 4px" }}>
        <button className="ai-newchat" onClick={onNew} style={{
          ...s.newChatBtn, background: dark ? "#1e2130" : "white",
          border: `1px solid ${dark ? "#2d3348" : "#e5e7eb"}`, color: dark ? "#d1d5db" : "#374151",
        }}>
          <PlusIcon /><span>New chat</span>
        </button>
      </div>
      <div style={{ padding: "4px 10px 8px" }}>
        <div style={{ ...s.searchBox, background: dark ? "#1e2130" : "#f9fafb", border: `1px solid ${dark ? "#2d3348" : "#f3f4f6"}` }}>
          <SearchIcon dark={dark} />
          <input className="ai-search" placeholder="Search chats…"
            style={{ ...s.searchInput, color: dark ? "#e2e8f0" : "#111827", background: "transparent" }} />
        </div>
      </div>
      <div style={{ ...s.historyLabel, color: tm }}>Recent</div>
      <div className="ai-sidebar-scroll" style={s.historyList}>
        {HISTORY.map(h => (
          <button key={h.id} className="ai-histitem" onClick={() => onSelect(h.id)} style={{
            ...s.historyItem,
            background: activeId === h.id ? (dark ? "#2a2d4a" : "#EEEDFE") : "transparent",
          }}>
            <div style={{ color: tm, flexShrink: 0, marginTop: 1 }}><ChatBubbleIcon /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...s.histTitle, color: tp }}>{h.title}</div>
              <div style={{ ...s.histPreview, color: tm }}>{h.preview}</div>
            </div>
            <div style={{ ...s.histTime, color: tm }}>{h.time}</div>
          </button>
        ))}
      </div>
      <div style={{ ...s.sidebarFooter, borderTop: `1px solid ${border}` }}>
        <div style={{ ...s.userAvatar, background: dark ? "#0f3028" : "#E1F5EE", color: dark ? "#34d399" : "#0F6E56" }}>U</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: tp, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>User</div>
          <div style={{ fontSize: 11, color: tm }}>Free plan</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ChatInterface() {
  const width = useWindowWidth();
  const isMobile = width < 768;

  const [dark, setDark] = useState(false);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeChat, setActiveChat] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeMode, setActiveMode] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { setSidebarOpen(!isMobile); }, [isMobile]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { document.title = "ContentSphere"; }, []);
  useEffect(() => { if (activeMode) textareaRef.current?.focus(); }, [activeMode]);

  const handleModeClick = (mode) => {
    setActiveMode(prev => prev?.id === mode.id ? null : mode);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };


  const sendMessage = useCallback(async (text) => {
    const val = (text || input).trim();
    if (!val) return;
    const mode = activeMode;

    setMessages(prev => [...prev, {
    id: Date.now(), role: "user", text: val, modeId: mode?.id || null, time: getNow()
    }]);
    setInput("");
    setShowSuggestions(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);

    try {
    const response = await axios.post(API_URL, {
      type: mode?.id || "general",
      prompt: val,
    });
    const { content, source } = response.data;
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: "bot",
      text: content,
      source,
      time: getNow()
    }]);
    } catch (err) {
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: "bot",
      text: "⚠️ " + (err.response?.data?.message || "Something went wrong. Please try again."),
      time: getNow()
    }]);
    } finally {
    setIsTyping(false);
    }
  }, [input, activeMode]); // ← correct deps: only input + activeMode

  const handleKeyDown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const handleInput = e => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };
  const handleSelectChat = id => { setActiveChat(id); if (isMobile) setSidebarOpen(false); };

  const panelBg = dark ? "#0d0f1a" : "#f9fafb";
  const headerBg = dark ? "#13151f" : "white";
  const headerBorder = dark ? "#1e2130" : "#f3f4f6";
  const textPrimary = dark ? "#e2e8f0" : "#111827";
  const textMuted = dark ? "#4b5563" : "#9ca3af";
  const inputBorder = activeMode ? activeMode.color + "99" : (dark ? "#2d3348" : "#e5e7eb");
  const sendBg = activeMode ? activeMode.color : "#534AB7";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        @keyframes aiBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        .ai-textarea::placeholder { color: ${dark ? "#4b5563" : "#9ca3af"}; }
        .ai-textarea:focus { outline: none; }
        .ai-inputwrap:focus-within { border-color: ${sendBg} !important; box-shadow: 0 0 0 3px ${sendBg}28; }
        .ai-send:hover { opacity: 0.85; }
        .ai-send:active { transform: scale(0.97); }
        .ai-newchat:hover { background: ${dark ? "#2d3348" : "#f3f4f6"} !important; }
        .ai-histitem:hover { background: ${dark ? "#1e2130" : "#f9fafb"} !important; }
        .ai-search:focus { outline: none; }
        .ai-search::placeholder { color: ${dark ? "#4b5563" : "#9ca3af"}; font-size: 13px; }
        .ai-sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .ai-sidebar-scroll::-webkit-scrollbar-thumb { background: ${dark ? "#2d3348" : "#e5e7eb"}; border-radius: 3px; }
        .ai-msglist::-webkit-scrollbar { width: 4px; }
        .ai-msglist::-webkit-scrollbar-thumb { background: ${dark ? "#2d3348" : "#e5e7eb"}; border-radius: 4px; }
        .ai-overlay { position: fixed; inset: 0; background: rgba(0,0,0,${dark ? "0.5" : "0.3"}); z-index: 10; }
        .modetabs::-webkit-scrollbar { display: none; }
      `}</style>

      {isMobile && sidebarOpen && <div className="ai-overlay" onClick={() => setSidebarOpen(false)} />}

      <div style={{ ...s.root, background: panelBg, transition: "background 0.25s" }}>
        {sidebarOpen && (
          <div style={{
            ...s.sidebarWrap, borderRight: `1px solid ${headerBorder}`,
            ...(isMobile ? { position: "fixed", top: 0, left: 0, height: "100%", zIndex: 20, boxShadow: "2px 0 16px rgba(0,0,0,0.18)" } : {}),
          }}>
            <Sidebar activeId={activeChat} onSelect={handleSelectChat}
              onNew={() => { setMessages([]); setShowSuggestions(true); setActiveMode(null); if (isMobile) setSidebarOpen(false); }}
              onClose={() => setSidebarOpen(false)} isMobile={isMobile}
              dark={dark} onToggleDark={() => setDark(d => !d)} />
          </div>
        )}

        <div style={{ ...s.chatPanel, background: panelBg, transition: "background 0.25s" }}>
          {/* Header */}
          <div style={{ ...s.header, background: headerBg, borderBottom: `1px solid ${headerBorder}`, transition: "background 0.25s" }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={s.ghostBtn}><MenuIcon dark={dark} /></button>
            <div style={s.headerAvatar}><BotIcon size={15} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...s.headerName, color: textPrimary }}>ContentSphere — AI Assistant</div>
              <div style={s.headerStatus}><span style={s.statusDot} />Online</div>
            </div>
            {!sidebarOpen && <DarkModeToggle dark={dark} onToggle={() => setDark(d => !d)} />}
            <button style={s.ghostBtn}><MoreIcon /></button>
          </div>

          {/* Messages */}
          <div className="ai-msglist" style={s.messageList}>
            {messages.length === 0 && (
              <div style={s.emptyState}>
                <div style={s.emptyIconWrap}><BotIcon size={26} /></div>
                <div style={{ ...s.emptyTitle, color: textPrimary }}>Start a conversation</div>
                <div style={{ ...s.emptySubtitle, color: textMuted }}>Pick a content type below, or just ask anything.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 20 }}>
                  {SUGGESTIONS.map(sug => <Chip key={sug} label={sug} onClick={() => sendMessage(sug)} dark={dark} />)}
                </div>
              </div>
            )}
            {messages.map(msg => <Message key={msg.id} message={msg} dark={dark} />)}
            {isTyping && <TypingIndicator dark={dark} />}
            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && messages.length > 0 && (
            <div style={s.chipsRow}>
              {SUGGESTIONS.map(sug => <Chip key={sug} label={sug} onClick={() => sendMessage(sug)} dark={dark} />)}
            </div>
          )}

          {/* Input area */}
          <div style={{ ...s.inputArea, background: headerBg, borderTop: `1px solid ${headerBorder}`, transition: "background 0.25s" }}>

            {/* Mode selector tabs */}
            <div className="modetabs" style={{
              display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8,
              scrollbarWidth: "none",
            }}>
              {CONTENT_MODES.map(mode => (
                <ModeTab key={mode.id} mode={mode} active={activeMode?.id === mode.id}
                  onClick={() => handleModeClick(mode)} dark={dark} />
              ))}
            </div>

            {/* Input box */}
            <div className="ai-inputwrap" style={{
              ...s.inputWrap,
              background: dark ? "#13151f" : "white",
              border: `1px solid ${inputBorder}`,
              transition: "border-color 0.2s, box-shadow 0.2s",
              flexDirection: "column", alignItems: "stretch", padding: "8px 8px 8px 12px", gap: 0,
            }}>
              {/* Active mode badge */}
              {activeMode && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5, alignSelf: "flex-start",
                  padding: "2px 8px 2px 9px", borderRadius: 20, marginBottom: 7,
                  background: activeMode.color + "18", border: `1px solid ${activeMode.color}44`,
                }}>
                  <span style={{ fontSize: 12 }}>{activeMode.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: activeMode.color }}>{activeMode.label} mode</span>
                  <button onClick={() => setActiveMode(null)} style={{
                    border: "none", background: "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", padding: 1, marginLeft: 2,
                  }}>
                    <XSmIcon color={activeMode.color} />
                  </button>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <button style={s.attachBtn}><AttachIcon dark={dark} /></button>
                <textarea
                  ref={textareaRef}
                  className="ai-textarea"
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={activeMode ? activeMode.placeholder : "Type a message… (Enter to send)"}
                  style={{ ...s.textarea, color: dark ? "#e2e8f0" : "#111827", background: "transparent" }}
                />
                <button
                  className="ai-send"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  style={{
                    ...s.sendBtn, background: sendBg,
                    opacity: input.trim() && !isTyping ? 1 : 0.4,
                    cursor: input.trim() && !isTyping ? "pointer" : "default",
                    transition: "background 0.2s, opacity 0.15s",
                  }}
                >
                  <SendIcon />
                </button>
              </div>
            </div>

            <div style={{ ...s.hint, color: textMuted }}>ContentSphere can make mistakes. Verify important information.</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: { display: "flex", height: "100vh", width: "100%", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden", position: "relative" },
  sidebarWrap: { flexShrink: 0, height: "100%" },
  sidebar: { height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" },
  sidebarHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 14px 12px", flexShrink: 0 },
  logoIcon: { width: 28, height: 28, borderRadius: 7, background: "#534AB7", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 15, fontWeight: 500, letterSpacing: "-0.02em" },
  newChatBtn: { display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "8px 10px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", transition: "background 0.12s" },
  searchBox: { display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", borderRadius: 8 },
  searchInput: { border: "none", fontSize: 13, flex: 1, fontFamily: "inherit", minWidth: 0 },
  historyLabel: { fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", padding: "6px 14px 4px", flexShrink: 0 },
  historyList: { flex: 1, overflowY: "auto", padding: "0 6px" },
  historyItem: { display: "flex", alignItems: "flex-start", gap: 8, width: "100%", padding: "8px 8px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.1s", marginBottom: 2 },
  histTitle: { fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  histPreview: { fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 },
  histTime: { fontSize: 11, flexShrink: 0, marginTop: 1 },
  sidebarFooter: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", flexShrink: 0 },
  chatPanel: { flex: 1, display: "flex", flexDirection: "column", height: "100%", minWidth: 0 },
  header: { display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", flexShrink: 0 },
  headerAvatar: { width: 34, height: 34, borderRadius: "50%", background: "#534AB7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  headerName: { fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  headerStatus: { fontSize: 11, color: "#1D9E75", display: "flex", alignItems: "center", gap: 4, marginTop: 1 },
  statusDot: { width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" },
  ghostBtn: { width: 34, height: 34, border: "none", background: "transparent", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 },
  messageList: { flex: 1, overflowY: "auto", padding: "20px 16px 8px", display: "flex", flexDirection: "column", gap: 14 },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 8 },
  botAvatar: { width: 28, height: 28, borderRadius: "50%", background: "#534AB7", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, flexShrink: 0 },
  userAvatar: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, flexShrink: 0 },
  bubble: { padding: "10px 14px", borderRadius: 16, fontSize: 14, lineHeight: 1.55, wordBreak: "break-word" },
  time: { fontSize: 11, marginTop: 4 },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", textAlign: "center" },
  emptyIconWrap: { width: 54, height: 54, borderRadius: 15, background: "#534AB7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: 500, marginBottom: 5 },
  emptySubtitle: { fontSize: 14 },
  chipsRow: { display: "flex", gap: 7, flexWrap: "wrap", padding: "2px 16px 10px" },
  chip: { padding: "6px 12px", borderRadius: 20, borderWidth: 1, borderStyle: "solid", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "background 0.12s, border-color 0.12s" },
  inputArea: { padding: "10px 14px 14px", flexShrink: 0 },
  inputWrap: { display: "flex", borderRadius: 14 },
  attachBtn: { border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px 2px 4px", flexShrink: 0 },
  textarea: { flex: 1, border: "none", background: "transparent", fontSize: 14, resize: "none", fontFamily: "inherit", lineHeight: 1.55, maxHeight: 120, padding: 0, margin: 0 },
  sendBtn: { width: 36, height: 36, borderRadius: 10, border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  hint: { fontSize: 11, textAlign: "center", marginTop: 8 },
};