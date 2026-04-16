"use client";

import { useState, useCallback } from 'react';
import api from '../lib/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simulate API call to the chatbot backend
      const response = await api.post('/chat/send', { message: content });
      
      const aiMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response.reply || "I'm a placeholder response from Synapse AI." 
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev, 
        { id: Date.now() + 1, role: 'system', content: 'Connection error. Please try again.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat
  };
};

export default useChat;
