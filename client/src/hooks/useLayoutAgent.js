import { useState } from 'react';
import initialLayout from '../data/initialLayout.json';
import { sendAgentCommand } from '../utils/api';

export function useLayoutAgent() {
  const [layout, setLayout] = useState(initialLayout);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "System initialized. Hello! I am your layout design agent. Ask me to 'Convert layout to 9:16', 'Make the headline smaller', 'Center the product image', or 'Change the discount badge color to red'." 
    }
  ]);
  const [loading, setLoading] = useState(false);

  const dispatchCommand = async (text) => {
    if (!text.trim()) return;

    const userPayloadMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userPayloadMessage]);
    setLoading(true);

    try {
      const response = await sendAgentCommand({
        message: text,
        layout,
        history: messages.slice(-8) // Maintain last 8 turns for context tracking
      });

      if (response.success) {
        setLayout(response.updatedLayout);
        setMessages((prev) => [
          ...prev, 
          { role: 'assistant', content: response.explanation }
        ]);
      } else {
        throw new Error(response.error || 'The agent failed to process mutations on this layout frame.');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `Error processing request: ${err.message || 'Check connection to backend server.'}` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { layout, messages, loading, dispatchCommand };
}