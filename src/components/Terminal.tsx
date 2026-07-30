
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Terminal = () => {
  const [terminalText, setTerminalText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Terminal animation sequence
  useEffect(() => {
    const lines = [
      { text: "$ ", delay: 500 },
      { text: "create-game Make a space shooter with neon graphics", delay: 100, finalDelay: 800 },
      { text: "\n✨ Generating game assets...", delay: 50, finalDelay: 500 },
      { text: "\nCreating game logic...", delay: 50, finalDelay: 500 },
      { text: "\nOptimizing for web...", delay: 50, finalDelay: 700 },
      { text: "\n🎮 Game ready! Play now or customize further.", delay: 50, finalDelay: 0 }
    ];

    let currentText = '';
    let timeoutId: NodeJS.Timeout;
    let currentLineIndex = 0;
    let currentCharIndex = 0;

    const typeNextChar = () => {
      if (currentLineIndex >= lines.length) {
        setAnimationComplete(true);
        return;
      }

      const currentLine = lines[currentLineIndex];

      if (currentCharIndex < currentLine.text.length) {
        currentText += currentLine.text[currentCharIndex];
        setTerminalText(currentText);
        currentCharIndex++;

        timeoutId = setTimeout(typeNextChar, currentLine.delay);
      } else {
        currentLineIndex++;
        currentCharIndex = 0;
        timeoutId = setTimeout(typeNextChar, currentLine.finalDelay || 0);
      }

      // Ensure terminal scrolls to bottom as text is added
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    };

    timeoutId = setTimeout(typeNextChar, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Cursor blink effect
  useEffect(() => {
    if (animationComplete) {
      const blinkInterval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    }
  }, [animationComplete]);

  return (
    <div
      onClick={() => navigate('/create-game')}
      className="terminal max-w-2xl mx-auto my-6 opacity-0 animate-fade-in delay-200 cursor-pointer hover:ring-2 hover:ring-arcade-purple/50 hover:shadow-lg hover:shadow-arcade-purple/10 transition-all duration-300 rounded-lg"
      title="Click to start creating a game"
    >
      <div className="terminal-header">
        <div className="terminal-button close-button"></div>
        <div className="terminal-button minimize-button"></div>
        <div className="terminal-button maximize-button"></div>
        <div className="ml-auto text-xs text-gray-400">engine-arcade-terminal</div>
      </div>
      <div
        ref={terminalRef}
        className="terminal-content text-sm md:text-base text-green-400 font-mono mt-2 h-40 overflow-hidden"
      >
        {terminalText}
        <span className={`cursor ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
      </div>
    </div>
  );
};

export default Terminal;
