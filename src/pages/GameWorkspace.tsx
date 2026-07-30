import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useGameStore } from '@/store/gameStore';
import { exportGameAsHTML } from '@/engine/exportGame';
import { generateResponse } from '@/engine/chatResponses';
import { gameTemplates } from '@/engine';
import {
  ArrowLeft, Code, Maximize2, Minimize2, RefreshCw, Send, X, PlusCircle,
  Download, Layers, Loader2
} from 'lucide-react';

const GameWorkspace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const gameStore = useGameStore();
  const [message, setMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
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

    const userMessage = message.trim();
    setMessage('');
    setIsModifying(true);

    // Simulate a brief processing delay for visual feedback
    setTimeout(() => {
      gameStore.modifyCurrentGame(userMessage);

      // Generate a contextual response to replace the generic one
      const genre = gameStore.gameConfig?.genre;
      const response = generateResponse(userMessage, true, genre);
      gameStore.updateLastAssistantMessage(response);
      setIsModifying(false);
    }, 600);
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

  const handleShareGame = () => {
    const title = gameStore.gameConfig?.title || gameStore.gamePrompt || 'my-game';
    exportGameAsHTML(gameStore.currentGameCode, title);
    toast({ title: "Game downloaded!", description: "Your game has been saved as an HTML file." });
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = gameTemplates.find(t => t.id === templateId);
    if (template) {
      gameStore.generateNewGame(
        `Create a ${template.name} game`,
        template.genre
      );
      setShowTemplatePanel(false);
      toast({ title: `Switched to ${template.name} template!` });
    }
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
            onClick={() => setShowTemplatePanel(!showTemplatePanel)}
            className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
              showTemplatePanel
                ? 'text-white bg-arcade-purple'
                : 'text-gray-300 hover:text-white bg-gray-800'
            }`}
          >
            <Layers size={18} className="mr-1.5" />
            <span>Templates</span>
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
          <button
            onClick={handleShareGame}
            className="flex items-center px-3 py-1.5 text-gray-300 hover:text-white bg-gray-800 rounded-md transition-colors"
          >
            <Download size={18} className="mr-1.5" />
            <span>Download</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
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
                    className={`max-w-[85%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-arcade-purple text-white'
                        : 'bg-black/40 text-gray-300 border border-gray-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isModifying && (
                <div className="flex justify-start">
                  <div className="bg-black/40 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 text-sm flex items-center space-x-2">
                    <Loader2 size={14} className="animate-spin text-arcade-purple" />
                    <span>Applying changes...</span>
                  </div>
                </div>
              )}
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
                  disabled={isModifying}
                  className="w-full bg-black/40 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-arcade-purple disabled:opacity-60"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isModifying}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-arcade-purple p-1.5 rounded-md text-white hover:bg-opacity-80 transition-colors disabled:opacity-60"
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

        {/* Template & Assets Side Panel */}
        {showTemplatePanel && (
          <div className="absolute top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 z-20 flex flex-col shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <h3 className="text-white font-semibold">Game Templates</h3>
              <button
                onClick={() => setShowTemplatePanel(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {gameTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className="w-full text-left p-4 rounded-lg border border-gray-700 hover:border-arcade-purple/60 hover:bg-arcade-terminal/40 transition-all group"
                >
                  <h4 className="text-white font-medium group-hover:text-arcade-purple transition-colors">
                    {template.name}
                  </h4>
                  <span className="text-xs text-arcade-purple/80">{template.genre}</span>
                  <p className="text-gray-400 text-xs mt-1">
                    Keywords: {template.keywords.slice(0, 4).join(', ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameWorkspace;
