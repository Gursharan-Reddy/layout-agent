import React, { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "16px", borderTop: "1px solid #1e293b", backgroundColor: "#0f172a" }}>
      <div style={{ display: "flex", gap: "8px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "6px 10px" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? "Processing layout adjustments..." : "Type instruction (e.g., 'Convert to 9:16')"}
          style={{ flex: 1, border: "none", outline: "none", color: "#fff", fontSize: "13px", backgroundColor: "transparent" }}
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          style={{ 
            padding: "6px 14px", 
            backgroundColor: !value.trim() || disabled ? "#1e293b" : "#4f46e5", 
            border: "none", 
            color: "#fff", 
            fontSize: "12px", 
            fontWeight: "600",
            borderRadius: "6px", 
            cursor: !value.trim() || disabled ? "not-allowed" : "pointer" 
          }}
        >
          Send
        </button>
      </div>
    </form>
  );
}