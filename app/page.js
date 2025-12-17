'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import puzzles, { getRandomPuzzle } from './puzzles';

export default function Kerflufflegrid() {
  // Game states
  const [gameState, setGameState] = useState('select'); // select, playing, won, lost
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Modal states
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Keyboard state
  const [activeWord, setActiveWord] = useState(0);
  const [pressedKey, setPressedKey] = useState(null);
  const gameRef = useRef(null);
  
  // Music state
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioRef = useRef(null);
  
  // Stats from localStorage
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    bestTime1: null,
    bestTime2: null,
    bestTime3: null
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kerflufflegridStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
    
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Scramble word function
  const scrambleWord = useCallback((word) => {
    const letters = typeof word === 'string' ? word.split('') : [...word];
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  }, []);

  // Word states
  const [wordStates, setWordStates] = useState([]);
  const [hintsRevealed, setHintsRevealed] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState({ wordIdx: null, letterIdx: null });
  const [selectedSlot, setSelectedSlot] = useState({ wordIdx: null, slotIdx: null });
  const [wrongPlacements, setWrongPlacements] = useState({});
  const [celebratingWord, setCelebratingWord] = useState(null);

  const allComplete = wordStates.length > 0 && wordStates.every(w => w.completed);
  const wordsCompleted = wordStates.filter(w => w.completed).length;

  // Save stats to localStorage
  useEffect(() => {
    if (stats.gamesPlayed > 0) {
      localStorage.setItem('kerflufflegridStats', JSON.stringify(stats));
    }
  }, [stats]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            handleGameEnd(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Check for win
  useEffect(() => {
    if (allComplete && gameState === 'playing') {
      setTimerActive(false);
      handleGameEnd(true);
    }
  }, [allComplete, gameState]);

  // Focus game area for keyboard input
  useEffect(() => {
    if (gameState === 'playing' && gameRef.current) {
      gameRef.current.focus();
    }
  }, [gameState]);

  // Update active word when one is completed
  useEffect(() => {
    if (gameState === 'playing' && wordStates.length > 0) {
      if (wordStates[activeWord]?.completed) {
        const nextIncomplete = wordStates.findIndex((w, i) => i > activeWord && !w.completed);
        if (nextIncomplete !== -1) {
          setActiveWord(nextIncomplete);
        } else {
          const firstIncomplete = wordStates.findIndex(w => !w.completed);
          if (firstIncomplete !== -1) {
            setActiveWord(firstIncomplete);
          }
        }
      }
    }
  }, [wordStates, gameState]);

  // Keyboard handler
  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing' || showHowToPlay || showStats) return;
    
    const key = e.key.toUpperCase();
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveWord(prev => {
        let next = prev - 1;
        while (next >= 0 && wordStates[next]?.completed) next--;
        return next >= 0 ? next : prev;
      });
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveWord(prev => {
        let next = prev + 1;
        while (next < wordStates.length && wordStates[next]?.completed) next++;
        return next < wordStates.length ? next : prev;
      });
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      setActiveWord(prev => {
        let next = (prev + 1) % wordStates.length;
        let count = 0;
        while (wordStates[next]?.completed && count < wordStates.length) {
          next = (next + 1) % wordStates.length;
          count++;
        }
        return next;
      });
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      const state = wordStates[activeWord];
      if (!state || state.completed) return;
      
      let lastFilledIdx = -1;
      for (let i = state.placed.length - 1; i >= 0; i--) {
        if (state.placed[i]) {
          lastFilledIdx = i;
          break;
        }
      }
      
      if (lastFilledIdx >= 0) {
        handleSlotClick(activeWord, lastFilledIdx);
      }
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      e.preventDefault();
      setPressedKey(key);
      setTimeout(() => setPressedKey(null), 150);
      
      const state = wordStates[activeWord];
      if (!state || state.completed) return;
      
      const letterIdx = state.available.findIndex(l => l === key);
      if (letterIdx === -1) return;
      
      const emptySlotIdx = state.placed.findIndex(p => !p);
      if (emptySlotIdx === -1) return;
      
      const correctLetter = currentPuzzle.words[activeWord].word[emptySlotIdx];
      
      if (key !== correctLetter) {
        setWrongPlacements(prev => ({
          ...prev,
          [`${activeWord}-${emptySlotIdx}`]: true
        }));
        setTimeout(() => {
          setWrongPlacements(prev => {
            const newWrong = {...prev};
            delete newWrong[`${activeWord}-${emptySlotIdx}`];
            return newWrong;
          });
        }, 600);
      }

      setWordStates(prev => {
        const newStates = [...prev];
        const newPlaced = [...newStates[activeWord].placed];
        const newAvailable = [...newStates[activeWord].available];

        newPlaced[emptySlotIdx] = key;
        newAvailable.splice(letterIdx, 1);

        const isComplete = checkWordComplete(activeWord, newPlaced);

        newStates[activeWord] = {
          ...newStates[activeWord],
          placed: newPlaced,
          available: newAvailable,
          completed: isComplete
        };

        if (isComplete) {
          setCelebratingWord(activeWord);
          setTimeout(() => setCelebratingWord(null), 1000);
        }

        return newStates;
      });
    }
  }, [gameState, activeWord, wordStates, currentPuzzle, showHowToPlay, showStats]);

  // Attach keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle game end
  const handleGameEnd = (won) => {
    const timeUsed = (selectedTime * 60) - timeRemaining;
    
    // Stop the music
    stopMusic();
    
    setStats(prev => {
      const newStats = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
        currentStreak: won ? prev.currentStreak + 1 : 0,
        bestStreak: won ? Math.max(prev.bestStreak, prev.currentStreak + 1) : prev.bestStreak
      };
      
      if (won) {
        const timeKey = `bestTime${selectedTime}`;
        if (!prev[timeKey] || timeUsed < prev[timeKey]) {
          newStats[timeKey] = timeUsed;
        }
      }
      
      return newStats;
    });
    
    setGameState(won ? 'won' : 'lost');
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start game
  const startGame = (minutes) => {
    const puzzle = getRandomPuzzle();
    setCurrentPuzzle(puzzle);
    setSelectedTime(minutes);
    setTimeRemaining(minutes * 60);
    setWordStates(puzzle.words.map(w => ({
      placed: Array(w.word.length).fill(''),
      available: scrambleWord(w.word),
      completed: false
    })));
    setHintsRevealed(Array(5).fill(false));
    setSelectedLetter({ wordIdx: null, letterIdx: null });
    setSelectedSlot({ wordIdx: null, slotIdx: null });
    setWrongPlacements({});
    setActiveWord(0);
    setGameState('playing');
    setTimerActive(true);
    
    // Play music matching the timer
    playMusic(minutes);
  };

  // Play music based on timer selection
  const playMusic = (minutes) => {
    if (!musicEnabled) return;
    
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Create new audio with matching track
    audioRef.current = new Audio(`/kg-music${minutes}.mp3`);
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(e => {
      // Browser may block autoplay, that's ok
      console.log('Audio autoplay blocked:', e);
    });
  };

  // Stop music
  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Toggle music
  const toggleMusic = () => {
    setMusicEnabled(prev => {
      if (prev && audioRef.current) {
        // Turning off - stop music
        audioRef.current.pause();
      } else if (!prev && gameState === 'playing' && selectedTime) {
        // Turning on during game - start music
        playMusic(selectedTime);
      }
      return !prev;
    });
  };

  // Reset to start screen
  const resetGame = () => {
    stopMusic();
    setGameState('select');
    setCurrentPuzzle(null);
    setSelectedTime(null);
    setTimeRemaining(0);
    setTimerActive(false);
    setWordStates([]);
  };

  // Shuffle a word's available letters
  const shuffleWord = (wordIdx) => {
    if (wordStates[wordIdx].completed) return;
    setWordStates(prev => {
      const newStates = [...prev];
      newStates[wordIdx] = {
        ...newStates[wordIdx],
        available: scrambleWord(newStates[wordIdx].available)
      };
      return newStates;
    });
  };

  // Check if word is complete
  const checkWordComplete = (wordIdx, placed) => {
    const targetWord = currentPuzzle.words[wordIdx].word;
    const currentWord = placed.join('');
    return currentWord === targetWord;
  };

  // Handle clicking available letter
  const handleAvailableLetterClick = (wordIdx, letterIdx) => {
    if (wordStates[wordIdx].completed || gameState !== 'playing') return;
    setActiveWord(wordIdx);

    if (selectedSlot.wordIdx === wordIdx && selectedSlot.slotIdx !== null) {
      const letterToPlace = wordStates[wordIdx].available[letterIdx];
      const correctLetter = currentPuzzle.words[wordIdx].word[selectedSlot.slotIdx];

      if (letterToPlace !== correctLetter) {
        setWrongPlacements(prev => ({
          ...prev,
          [`${wordIdx}-${selectedSlot.slotIdx}`]: true
        }));
        setTimeout(() => {
          setWrongPlacements(prev => {
            const newWrong = {...prev};
            delete newWrong[`${wordIdx}-${selectedSlot.slotIdx}`];
            return newWrong;
          });
        }, 600);
      }

      setWordStates(prev => {
        const newStates = [...prev];
        const newPlaced = [...newStates[wordIdx].placed];
        const newAvailable = [...newStates[wordIdx].available];

        newPlaced[selectedSlot.slotIdx] = letterToPlace;
        newAvailable.splice(letterIdx, 1);

        const isComplete = checkWordComplete(wordIdx, newPlaced);

        newStates[wordIdx] = {
          ...newStates[wordIdx],
          placed: newPlaced,
          available: newAvailable,
          completed: isComplete
        };

        if (isComplete) {
          setCelebratingWord(wordIdx);
          setTimeout(() => setCelebratingWord(null), 1000);
        }

        return newStates;
      });

      setSelectedSlot({ wordIdx: null, slotIdx: null });
      setSelectedLetter({ wordIdx: null, letterIdx: null });
    } else {
      setSelectedLetter({ wordIdx, letterIdx, source: 'available' });
      setSelectedSlot({ wordIdx: null, slotIdx: null });
    }
  };

  // Handle clicking slot
  const handleSlotClick = (wordIdx, slotIdx) => {
    if (wordStates[wordIdx].completed || gameState !== 'playing') return;
    setActiveWord(wordIdx);

    const currentPlaced = wordStates[wordIdx].placed[slotIdx];

    if (currentPlaced) {
      setWordStates(prev => {
        const newStates = [...prev];
        const newPlaced = [...newStates[wordIdx].placed];
        const newAvailable = [...newStates[wordIdx].available, currentPlaced];
        newPlaced[slotIdx] = '';
        newStates[wordIdx] = {
          ...newStates[wordIdx],
          placed: newPlaced,
          available: newAvailable
        };
        return newStates;
      });
      setSelectedLetter({ wordIdx: null, letterIdx: null });
      setSelectedSlot({ wordIdx: null, slotIdx: null });
    } else if (selectedLetter.wordIdx === wordIdx && selectedLetter.source === 'available') {
      const letterToPlace = wordStates[wordIdx].available[selectedLetter.letterIdx];
      const correctLetter = currentPuzzle.words[wordIdx].word[slotIdx];

      if (letterToPlace !== correctLetter) {
        setWrongPlacements(prev => ({
          ...prev,
          [`${wordIdx}-${slotIdx}`]: true
        }));
        setTimeout(() => {
          setWrongPlacements(prev => {
            const newWrong = {...prev};
            delete newWrong[`${wordIdx}-${slotIdx}`];
            return newWrong;
          });
        }, 600);
      }

      setWordStates(prev => {
        const newStates = [...prev];
        const newPlaced = [...newStates[wordIdx].placed];
        const newAvailable = [...newStates[wordIdx].available];

        newPlaced[slotIdx] = letterToPlace;
        newAvailable.splice(selectedLetter.letterIdx, 1);

        const isComplete = checkWordComplete(wordIdx, newPlaced);

        newStates[wordIdx] = {
          ...newStates[wordIdx],
          placed: newPlaced,
          available: newAvailable,
          completed: isComplete
        };

        if (isComplete) {
          setCelebratingWord(wordIdx);
          setTimeout(() => setCelebratingWord(null), 1000);
        }

        return newStates;
      });

      setSelectedLetter({ wordIdx: null, letterIdx: null });
      setSelectedSlot({ wordIdx: null, slotIdx: null });
    } else {
      setSelectedSlot({ wordIdx, slotIdx });
      setSelectedLetter({ wordIdx: null, letterIdx: null });
    }
  };

  // Toggle hint
  const toggleHint = (idx) => {
    setHintsRevealed(prev => {
      const newHints = [...prev];
      newHints[idx] = !newHints[idx];
      return newHints;
    });
  };

  // Get timer color
  const getTimerColor = () => {
    if (!selectedTime) return '#10b981';
    const percentage = timeRemaining / (selectedTime * 60);
    if (percentage > 0.5) return '#10b981';
    if (percentage > 0.25) return '#f59e0b';
    return '#ef4444';
  };

  // Share results
  const shareResults = () => {
    const timeUsed = (selectedTime * 60) - timeRemaining;
    const won = gameState === 'won';
    const text = won 
      ? `⌛ Kerflufflegrid\n${currentPuzzle.emojis.slice(0, 4).join('')}\n✅ ${wordsCompleted}/5 in ${formatTime(timeUsed)}\n🔥 Streak: ${stats.currentStreak}\nPlay at kerflufflegrid.com`
      : `⌛ Kerflufflegrid\n${currentPuzzle.emojis.slice(0, 4).join('')}\n❌ ${wordsCompleted}/5 - KERFLUFFLEGRID!\nPlay at kerflufflegrid.com`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  // Floating shapes background
  const FloatingShapes = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full float-anim"
          style={{
            width: Math.random() * 80 + 40 + 'px',
            height: Math.random() * 80 + 40 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            background: `rgba(${Math.random() * 50 + 150}, ${Math.random() * 50 + 100}, ${Math.random() * 100 + 50}, 0.08)`,
            animationDelay: Math.random() * 5 + 's',
            animationDuration: Math.random() * 10 + 15 + 's'
          }}
        />
      ))}
    </div>
  );

  const currentYear = new Date().getFullYear();

  return (
    <div 
      className="min-h-screen relative overflow-hidden outline-none" 
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      }}
      ref={gameRef}
      tabIndex={0}
    >
      <FloatingShapes />

      <div className="max-w-lg mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
          >
            ❓ How to Play
          </button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold tracking-wide" 
                style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #f43f5e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
              Kerflufflegrid
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMusic}
              className="text-slate-400 hover:text-amber-400 transition-colors text-lg"
              title={musicEnabled ? 'Music On' : 'Music Off'}
            >
              {musicEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
            >
              📊 Stats
            </button>
          </div>
        </div>

        {/* Start Screen */}
        {gameState === 'select' && (
          <div className="text-center py-4">
            <h2 className="text-xl text-slate-200 mb-4">Choose your challenge</h2>
            <div className="flex justify-center gap-3 mb-4">
              {[1, 2, 3].map(mins => (
                <button
                  key={mins}
                  onClick={() => startGame(mins)}
                  className="px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.9) 0%, rgba(245, 158, 11, 0.9) 100%)',
                    color: '#0f172a',
                    boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)'
                  }}
                >
                  <span>⌛</span>
                  <span>{mins} min</span>
                </button>
              ))}
            </div>

            <p className="text-slate-300 mb-2">Solve 5 words to reveal the puzzle&apos;s theme<br/>before the Kerflufflegrid!</p>
            
            <p className="text-slate-500 text-xs mb-6">
              Unlimited plays • Beat your best time!
            </p>

            <div className="text-6xl mb-4">⌛</div>
            
            <div className="p-4 rounded-2xl mx-4" style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <p className="text-amber-400 text-sm font-medium mb-2">kerflufflegrid <span className="text-slate-500 italic">(noun)</span></p>
              <p className="text-slate-400 text-sm">1. A grid of letters in glorious disarray.</p>
              <p className="text-slate-400 text-sm">2. The sound your brain makes when time is running out.</p>
              <p className="text-slate-400 text-sm">3. What happens when you almost figure out the theme.</p>
            </div>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === 'playing' && currentPuzzle && (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">{wordsCompleted}/5 words</span>
                <div className="flex items-center gap-2 text-2xl font-mono font-bold" style={{ color: getTimerColor() }}>
                  ⌛ {formatTime(timeRemaining)}
                </div>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000 rounded-full"
                  style={{ 
                    width: `${(timeRemaining / (selectedTime * 60)) * 100}%`,
                    background: getTimerColor()
                  }}
                />
              </div>
            </div>

            <div className="text-center mb-3">
              <div className="inline-block px-6 py-2 rounded-full" style={{
                background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.3) 0%, rgba(71, 85, 105, 0.3) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.3)'
              }}>
                <span className="text-slate-400 text-sm tracking-widest">? ? ? ? ?</span>
              </div>
            </div>

            <div className="text-center mb-2">
              <p className="text-slate-500 text-xs">⌨️ Type letters • ↑↓ switch words • ⌫ undo</p>
            </div>

            <div className="space-y-3">
              {currentPuzzle.words.map((wordData, wordIdx) => {
                const state = wordStates[wordIdx];
                if (!state) return null;
                const isCelebrating = celebratingWord === wordIdx;
                const isActive = activeWord === wordIdx && !state.completed;

                return (
                  <div 
                    key={wordIdx} 
                    className="rounded-2xl p-3 transition-all duration-300 cursor-pointer"
                    onClick={() => !state.completed && setActiveWord(wordIdx)}
                    style={{
                      background: state.completed 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)'
                        : isActive
                          ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)',
                      border: state.completed 
                        ? '1px solid rgba(16, 185, 129, 0.5)' 
                        : isActive
                          ? '2px solid rgba(251, 191, 36, 0.5)'
                          : '1px solid rgba(100, 116, 139, 0.3)',
                      transform: isCelebrating ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-xs">{wordData.word.length} letters</span>
                      <div className="flex gap-2">
                        {!state.completed && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); shuffleWord(wordIdx); }}
                              className="text-xs px-2 py-1 rounded-full transition-all hover:scale-110"
                              style={{
                                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.2) 100%)',
                                color: '#fbbf24',
                                border: '1px solid rgba(251, 191, 36, 0.4)'
                              }}
                            >
                              🔀
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleHint(wordIdx); }}
                              className="text-xs px-2 py-1 rounded-full transition-all"
                              style={{
                                background: hintsRevealed[wordIdx] ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.15)',
                                color: '#fbbf24',
                                border: '1px solid rgba(251, 191, 36, 0.3)'
                              }}
                            >
                              {hintsRevealed[wordIdx] ? 'Hide' : 'Hint'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {hintsRevealed[wordIdx] && !state.completed && (
                      <div className="mb-2 p-2 rounded-xl" style={{
                        background: 'rgba(251, 191, 36, 0.1)',
                        border: '1px solid rgba(251, 191, 36, 0.2)'
                      }}>
                        <p className="text-amber-200 text-xs">{wordData.hint}</p>
                      </div>
                    )}

                    <div className="flex justify-center gap-1.5 mb-2">
                      {wordData.word.split('').map((_, slotIdx) => {
                        const placedLetter = state.placed[slotIdx];
                        const isSlotSelected = selectedSlot.wordIdx === wordIdx && selectedSlot.slotIdx === slotIdx;
                        const isWrong = wrongPlacements[`${wordIdx}-${slotIdx}`];

                        return (
                          <div
                            key={slotIdx}
                            onClick={(e) => { e.stopPropagation(); handleSlotClick(wordIdx, slotIdx); }}
                            className={`w-9 h-9 flex items-center justify-center text-base font-bold rounded-lg cursor-pointer transition-all duration-200 ${isWrong ? 'shake' : ''}`}
                            style={{
                              background: isWrong
                                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.8) 100%)'
                                : placedLetter 
                                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 1) 0%, rgba(245, 158, 11, 1) 100%)'
                                  : isSlotSelected
                                    ? 'rgba(251, 191, 36, 0.3)'
                                    : 'rgba(51, 65, 85, 0.5)',
                              border: isWrong
                                ? '2px solid rgba(239, 68, 68, 0.8)'
                                : placedLetter 
                                  ? '2px solid rgba(251, 191, 36, 0.6)' 
                                  : isSlotSelected
                                    ? '2px solid rgba(251, 191, 36, 0.8)'
                                    : '2px dashed rgba(100, 116, 139, 0.5)',
                              color: placedLetter ? '#0f172a' : 'transparent'
                            }}
                          >
                            {placedLetter}
                          </div>
                        );
                      })}
                    </div>

                    {!state.completed && (
                      <div className="flex justify-center gap-1.5 flex-wrap">
                        {state.available.map((letter, letterIdx) => {
                          const isSelected = selectedLetter.wordIdx === wordIdx && 
                                            selectedLetter.letterIdx === letterIdx &&
                                            selectedLetter.source === 'available';
                          const isKeyPressed = pressedKey === letter && isActive;

                          return (
                            <button
                              key={letterIdx}
                              onClick={(e) => { e.stopPropagation(); handleAvailableLetterClick(wordIdx, letterIdx); }}
                              className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-all duration-200 ${isKeyPressed ? 'key-press' : ''}`}
                              style={{
                                background: isSelected
                                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 1) 0%, rgba(245, 158, 11, 1) 100%)'
                                  : 'linear-gradient(135deg, rgba(251, 191, 36, 0.85) 0%, rgba(245, 158, 11, 0.85) 100%)',
                                border: isSelected ? '2px solid rgba(255, 255, 255, 0.8)' : '2px solid rgba(251, 191, 36, 0.4)',
                                color: '#0f172a',
                                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                boxShadow: isSelected ? '0 0 15px rgba(251, 191, 36, 0.6)' : '0 2px 6px rgba(0, 0, 0, 0.3)'
                              }}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {state.completed && (
                      <div className="text-center text-emerald-400 font-medium text-sm">✓ Got it!</div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Won Screen */}
        {gameState === 'won' && currentPuzzle && (
          <div className="text-center py-6">
            <div className="fixed inset-0 pointer-events-none z-50">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl confetti"
                  style={{
                    left: `${(i * 7) % 100}%`,
                    top: '-40px',
                    animationDelay: `${(i % 10) * 0.1}s`
                  }}
                >
                  {currentPuzzle.emojis[i % currentPuzzle.emojis.length]}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-2xl font-bold" style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Right on!!
              </h2>
              <p className="text-amber-300 text-lg">You beat the Kerflufflegrid!</p>
            </div>

            <div className="mb-4 p-5 rounded-2xl pulse-glow" style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.4)'
            }}>
              <p className="text-slate-400 text-sm mb-1">The theme was...</p>
              <h3 className="text-xl font-bold text-amber-400 mb-3">{currentPuzzle.category}</h3>
              <div className="flex justify-center gap-2 flex-wrap text-2xl">
                {currentPuzzle.emojis.map((emoji, i) => (
                  <span key={i} className="bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-slate-400 mb-4 text-sm">
              <p>Time: <span className="text-emerald-400 font-bold">{formatTime((selectedTime * 60) - timeRemaining)}</span></p>
              <p>Streak: <span className="text-amber-400 font-bold">🔥 {stats.currentStreak}</span></p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={shareResults}
                className="px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.2) 100%)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.4)'
                }}
              >
                🎉 Share
              </button>
              <button
                onClick={resetGame}
                className="px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.9) 0%, rgba(245, 158, 11, 0.9) 100%)',
                  color: '#0f172a'
                }}
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}

        {/* Lost Screen */}
        {gameState === 'lost' && currentPuzzle && (
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="text-5xl mb-3">😵</div>
              <h2 className="text-3xl font-bold tracking-wider"
                  style={{ 
                    background: 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                KERFLUFFLEGRID!
              </h2>
              <p className="text-slate-400 mt-1 text-sm">Time&apos;s up!</p>
            </div>

            <div className="mb-4 p-5 rounded-2xl" style={{
              background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.2) 0%, rgba(71, 85, 105, 0.2) 100%)',
              border: '1px solid rgba(148, 163, 184, 0.3)'
            }}>
              <p className="text-slate-400 text-sm mb-1">The theme was...</p>
              <h3 className="text-xl font-bold text-slate-300 mb-3">{currentPuzzle.category}</h3>
              <div className="flex justify-center gap-2 flex-wrap text-2xl opacity-50">
                {currentPuzzle.emojis.map((emoji, i) => (
                  <span key={i}>{emoji}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-400 text-xs mb-2">The words were:</p>
              <div className="space-y-1">
                {currentPuzzle.words.map((word, i) => (
                  <div key={i} className="flex items-center gap-2 justify-center text-sm">
                    <span className={wordStates[i]?.completed ? 'text-emerald-400' : 'text-slate-500'}>
                      {wordStates[i]?.completed ? '✓' : '✗'}
                    </span>
                    <span className={wordStates[i]?.completed ? 'text-slate-300' : 'text-slate-500'}>
                      {word.word}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={shareResults}
                className="px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.2) 100%)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.4)'
                }}
              >
                🎉 Share
              </button>
              <button
                onClick={resetGame}
                className="px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.9) 0%, rgba(245, 158, 11, 0.9) 100%)',
                  color: '#0f172a'
                }}
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex justify-center gap-4 text-xs text-slate-500 mb-2">
            <a href="/privacy" className="hover:text-slate-400">Privacy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-slate-400">Terms</a>
          </div>
          <p className="text-slate-600 text-xs">© {currentYear} Kerflufflegrid</p>
        </div>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(10, 10, 30, 0.9)' }}
          onClick={() => setShowHowToPlay(false)}
        >
          <div 
            className="max-w-sm w-full rounded-3xl p-6 relative max-h-[80vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(51, 65, 85, 0.98) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-amber-400 mb-4 text-center">How to Play</h2>
            
            <div className="space-y-4 text-slate-300 text-sm">
              <div>
                <p className="font-medium text-amber-400 mb-1">⌛ Beat the Clock</p>
                <p>Choose 1, 2, or 3 minutes to solve all 5 words.</p>
              </div>
              
              <div>
                <p className="font-medium text-amber-400 mb-1">🔤 Unscramble Words</p>
                <p>Tap a letter then a slot, or tap a slot then a letter to place it.</p>
              </div>

              <div>
                <p className="font-medium text-amber-400 mb-1">⌨️ Keyboard Play</p>
                <p>Type letters to fill slots. Use ↑↓ or Tab to switch words. Backspace to undo.</p>
              </div>
              
              <div>
                <p className="font-medium text-amber-400 mb-1">🔀 Shuffle</p>
                <p>Use the shuffle button to rearrange letters if you&apos;re stuck.</p>
              </div>
              
              <div>
                <p className="font-medium text-amber-400 mb-1">💡 Hints</p>
                <p>Each word has a hint if you need help.</p>
              </div>
              
              <div>
                <p className="font-medium text-amber-400 mb-1">🎉 Reveal the Theme</p>
                <p>Solve all 5 words to discover the hidden category!</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-600">
                <p className="font-medium text-amber-400 mb-1">💌 Questions or Feedback?</p>
                <p>We&apos;d love to hear from you! Email us at{' '}
                  <a href="mailto:lettergriddle@gmail.com" className="text-amber-400 underline">lettergriddle@gmail.com</a>
                  {' '}or follow us on Instagram{' '}
                  <a href="https://instagram.com/letter_griddle" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">@letter_griddle</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(10, 10, 30, 0.9)' }}
          onClick={() => setShowStats(false)}
        >
          <div 
            className="max-w-sm w-full rounded-3xl p-6 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(51, 65, 85, 0.98) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowStats(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-amber-400 mb-4 text-center">📊 Your Stats</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                <div className="text-2xl font-bold text-amber-400">{stats.gamesPlayed}</div>
                <div className="text-slate-400 text-xs">Games Played</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <div className="text-2xl font-bold text-emerald-400">
                  {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                </div>
                <div className="text-slate-400 text-xs">Win Rate</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                <div className="text-2xl font-bold text-amber-400">🔥 {stats.currentStreak}</div>
                <div className="text-slate-400 text-xs">Current Streak</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                <div className="text-2xl font-bold text-amber-400">⭐ {stats.bestStreak}</div>
                <div className="text-slate-400 text-xs">Best Streak</div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3 text-center">Best Times</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(min => (
                  <div key={min} className="text-center p-2 rounded-lg" style={{ background: 'rgba(100, 116, 139, 0.2)' }}>
                    <div className="text-xs text-slate-500 mb-1">{min} min</div>
                    <div className="text-sm font-bold text-slate-300">
                      {stats[`bestTime${min}`] ? formatTime(stats[`bestTime${min}`]) : '--:--'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
