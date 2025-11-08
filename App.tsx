import React, { useState, useCallback, useEffect } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { CodeEditor } from './components/CodeEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { SearchPanel } from './components/SearchPanel';
import { DeploymentModal } from './components/DeploymentModal';
import { generateCode } from './services/geminiService';
import type { Message } from './types';
import { DeploymentType } from './types';
import { SearchIcon } from './components/icons/SearchIcon';

const INITIAL_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vibe Code Generated App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        @keyframes background-pan {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animated-gradient {
            background: linear-gradient(90deg, #1e1b4b, #312e81, #4f46e5, #312e81, #1e1b4b);
            background-size: 400% 400%;
            animation: background-pan 15s ease infinite;
        }
    </style>
</head>
<body class="bg-[#0a0a0a] text-white flex items-center justify-center h-screen font-sans">
    <div class="text-center p-8 space-y-6">
        <div class="relative w-24 h-24 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-xl"></div>
            <div class="relative w-24 h-24 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                <svg class="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </div>
        </div>
        <h1 class="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Build Your Vision
        </h1>
        <p class="text-lg text-gray-400 max-w-xl mx-auto">
            Describe the application you want to create in the chat. Let's turn your ideas into reality, one line of code at a time.
        </p>
        <div class="pt-4">
            <button class="animated-gradient text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-500/30 transition-transform transform hover:scale-105">
                Start by typing "a todo app"
            </button>
        </div>
    </div>
</body>
</html>`;

type ActiveView = 'preview' | 'code' | 'search';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello! What should we build today? You can also use the Search tab to find visual inspiration.' },
  ]);
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeDeployment, setActiveDeployment] = useState<DeploymentType>(DeploymentType.NONE);
  const [activeView, setActiveView] = useState<ActiveView>('preview');
  const [imageContextUrl, setImageContextUrl] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (prompt: string, imageUrl: string | null) => {
    if (!prompt.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setActiveView('preview');
    setImageContextUrl(null);

    try {
      const generatedCode = await generateCode(prompt, code, imageUrl);
      setCode(generatedCode);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'I\'ve updated the code based on your request. Check out the preview!' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [code]);
  
  const handleSelectImage = (url: string) => {
    setImageContextUrl(url);
    const contextMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Visual context added! Describe the changes you want based on this image.' };
    setMessages(prev => [...prev, contextMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 font-sans">
      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onDeployWeb={() => setActiveDeployment(DeploymentType.WEB)}
        onDeployAppStore={() => setActiveDeployment(DeploymentType.APP_STORE)}
        imageContextUrl={imageContextUrl}
        onClearImageContext={() => setImageContextUrl(null)}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 p-4 border-b border-gray-800">
            <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg w-min">
                <button 
                    onClick={() => setActiveView('preview')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${activeView === 'preview' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                    Preview
                </button>
                <button 
                    onClick={() => setActiveView('code')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${activeView === 'code' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                    Code
                </button>
                <button 
                    onClick={() => setActiveView('search')}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${activeView === 'search' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                    <SearchIcon />
                    Search
                </button>
            </div>
        </div>
        <div className="flex-1 overflow-auto">
            {activeView === 'preview' && <PreviewPanel code={code} />}
            {activeView === 'code' && <CodeEditor code={code} />}
            {activeView === 'search' && <SearchPanel onSelectImage={handleSelectImage} />}
        </div>
      </main>
      {activeDeployment !== DeploymentType.NONE && (
        <DeploymentModal
          type={activeDeployment}
          onClose={() => setActiveDeployment(DeploymentType.NONE)}
        />
      )}
    </div>
  );
}