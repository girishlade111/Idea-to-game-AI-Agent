
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useGameStore } from '@/store/gameStore';
import {
  ArrowLeft, Code, Maximize2, Minimize2, RefreshCw, Send, X, PlusCircle
} from 'lucide-react';

const GameWorkspace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const gameStore = useGameStore();
  const [message, setMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Redirect to create-game if no game code exists
  useEffect(() => {
    if (!gameStore.currentGameCode) {
      navigate('/create-game');
    }
  }, [gameStore.currentGameCode, navigate]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameStore.chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    gameStore.modifyCurrentGame(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
    toast({ title: "Game refreshed!" });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleShowCode = () => {
    setShowCode(!showCode);
  };

  const handleNewGame = () => {
    gameStore.resetGame();
    navigate('/create-game');
  };

  if (!gameStore.currentGameCode) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-arcade-dark">
      {/* Header Bar */}
      <header className="bg-black border-b border-gray-800 p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/create-game')}
            className="text-gray-300 hover:text-white flex items-center mr-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Back</span>
          </button>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-arcade-purple rounded-sm flex items-center justify-center mr-2">
              <span className="text-xs">🎮</span>
            </div>
            <h1 className="text-white font-semibold">Game Workspace</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNewGame}
            className="flex items-center px-3 py-1.5 text-gray-300 hover:text-white bg-gray-800 rounded-md transition-colors"
          >
            <PlusCircle size={18} className="mr-1.5" />
            <span>New Game</span>
          </button>
          <button
            onClick={toggleShowCode}
            className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
              showCode
                ? 'text-white bg-arcade-purple'
                : 'text-gray-300 hover:text-white bg-gray-800'
            }`}
          >
            <Code size={18} className="mr-1.5" />
            <span>{showCode ? 'Hide Code' : 'Show Code'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Chat */}
        {!isFullscreen && (
          <div className="w-1/3 min-w-[300px] flex flex-col bg-gray-900 border-r border-gray-800">
            {/* Game prompt display */}
            <div className="bg-arcade-purple/10 border-b border-gray-800 px-4 py-3">
              <p className="text-sm text-gray-400">Game Prompt:</p>
              <p className="text-white text-sm truncate">{gameStore.gamePrompt}</p>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {gameStore.chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-arcade-purple text-white'
                        : 'bg-black/40 text-gray-300 border border-gray-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Modify your game... (e.g., make it faster)"
                  className="w-full bg-black/40 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-arcade-purple"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-arcade-purple p-1.5 rounded-md text-white hover:bg-opacity-80 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel - Game Preview / Code View */}
        <div className="flex-1 relative flex flex-col">
          {/* Preview Controls */}
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button
              onClick={toggleFullscreen}
              className="bg-black/60 p-2 rounded-md text-white hover:bg-black/80 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={handleRefresh}
              className="bg-black/60 p-2 rounded-md text-white hover:bg-black/80 transition-colors"
              title="Refresh game"
            >
              <RefreshCw size={16} />
            </button>
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="bg-black/60 p-2 rounded-md text-white hover:bg-black/80 transition-colors"
                title="Exit fullscreen"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Code View Panel */}
          {showCode ? (
            <div className="flex-1 overflow-auto bg-[#0d1117] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-mono">Generated Game Code</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(gameStore.currentGameCode);
                    toast({ title: "Code copied to clipboard!" });
                  }}
                  className="text-xs text-gray-400 hover:text-white bg-gray-800 px-3 py-1 rounded transition-colors"
                >
                  Copy Code
                </button>
              </div>
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words leading-relaxed">
                <code>{gameStore.currentGameCode}</code>
              </pre>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              srcDoc={gameStore.currentGameCode}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
              title="Game Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameWorkspace;
