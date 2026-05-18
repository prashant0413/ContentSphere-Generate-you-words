import { useState } from "react";

const BOT_ICON = (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// ─── Strength bar ───────────────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const getScore = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const score = password ? getScore(password) : 0;
  const color = score <= 1 ? "#E24B4A" : score === 2 ? "#EF9F27" : "#639922";
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: n <= score ? color : "#e5e5e5",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ─── Shared field ──────────────────────────────────────────────────────────
function Field({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={styles.input}
        onFocus={(e) => (e.target.style.borderColor = "#534AB7")}
        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
      />
    </div>
  );
}

// ─── Social button ─────────────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.socialBtn,
        background: hovered ? "#f3f4f6" : "white",
      }}
    >
      {icon}
      <span style={{ fontSize: 13 }}>{label}</span>
    </button>
  );
}

// ─── Login panel ──────────────────────────────────────────────────────────
function LoginPanel({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: wire up your auth logic here
    console.log("Login →", { email, password });
    alert(`Signing in as ${email}`);
  };

  return (
    <div style={styles.panel}>
      <Logo title="Welcome back" subtitle="Sign in to your account" />
      <Field label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div style={{ marginBottom: "1rem" }}>
        <label style={styles.label}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          onFocus={(e) => (e.target.style.borderColor = "#534AB7")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        />
        <div style={{ textAlign: "right", marginTop: 4 }}>
          <span style={styles.link}>Forgot password?</span>
        </div>
      </div>
      <button onClick={handleLogin} style={styles.btn}>Sign in</button>
      <Divider />
      <div style={{ display: "flex", gap: 10 }}>
        <SocialBtn icon={<GoogleIcon />} label="Google" />
        <SocialBtn icon={<GitHubIcon />} label="GitHub" />
      </div>
      <p style={styles.footerText}>
        No account?{" "}
        <span style={styles.link} onClick={onSwitch}>Create one</span>
      </p>
    </div>
  );
}

// ─── Register panel ────────────────────────────────────────────────────────
function RegisterPanel({ onSwitch }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // TODO: wire up your registration logic here
    console.log("Register →", { firstName, lastName, email, password });
    alert(`Account created for ${firstName} ${lastName}!`);
  };

  return (
    <div style={styles.panel}>
      <Logo title="Get started" subtitle="Create your chatbot account today" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={styles.label}>First name</label>
          <input type="text" placeholder="Arjun" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#534AB7")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")} />
        </div>
        <div>
          <label style={styles.label}>Last name</label>
          <input type="text" placeholder="Sharma" value={lastName} onChange={(e) => setLastName(e.target.value)} style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#534AB7")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")} />
        </div>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <Field label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={styles.label}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          onFocus={(e) => (e.target.style.borderColor = "#534AB7")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        />
        <PasswordStrength password={password} />
      </div>
      <button onClick={handleRegister} style={styles.btn}>Create account</button>
      <p style={{ fontSize: 12, color: "#6b7280", marginTop: "0.75rem", lineHeight: 1.5 }}>
        By creating an account, you agree to our{" "}
        <span style={styles.link}>Terms of Service</span> and{" "}
        <span style={styles.link}>Privacy Policy</span>.
      </p>
      <p style={styles.footerText}>
        Already have an account?{" "}
        <span style={styles.link} onClick={onSwitch}>Sign in</span>
      </p>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
function Logo({ title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
      <div style={styles.logoIcon}>{BOT_ICON}</div>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "1.25rem 0", color: "#9ca3af", fontSize: 12 }}>
      <div style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }} />
      or continue with
      <div style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }} />
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────
export default function AuthPages() {
  const [tab, setTab] = useState("login"); // "login" | "register"

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...styles.tab,
                ...(tab === t ? styles.tabActive : {}),
              }}
            >
              {t === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {/* Panel */}
        {tab === "login"
          ? <LoginPanel onSwitch={() => setTab("register")} />
          : <RegisterPanel onSwitch={() => setTab("login")} />}
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9fafb",
    padding: "2rem 1rem",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #f3f4f6",
  },
  tab: {
    flex: 1,
    padding: "1rem",
    fontSize: 14,
    fontWeight: 400,
    color: "#6b7280",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.02em",
    transition: "color 0.2s, background 0.2s",
  },
  tabActive: {
    color: "#111827",
    fontWeight: 500,
    borderBottom: "2px solid #111827",
    background: "#f9fafb",
  },
  panel: {
    padding: "2rem 1.75rem",
  },
  logoIcon: {
    width: 44,
    height: 44,
    background: "#534AB7",
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "0.6rem",
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 20,
    fontWeight: 500,
    color: "#111827",
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 500,
    color: "#6b7280",
    marginBottom: 6,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "10px 13px",
    fontSize: 14,
    fontFamily: "inherit",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "white",
    color: "#111827",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "11px",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    letterSpacing: "0.02em",
    background: "#534AB7",
    color: "white",
    transition: "opacity 0.2s",
  },
  socialBtn: {
    flex: 1,
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "white",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    color: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    transition: "background 0.2s",
  },
  footerText: {
    textAlign: "center",
    marginTop: "1.25rem",
    fontSize: 13,
    color: "#6b7280",
  },
  link: {
    color: "#534AB7",
    cursor: "pointer",
    fontWeight: 500,
  },
};