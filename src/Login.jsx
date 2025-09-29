import { useState } from "react";
import { setAuth } from "./auth.js";

const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_OAUTH_CLIENT_SECRET;

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const body = new URLSearchParams({
        grant_type: "password",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username: email,
        password,
        scope: ""
      });

      const res = await fetch("/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body
      });

      const text = await res.text();
      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      const data = isJson ? JSON.parse(text) : { _raw: text };

      if (!res.ok) {
        throw new Error(data.error_description || data.message || "Credenciales inválidas");
      }

      const token = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        obtained_at: Date.now()
      };
      setAuth(token);
      onAuth?.(token);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      {err && <p role="alert">{err}</p>}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <br />
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </button>
    </form>
  );
}
