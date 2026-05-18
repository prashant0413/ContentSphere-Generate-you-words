import { useState } from "react";
import AuthPages from "./AuthPages";
import ChatInterface from "./ChatInterface";

export default function App() {
  const [authed, setAuthed] = useState(true);
  return authed ? <ChatInterface /> : <AuthPages onLogin={() => setAuthed(true)} />;
}