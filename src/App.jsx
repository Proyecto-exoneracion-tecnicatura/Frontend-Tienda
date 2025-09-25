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
        const r = await apiFetch(`/api/user`);
        if (!r.ok) throw new Error("No autorizado");
        const u = await r.json();
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