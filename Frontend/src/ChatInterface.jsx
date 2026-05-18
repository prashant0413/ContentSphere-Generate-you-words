import { useState, useRef, useEffect, useCallback } from "react";

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

const AttachIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="6" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="#9ca3af">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────
function getNow() {
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

const SUGGESTIONS = ["Summarize a document", "Write an email", "Explain a concept", "Brainstorm ideas"];

const BOT_REPLIES = [
  "Great! Could you share a bit more detail so I can help you better?",
  "Sure, I can help with that. Here's a starting point — let me know if you'd like adjustments.",
  "Happy to assist! What tone would you prefer — formal or conversational?",
  "Of course. What's the target audience for this?",
  "Got it. I'll tailor my response to fit your needs.",
];

const HISTORY = [
  { id: 1, title: "Product description help", preview: "Tell me about the product…", time: "Now" },
  { id: 2, title: "Email campaign ideas", preview: "Here are 5 subject lines…", time: "2h ago" },
  { id: 3, title: "Python script review", preview: "The issue is on line 42…", time: "Yesterday" },
  { id: 4, title: "Blog post outline", preview: "Here's a 5-section structure…", time: "Mon" },
  { id: 5, title: "Travel itinerary", preview: "Day 1: Arrive in Tokyo…", time: "Sun" },
];

const INIT_MESSAGES = [
  { id: 1, role: "bot", text: "Hi there! I'm Content-Sphere, your AI assistant. How can I help you today?", time: "9:41 AM" },
  { id: 2, role: "user", text: "Can you help me write a product description?", time: "9:42 AM" },
  { id: 3, role: "bot", text: "Of course! Tell me about the product — what it does, who it's for, and any key features you'd like highlighted.", time: "9:42 AM" },
];

// ─── useWindowWidth ───────────────────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// ─── TypingIndicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={s.msgRow}>
      <div style={s.botAvatar}>A</div>
      <div style={{
        ...s.bubble, ...s.botBubble,
        display: "flex", gap: 5, alignItems: "center", padding: "12px 16px"
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#9ca3af", display: "inline-block",
            animation: `aiBounce 1.2s infinite ${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Message ──────────────────────────────────────────────────────────────────
function Message({ message }) {
  const isUser = message.role === "user";
  return (
    <div style={{ ...s.msgRow, flexDirection: isUser ? "row-reverse" : "row" }}>
      <div style={isUser ? s.userAvatar : s.botAvatar}>{isUser ? "U" : "A"}</div>
      <div style={{ maxWidth: "75%" }}>
        <div style={{
          ...s.bubble,
          ...(isUser ? s.userBubble : s.botBubble),
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
        }}>
          {message.text}
        </div>
        <div style={{ ...s.time, textAlign: isUser ? "right" : "left" }}>
          {message.time}
        </div>
      </div>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...s.chip,
        background: hov ? "#f3f4f6" : "white",
        borderColor: hov ? "#9ca3af" : "#e5e7eb",
      }}
    >
      {label}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ activeId, onSelect, onNew, onClose, isMobile }) {
  return (
    <div style={{ ...s.sidebar, width: isMobile ? 280 : 256 }}>
      {/* Header */}
      <div style={s.sidebarHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={s.logoIcon}><BotIcon size={15} /></div>
          <span style={s.logoText}>Content-Sphere</span>
        </div>
        {isMobile && (
          <button onClick={onClose} style={s.ghostBtn}><CloseIcon /></button>
        )}
      </div>

      {/* New chat */}
      <div style={{ padding: "10px 10px 4px" }}>
        <button className="ai-newchat" onClick={onNew} style={s.newChatBtn}>
          <PlusIcon /><span>New chat</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "4px 10px 8px" }}>
        <div style={s.searchBox}>
          <SearchIcon />
          <input className="ai-search" placeholder="Search chats…" style={s.searchInput} />
        </div>
      </div>

      {/* History */}
      <div style={s.historyLabel}>Recent</div>
      <div className="ai-sidebar-scroll" style={s.historyList}>
        {HISTORY.map((h) => (
          <button
            key={h.id}
            className="ai-histitem"
            onClick={() => onSelect(h.id)}
            style={{
              ...s.historyItem,
              background: activeId === h.id ? "#EEEDFE" : "transparent",
            }}
          >
            <div style={{ color: "#9ca3af", flexShrink: 0, marginTop: 1 }}>
              <ChatBubbleIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={s.histTitle}>{h.title}</div>
              <div style={s.histPreview}>{h.preview}</div>
            </div>
            <div style={s.histTime}>{h.time}</div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={s.sidebarFooter}>
        <div style={{ ...s.userAvatar, background: "#E1F5EE", color: "#0F6E56" }}>U</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            User
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>Free plan</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ChatInterface() {
  const width = useWindowWidth();
  const isMobile = width < 768;

  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [replyIdx, setReplyIdx] = useState(0);
  const [activeChat, setActiveChat] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // sync sidebar with breakpoint changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback((text) => {
    const val = (text || input).trim();
    if (!val) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: val, time: getNow() }]);
    setInput("");
    setShowSuggestions(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1, role: "bot",
        text: BOT_REPLIES[replyIdx % BOT_REPLIES.length], time: getNow(),
      }]);
      setReplyIdx((i) => i + 1);
      setIsTyping(false);
    }, 1400 + Math.random() * 600);
  }, [input, replyIdx]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleSelectChat = (id) => {
    setActiveChat(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        @keyframes aiBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        .ai-textarea::placeholder { color: #9ca3af; }
        .ai-textarea:focus { outline: none; }
        .ai-inputwrap:focus-within { border-color: #534AB7 !important; box-shadow: 0 0 0 3px rgba(83,74,183,0.10); }
        .ai-send:hover { opacity: 0.85; }
        .ai-send:active { transform: scale(0.97); }
        .ai-newchat:hover { background: #f3f4f6 !important; }
        .ai-histitem:hover { background: #f9fafb !important; }
        .ai-search:focus { outline: none; }
        .ai-search::placeholder { color: #9ca3af; font-size: 13px; }
        .ai-sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .ai-sidebar-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
        .ai-msglist::-webkit-scrollbar { width: 4px; }
        .ai-msglist::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .ai-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 10; }
      `}</style>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="ai-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div style={s.root}>
        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <div style={{
            ...s.sidebarWrap,
            ...(isMobile ? {
              position: "fixed", top: 0, left: 0, height: "100%",
              zIndex: 20, boxShadow: "2px 0 16px rgba(0,0,0,0.12)",
            } : {}),
          }}>
            <Sidebar
              activeId={activeChat}
              onSelect={handleSelectChat}
              onNew={() => {
                setMessages([]);
                setShowSuggestions(true);
                if (isMobile) setSidebarOpen(false);
              }}
              onClose={() => setSidebarOpen(false)}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* ── Chat panel ── */}
        <div style={s.chatPanel}>
          {/* Header */}
          <div style={s.header}>
            <button onClick={() => setSidebarOpen((v) => !v)} style={s.ghostBtn}>
              <MenuIcon />
            </button>
            <div style={s.headerAvatar}><BotIcon size={15} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={s.headerName}>Content-Sphere — AI Assistant</div>
              <div style={s.headerStatus}>
                <span style={s.statusDot} />Online
              </div>
            </div>
            <button style={s.ghostBtn}><MoreIcon /></button>
          </div>

          {/* Messages */}
          <div className="ai-msglist" style={s.messageList}>
            {messages.length === 0 && (
              <div style={s.emptyState}>
                <div style={s.emptyIconWrap}><BotIcon size={26} /></div>
                <div style={s.emptyTitle}>Start a conversation</div>
                <div style={s.emptySubtitle}>Ask me anything — I'm here to help.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 20 }}>
                  {SUGGESTIONS.map((sug) => (
                    <Chip key={sug} label={sug} onClick={() => sendMessage(sug)} />
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg) => <Message key={msg.id} message={msg} />)}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Inline chips (after first message) */}
          {showSuggestions && messages.length > 0 && (
            <div style={s.chipsRow}>
              {SUGGESTIONS.map((sug) => (
                <Chip key={sug} label={sug} onClick={() => sendMessage(sug)} />
              ))}
            </div>
          )}

          {/* Input */}
          <div style={s.inputArea}>
            <div className="ai-inputwrap" style={s.inputWrap}>
              <button style={s.attachBtn}><AttachIcon /></button>
              <textarea
                ref={textareaRef}
                className="ai-textarea"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Type a message… (Enter to send)"
                style={s.textarea}
              />
              <button
                className="ai-send"
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                style={{
                  ...s.sendBtn,
                  opacity: input.trim() ? 1 : 0.4,
                  cursor: input.trim() ? "pointer" : "default",
                }}
              >
                <SendIcon />
              </button>
            </div>
            <div style={s.hint}>Content-Sphere can make mistakes. Verify important information.</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    display: "flex",
    height: "100vh",
    width: "100%",
    background: "#f9fafb",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    overflow: "hidden",
    position: "relative",
  },

  // Sidebar
  sidebarWrap: {
    flexShrink: 0,
    height: "100%",
    borderRight: "1px solid #f3f4f6",
  },
  sidebar: {
    height: "100%",
    background: "white",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 14px 12px",
    borderBottom: "1px solid #f3f4f6",
    flexShrink: 0,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: "#534AB7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 15,
    fontWeight: 500,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  newChatBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: 9,
    background: "white",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    fontFamily: "inherit",
    transition: "background 0.12s",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 10px",
    background: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #f3f4f6",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    fontSize: 13,
    color: "#111827",
    flex: 1,
    fontFamily: "inherit",
    minWidth: 0,
  },
  historyLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    padding: "6px 14px 4px",
    flexShrink: 0,
  },
  historyList: {
    flex: 1,
    overflowY: "auto",
    padding: "0 6px",
  },
  historyItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
    padding: "8px 8px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "background 0.1s",
    marginBottom: 2,
  },
  histTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  histPreview: {
    fontSize: 12,
    color: "#9ca3af",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginTop: 1,
  },
  histTime: {
    fontSize: 11,
    color: "#9ca3af",
    flexShrink: 0,
    marginTop: 1,
  },
  sidebarFooter: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderTop: "1px solid #f3f4f6",
    flexShrink: 0,
  },

  // Chat panel
  chatPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minWidth: 0,
    background: "#f9fafb",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 14px",
    background: "white",
    borderBottom: "1px solid #f3f4f6",
    flexShrink: 0,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#534AB7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  headerStatus: {
    fontSize: 11,
    color: "#1D9E75",
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#1D9E75",
    display: "inline-block",
  },
  ghostBtn: {
    width: 34,
    height: 34,
    border: "none",
    background: "transparent",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: 0,
  },

  // Messages
  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#534AB7",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 500,
    flexShrink: 0,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#E1F5EE",
    color: "#0F6E56",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 500,
    flexShrink: 0,
  },
  bubble: {
    padding: "10px 14px",
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 1.55,
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  botBubble: {
    background: "white",
    color: "#111827",
    border: "1px solid #f3f4f6",
  },
  userBubble: {
    background: "#534AB7",
    color: "white",
    border: "1px solid #534AB7",
  },
  time: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
  },

  // Empty state
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1.5rem",
    textAlign: "center",
  },
  emptyIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 15,
    background: "#534AB7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 500,
    color: "#111827",
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
  },

  // Chips
  chipsRow: {
    display: "flex",
    gap: 7,
    flexWrap: "wrap",
    padding: "2px 16px 10px",
  },
  chip: {
    padding: "6px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    fontSize: 12,
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.12s, border-color 0.12s",
  },

  // Input
  inputArea: {
    padding: "10px 14px 14px",
    background: "white",
    borderTop: "1px solid #f3f4f6",
    flexShrink: 0,
  },
  inputWrap: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "7px 8px 7px 12px",
    background: "white",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  attachBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "2px 2px 4px",
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: 14,
    color: "#111827",
    resize: "none",
    fontFamily: "inherit",
    lineHeight: 1.55,
    maxHeight: 120,
    padding: 0,
    margin: 0,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "none",
    background: "#534AB7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "opacity 0.15s, transform 0.1s",
  },
  hint: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
  },
};