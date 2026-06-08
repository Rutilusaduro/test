// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

interface GameState {
  location: string;
  description: string;
  inventory: string[];
  health: number;
  log: string[];
}

const initialState: GameState = {
  location: "Forest Clearing",
  description: "You stand in a peaceful forest clearing. Tall trees surround you. A small path leads north, and there's a cave to the south.",
  inventory: ["Rusty Sword"],
  health: 100,
  log: ["Welcome to the game! Type commands or click choices below."],
};

const locations: Record<string, any> = {
  "Forest Clearing": {
    description: "You stand in a peaceful forest clearing. Tall trees surround you. A small path leads north, and there's a cave to the south.",
    exits: { north: "Forest Path", south: "Dark Cave" },
  },
  "Forest Path": {
    description: "The path winds deeper into the forest. You hear birds chirping.",
    exits: { south: "Forest Clearing" },
  },
  "Dark Cave": {
    description: "A dark, damp cave. You can barely see anything.",
    exits: { north: "Forest Clearing" },
  },
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [command, setCommand] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addToLog = (message: string) => {
    setGameState(prev => ({
      ...prev,
      log: [...prev.log, message]
    }));
  };

  const moveTo = (newLocation: string) => {
    if (locations[newLocation]) {
      setGameState(prev => ({
        ...prev,
        location: newLocation,
        description: locations[newLocation].description,
      }));
      addToLog(`You travel to the ${newLocation}.`);
    } else {
      addToLog("You can't go that way.");
    }
  };

  const handleCommand = () => {
    if (!command.trim()) return;

    const cmd = command.toLowerCase().trim();
    addToLog(`> ${command}`);

    if (cmd === "look" || cmd === "l") {
      addToLog(gameState.description);
    } 
    else if (cmd.startsWith("go ") || cmd.startsWith("move ")) {
      const direction = cmd.split(" ")[1];
      const currentLoc = locations[gameState.location];
      if (currentLoc.exits[direction]) {
        moveTo(currentLoc.exits[direction]);
      } else {
        addToLog("You can't go that way.");
      }
    } 
    else if (cmd === "inventory" || cmd === "i") {
      addToLog(`Inventory: ${gameState.inventory.join(", ") || "nothing"}`);
    } 
    else if (cmd === "status") {
      addToLog(`Health: ${gameState.health}`);
    } 
    else {
      addToLog("Unknown command. Try: look, go north, inventory, status...");
    }

    setCommand("");
  };

  // Update available choices when location changes
  useEffect(() => {
    const currentLoc = locations[gameState.location];
    if (currentLoc?.exits) {
      setChoices(Object.keys(currentLoc.exits).map(dir => `Go ${dir}`));
    } else {
      setChoices([]);
    }
  }, [gameState.location]);

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameState.log]);

  return (
    <div className="game-container">
      <header>
        <h1>Text Adventure</h1>
        <div className="status-bar">
          <span>Location: <strong>{gameState.location}</strong></span>
          <span>❤️ Health: {gameState.health}</span>
        </div>
      </header>

      <div className="game-screen">
        {/* Story Output */}
        <div className="output">
          <div className="description">
            {gameState.description}
          </div>
          
          <div className="log">
            {gameState.log.map((entry, index) => (
              <div key={index} className="log-entry">{entry}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Choices */}
        {choices.length > 0 && (
          <div className="choices">
            <h3>What do you do?</h3>
            <div className="choice-buttons">
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const dir = choice.split(" ")[1];
                    moveTo(locations[gameState.location].exits[dir]);
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Command Input */}
        <div className="command-input">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand();
              }
            }}
            placeholder="Type command here... (look, go north, inventory...)"
          />
          <button onClick={handleCommand}>Send</button>
        </div>
      </div>

      <footer>
        <small>Simple React Text Game Template • Extend with more locations, items, combat, etc.</small>
      </footer>
    </div>
  );
}

export default App;
