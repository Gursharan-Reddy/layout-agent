import { useState, useCallback } from "react";
import { sendAgentCommand } from "../utils/api";

// Initial default canvas fallback state (Square Instagram Post context)
const INITIAL_LAYOUT = {
  rootNodes: ["artboard_01"],
  nodes: {
    "artboard_01": {
      id: "artboard_01",
      type: "artboard",
      name: "Instagram Post Canvas",
      width: 1080,
      height: 1080,
      children: ["headline_01", "product_01", "badge_01"],
      data: { backgroundColor: "#1e1b4b" }
    },
    "headline_01": {
      id: "headline_01",
      type: "text",
      name: "headline",
      nx: 0.1,
      ny: 0.1,
      nw: 0.8,
      nh: 0.15,
      width: 864,
      height: 162,
      data: { content: "Luxury Comfort, Surprisingly Attainable" }
    },
    "product_01": {
      id: "product_01",
      type: "image",
      name: "Product.png",
      nx: 0.15,
      ny: 0.35,
      nw: 0.5,
      nh: 0.5,
      width: 540,
      height: 540,
      data: { content: "Premium Running Shoes" }
    },
    "badge_01": {
      id: "badge_01",
      type: "badge",
      name: "discount badge",
      nx: 0.7,
      ny: 0.35,
      nw: 0.2,
      nh: 0.15,
      width: 216,
      height: 162,
      data: { content: "20% OFF" }
    }
  }
};

export function useLayoutAgent() {
  const [layout, setLayout] = useState(INITIAL_LAYOUT);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "System initialized. Hello! I am your layout design agent. Ask me to 'Convert layout to 9:16', 'Make the headline smaller', 'Center the product image', or 'Change the discount badge color to red'."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const dispatchCommand = useCallback(async (command) => {
    if (!command.trim()) return;

    // 1. Immediately append the user message to the chat layout thread
    const userMessage = { role: "user", content: command };
    const updatedHistory = [...messages, userMessage];
    
    setMessages(updatedHistory);
    setLoading(true);

    try {
      // 2. Execute the cross-origin network promise to the live Render backend
      const response = await sendAgentCommand({
        message: command,
        layout: layout,
        history: updatedHistory
      });

      if (response && response.success) {
        // 3. On success, update both the canvas geometry engine and the agent message bubble
        setLayout(response.updatedLayout);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.explanation || "Layout adjustments compiled successfully." }
        ]);
      } else {
        throw new Error(response.error || "Failed to compile semantic coordinates.");
      }
    } catch (error) {
      console.error("Layout Engine Network Exception:", error);
      
      // 4. Fallback handler to append clean error indicators directly in the UI log
      const errorMessage = error.response?.data?.error || error.message || "Network Timeout.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error processing request: ${errorMessage}` }
      ]);
    } finally {
      // 5. Release processing flags to open input fields back up
      setLoading(false);
    }
  }, [messages, layout]);

  return {
    layout,
    messages,
    loading,
    dispatchCommand
  };
}