import React, { useEffect, useRef } from "react";

export default function ChatWindow({ messages, loading }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "16px",
      overflowY: "auto",
      flex: 1,
      width: "100%"
    }}>
      {messages.map((msg, idx) => {
        const isAI = msg.role === "assistant";
        return (
          <div 
            key={idx} 
            style={{
              alignSelf: isAI ? "flex-start" : "flex-end",
              backgroundColor: isAI ? "#1e293b" : "#312e81",
              border: isAI ? "1px solid #334155" : "1px solid #4338ca",
              padding: "10px 14px",
              borderRadius: "12px",
              maxWidth: "85%",
              color: "#f8fafc",
              fontSize: "13px",
              lineHeight: "1.4",
              wordBreak: "break-word",
              whiteSpace: "normal"
            }}
          >
            <strong style={{ display: "block", fontSize: "11px", color: isAI ? "#38bdf8" : "#34d399", marginBottom: "4px" }}>
              {isAI ? "AGENT" : "YOU"}
            </strong>
            <span style={{ display: "inline" }}>{msg.content}</span>
          </div>
        );
      })}
      {loading && (
        <div style={{ color: "#94a3b8", fontSize: "12px", fontStyle: "italic", paddingLeft: "4px" }}>
          Agent is computing layout boundaries...
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}