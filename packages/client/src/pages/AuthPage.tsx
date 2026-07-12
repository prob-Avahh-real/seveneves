import { useState } from "react";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login" ? { email, password } : { email, username, password };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("seveneves_token", data.token);
        setMsg("Success!");
      } else {
        setMsg(data.error ?? "Failed");
      }
    } catch {
      setMsg("Network error");
    }
  };

  return (
    <div style={formWrap}>
      <h2 style={{ marginBottom: 16 }}>{mode === "login" ? "Sign In" : "Create Account"}</h2>
      <input style={inputStyle} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {mode === "register" && (
        <input style={inputStyle} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      )}
      <input style={inputStyle} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button style={btnStyle} onClick={submit}>{mode === "login" ? "Sign In" : "Register"}</button>
      {msg && <p style={{ marginTop: 8, color: "#a78bfa" }}>{msg}</p>}
      <p style={{ marginTop: 12, fontSize: 13, color: "#888" }}>
        {mode === "login" ? "No account? " : "Have an account? "}
        <span style={{ color: "#a78bfa", cursor: "pointer" }} onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Register" : "Sign In"}
        </span>
      </p>
    </div>
  );
}

const formWrap: React.CSSProperties = { maxWidth: 360, margin: "60px auto", display: "flex", flexDirection: "column", gap: 12 };
const inputStyle: React.CSSProperties = { padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#e0e0e0", fontSize: 14 };
const btnStyle: React.CSSProperties = { padding: 10, borderRadius: 8, border: "none", background: "#a78bfa", color: "#0a0a1a", fontWeight: 600, cursor: "pointer", fontSize: 14 };
