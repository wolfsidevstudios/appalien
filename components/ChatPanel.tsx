import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { DeployIcon } from './icons/DeployIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { LogoIcon } from './icons/LogoIcon';
import { SendIcon } from './icons/SendIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string, imageUrl: string | null) => void;
  isLoading: boolean;
  onDeployWeb: () => void;
  onDeployAppStore: () => void;
  imageContextUrl: string | null;
  onClearImageContext: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading, onDeployWeb, onDeployAppStore, imageContextUrl, onClearImageContext }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(input, imageContextUrl);
    setInput('');
  };

  return (
    <aside className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4 h-full flex flex-col bg-gray-900 border-r border-gray-800">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <h1 className="text-xl font-bold text-white">Vibe Coding AI</h1>
        </div>
        <div className="relative group">
          <button className="p-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-semibold border border-gray-700">
            <DeployIcon />
            <span>Publish</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto border border-gray-700">
            <a href="#" onClick={(e) => { e.preventDefault(); onDeployWeb(); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-md m-1">Publish to Web</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onDeployAppStore(); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-md m-1">Deploy to App Store</a>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md px-4 py-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl bg-gray-800 flex items-center">
              <SpinnerIcon />
              <span className="text-sm ml-2">Generating...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 flex-shrink-0 bg-gray-900">
        {imageContextUrl && (
          <div className="relative mb-2 group w-fit">
            <img src={imageContextUrl} alt="Visual Context" className="h-24 w-auto rounded-lg object-cover border border-gray-700" />
            <button 
              type="button" 
              onClick={onClearImageContext}
              className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full p-1 hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Remove image context"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            placeholder={imageContextUrl ? "Describe what to build based on the image..." : "Describe your app..."}
            className="w-full bg-gray-800 text-gray-200 p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none border border-gray-700 transition-all"
            rows={2}
            disabled={isLoading}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors" disabled={isLoading || !input.trim()}>
            <SendIcon />
          </button>
        </div>
      </form>
    </aside>
  );
};