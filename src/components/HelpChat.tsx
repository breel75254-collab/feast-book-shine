import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const KEY = "tangaza-help-chat";

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "help",
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setMessages(JSON.parse(saved) as UIMessage[]);
    } catch {
      /* ignore */
    }
  }, [setMessages]);

  useEffect(() => {
    if (status === "ready" && messages.length) localStorage.setItem(KEY, JSON.stringify(messages));
    endRef.current?.scrollIntoView({ block: "end" });
    if (open && !busy) inputRef.current?.focus();
  }, [messages, status, open, busy]);

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <p className="font-semibold">Tangaza Help · Msaada</p>
            <button
              onClick={() => {
                setMessages([]);
                localStorage.removeItem(KEY);
              }}
              className="text-xs underline"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <p className="text-muted-foreground">
                Hi! Ask me about posting ads, prices, M-Pesa payments or safety. Habari! Uliza swali lolote.
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground"
                      : "prose prose-sm max-w-none text-foreground"
                  }
                >
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      m.role === "user" ? <span key={i}>{p.text}</span> : <ReactMarkdown key={i}>{p.text}</ReactMarkdown>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
            {status === "submitted" && <p className="text-muted-foreground">Typing…</p>}
            {error && <p className="text-destructive">Sorry, something went wrong. Please try again.</p>}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim() || busy) return;
              sendMessage({ text: input.trim() });
              setInput("");
            }}
            className="flex gap-2 border-t border-border p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Help chat message"
              className="flex-1 rounded-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open help chat"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        {open ? "Close" : "💬 Help"}
      </button>
    </>
  );
}
