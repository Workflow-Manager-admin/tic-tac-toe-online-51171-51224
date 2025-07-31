import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Utilities for winner/draw detection.
 * Returns: either 'X', 'O', or null.
 */
function calculateWinner(squares) {
  // All winning lines for a 3x3 board
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

/**
 * Determines if all squares have been filled in with no winner.
 */
function isDraw(squares) {
  return squares.every((sq) => sq !== null);
}

/**
 * Square component - represents an individual cell on the board.
 */
function Square({ value, onClick, disabled, highlight }) {
  return (
    <button
      className={
        "square" +
        (value ? " " + value.toLowerCase() : "") +
        (highlight ? " winning" : "")
      }
      onClick={onClick}
      disabled={disabled}
      aria-label={`Board square: ${value ? value : "empty"}`}
    >
      {value}
    </button>
  );
}

/**
 * GameBoard component - renders the 3x3 board.
 */
function GameBoard({ squares, onSquareClick, winnerInfo }) {
  return (
    <div className="board-wrapper">
      <div className="game-board" role="grid" aria-label="Tic Tac Toe Board">
        {squares.map((sq, idx) => (
          <Square
            key={idx}
            value={sq}
            onClick={() => onSquareClick(idx)}
            disabled={!!winnerInfo || sq !== null}
            highlight={winnerInfo && winnerInfo.line.includes(idx)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * ScorePanel component - displays X wins, O wins, draws.
 */
function ScorePanel({ scores }) {
  return (
    <div className="score-panel">
      <div className="score-item">
        <span className="score-label">X Wins</span>
        <span className="score-value">{scores.X}</span>
      </div>
      <div className="score-item">
        <span className="score-label">O Wins</span>
        <span className="score-value">{scores.O}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Draws</span>
        <span className="score-value">{scores.draws}</span>
      </div>
    </div>
  );
}

/**
 * StatusPanel component - shows current turn, info, winner, etc.
 */
function StatusPanel({ status, draw, winner }) {
  return (
    <div className="status-panel">
      {winner ? (
        <span className="status-message">{winner} wins!</span>
      ) : draw ? (
        <span className="status-message status-draw">It's a Draw!</span>
      ) : (
        <span className="status-message">Turn: {status}</span>
      )}
    </div>
  );
}

/**
 * Restart button.
 */
function RestartButton({ onClick }) {
  return (
    <button className="restart-btn" onClick={onClick}>
      Restart Game
    </button>
  );
}

// PUBLIC_INTERFACE
/**
 * Main App component for the Tic Tac Toe game.
 * Handles state, logic, and layout.
 */
function App() {
  // Theme: only light for now, but keep mechanism for future extensions.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // State for board: 9 squares (array of 'X', 'O', or null)
  const [squares, setSquares] = useState(Array(9).fill(null));
  // Game state
  const [xIsNext, setXIsNext] = useState(true);
  // Score tracking
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });

  // Who won? Compute from board.
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const draw = !winner && isDraw(squares);

  // Handle move
  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    // Already filled or won?
    if (squares[idx] || winner) return;
    const next = squares.slice();
    next[idx] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // On win/draw, update scores
  useEffect(() => {
    if (winner) {
      setScores((sc) => ({
        ...sc,
        [winner]: sc[winner] + 1,
      }));
    } else if (draw) {
      setScores((sc) => ({
        ...sc,
        draws: sc.draws + 1,
      }));
    }
    // eslint-disable-next-line
  }, [winner, draw]);

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(winner ? winner === "O" : !xIsNext); // Next round: alternate who starts, unless draw, then alternate as well.
  }

  // For accessibility, keyboard handlers can be added if needed.

  return (
    <div className="App">
      <main className="tic-tac-toe-container">
        <h1 className="tic-tac-toe-title">Tic Tac Toe</h1>
        <div className="tic-tac-toe-subtitle">
          Classic 2-player game &mdash; modern web style
        </div>

        <ScorePanel scores={scores} />

        <GameBoard
          squares={squares}
          onSquareClick={handleSquareClick}
          winnerInfo={winnerInfo}
        />

        <StatusPanel
          status={xIsNext ? "X" : "O"}
          draw={draw}
          winner={winner}
        />

        {(winner || draw) && <RestartButton onClick={handleRestart} />}

      </main>
      <footer className="tic-tac-toe-footer">
        &copy; {new Date().getFullYear()} Modern Tic Tac Toe · React<br />
      </footer>
    </div>
  );
}

export default App;
