import React, { useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';

const gridSize = 15;
const initialSnake = [{ x: 5, y: 5 }];
const initialFood = { x: 10, y: 10 };
const initialSpeed = 150;

// Audio objects
const foodSound = new Audio('/snak_game/food_collect.mp3');
const gameOverSound = new Audio('/snak_game/game_over.mp3');
const moveSound = new Audio('/snak_game/move_sound.mp3');
const startSound = new Audio('/snak_game/game_start.mp3');
const pauseSound = new Audio('/snak_game/pause_sound.mp3');

const SnakeGame = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const [gamePaused, setGamePaused] = useState(false);

  // Generate new food position
  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  // Reset game
  const resetGame = useCallback(() => {
    setSnake(initialSnake);
    setFood(generateFood());
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setGamePaused(false);
  }, [generateFood]);

  // Check collisions
  const checkCollision = useCallback((head) => {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, [snake]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || gamePaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Move head
        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'RIGHT') head.x += 1;

        // Play move sound
        moveSound.currentTime = 0;
        moveSound.play();

        // Check collisions
        if (checkCollision(head)) {
          gameOverSound.play().catch(e => console.log("Audio play error:", e));
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        newSnake.unshift(head);

        // Check food
        if (head.x === food.x && head.y === food.y) {
          foodSound.currentTime = 0;
          foodSound.play().catch(e => console.log("Audio play error:", e));
          setFood(generateFood());
          setScore(prev => prev + 10);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, initialSpeed);
    return () => clearInterval(gameInterval);
  }, [isPlaying, direction, food, generateFood, gameOver, checkCollision, gamePaused, score, highScore]);

  // Keyboard controls
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      // Prevent default for arrow keys to stop page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          pauseSound.currentTime = 0;
          pauseSound.play().catch(e => console.log("Audio play error:", e));
          setGamePaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, direction]);

  // Start game
  const startGame = () => {
    startSound.play().catch(e => console.log("Audio play error:", e));
    resetGame();
    setIsPlaying(true);
    setShowPlayButton(false);
  };

  return (
    <div className="snake-game-container">
      {showPlayButton ? (
        <div className="snake-start-screen">
          <h2 className="snake-title">Snake Game</h2>
          <button className="snake-play-button" onClick={startGame}>
            Play Snake Game
          </button>
          <div className="snake-high-score">High Score: {highScore}</div>
        </div>
      ) : (
        <div className="snake-game-inner">
          <div className="snake-header">
            <div className="snake-score">Score: {score}</div>
            <div className="snake-high-score">High Score: {highScore}</div>
          </div>
          
          <div className="snake-grid-container">
            <div className="snake-grid">
              {[...Array(gridSize)].map((_, row) => (
                <div key={row} className="snake-row">
                  {[...Array(gridSize)].map((_, col) => {
                    const isSnake = snake.some(s => s.x === col && s.y === row);
                    const isHead = snake[0].x === col && snake[0].y === row;
                    const isFood = food.x === col && food.y === row;
                    
                    return (
                      <div
                        key={col}
                        className={`snake-cell ${
                          isSnake ? 'snake-body' : ''
                        } ${
                          isHead ? 'snake-head' : ''
                        } ${
                          isFood ? 'snake-food' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
              
              {gamePaused && (
                <div className="snake-paused-overlay">
                  <div className="snake-paused-text">PAUSED</div>
                </div>
              )}
              
              {gameOver && (
                <div className="snake-game-over">
                  <div className="snake-game-over-text">Game Over!</div>
                  <div className="snake-final-score">Your score: {score}</div>
                  <button 
                    className="snake-restart-button"
                    onClick={() => {
                      startSound.play().catch(e => console.log("Audio play error:", e));
                      resetGame();
                      setIsPlaying(true);
                    }}
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="snake-controls">
            <div className="snake-instructions">
              <p>Use arrow keys to control the snake</p>
              <p>Press SPACE to pause</p>
            </div>
            {isPlaying && !gameOver && (
              <button 
                className="snake-pause-button"
                onClick={() => {
                  pauseSound.currentTime = 0;
                  pauseSound.play().catch(e => console.log("Audio play error:", e));
                  setGamePaused(prev => !prev);
                }}
              >
                {gamePaused ? 'Resume' : 'Pause'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;