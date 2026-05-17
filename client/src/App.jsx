import React from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import WireframePreview from "./components/WireframePreview";
import JsonViewer from "./components/JsonViewer";
import { useLayoutAgent } from "./hooks/useLayoutAgent";

export default function App() {
  const { layout, messages, loading, dispatchCommand } = useLayoutAgent();

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      backgroundColor: "#020617",
      color: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0,
      left: 0,
      overflow: "hidden",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Top Banner Navigation Bar */}
      <header style={{
        height: "64px",
        borderBottom: "1px solid #1e293b",
        backgroundColor: "#0f172a",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        flexShrink: 0
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            AI Layout Agent
          </h1>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#94a3b8" }}>
            Generative layout agent powered by Groq Llama-3
          </p>
        </div>
      </header>

      {/* Main Structural Dashboard Area */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        width: "100%"
      }}>
        {/* Left Hand Sidebar Panel */}
        <div style={{
          width: "380px",
          minWidth: "380px",
          flexShrink: 0,
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          height: "100%"
        }}>
          <ChatWindow messages={messages} loading={loading} />
          <ChatInput onSend={dispatchCommand} disabled={loading} />
        </div>

        {/* Right Hand Interactive Workspace Display */}
        <div style={{
          flex: 1,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          backgroundColor: "#020617",
          overflowY: "auto",
          height: "100%"
        }}>
          <WireframePreview layout={layout} />
          <JsonViewer data={layout} />
        </div>
      </main>
    </div>
  );
}