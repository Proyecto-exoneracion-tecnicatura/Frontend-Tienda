import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import { getAuth, clearAuth, apiFetch } from "./auth.js";

export default function App() {
  const [auth, setAuth] = useState(getAuth());
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      if (!auth) return;
      setErr("");
      try {
        const r = await apiFetch("/api/validate");
        const txt = await r.text();
        const isJson = (r.headers.get("content-type") || "").includes("application/json");
        if (!r.ok) {
          const data = isJson ? JSON.parse(txt) : {};
          throw new Error(data.message || "No autorizado");
        }
        const u = isJson ? JSON.parse(txt) : null;
        setMe(u);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [auth]);

  function logout() {
    clearAuth();
    setAuth(null);
    setMe(null);
  }

  if (!auth) return <Login onAuth={setAuth} />;

  return (
    <div>
      <h1>Estás logueado</h1>
      {me && <pre>{JSON.stringify(me, null, 2)}</pre>}
      {err && <p role="alert">{err}</p>}
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
