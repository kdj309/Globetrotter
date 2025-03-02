import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import {startGame,submitAnswer} from '../services/game/index'
import { getOptions } from '../services/destinations';
import { createChallenge } from '../services/user';

const GameBoard = () => {
  const [loading, setLoading] = useState(true);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameId, setGameId] = useState(null);
  const location=useLocation();
  const [username, setUsername] = useState(location?.state);
  
  const { challengeId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    if (!username && !challengeId) {
      navigate('/login');
      return;
    }
    
    // Start a new game
    startNewGame();
  }, [username]);
  
  const startNewGame = async () => {
    try {
      setLoading(true);
      
      // Start a new game session
      const gameData = await startGame(username);
      setGameId(gameData.gameId);
      
      // Set current destination
      setCurrentDestination(gameData.destination);
      
      // Get options for this destination
      const optionsData = await getOptions(gameData.destination.id);
      setOptions(optionsData.options);
      
      // Reset feedback
      setFeedback(null);
      setShowConfetti(false);
      
      setLoading(false);
    } catch (error) {
      console.error('Error starting game:', error);
      setLoading(false);
    }
  };
  
  const handleAnswer = useCallback(async (answer:string) => {
    try {
      // Submit answer to the API
      const result = await submitAnswer(gameId, answer,currentDestination.id);
      
      // Update feedback and score
      setFeedback({
        correct: result.correct,
        destination: result.destination,
        funFact: result.funFact
      });
      
      setScore((prev)=>({...prev,correct:result.correct?prev.correct+1:prev.correct,incorrect:!result.correct?prev.incorrect+1:prev.incorrect}));
      
      // Show confetti for correct answers
      if (result.correct) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // Set timeout before loading next question
      setTimeout(() => {
        if (result.gameCompleted) {
          navigate('/results', { state: { score: result.score } });
        } else if (result.nextDestination) {
          setCurrentDestination(result.nextDestination);
          // Get options for next destination
          getOptions(result.nextDestination.id)
            .then(data => setOptions(data.options));
          setFeedback(null);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  },[gameId]);
  
  const handleChallengeFriend = async () => {
    try {
      const challengeData = await createChallenge(username);
      
      // Create share data
      const shareData = {
        title: 'Destination Guessing Game',
        text: `Can you beat my score of ${score.correct} points? Play the Destination Guessing Game!`,
        url: challengeData.challengeUrl
      };
      
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        alert('Challenge link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };
  
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }
  
  return (
    <div className="max-w-lg mx-auto p-4">
      {showConfetti && <Confetti width={window.width} height={window.height} />}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Score display */}
        <div className="flex justify-between mb-4 text-sm">
          <div className="bg-green-100 px-3 py-1 rounded-full">
            Correct: {score.correct}
          </div>
          <div className="bg-red-100 px-3 py-1 rounded-full">
            Incorrect: {score.incorrect}
          </div>
        </div>
        
        {/* Clues display */}
        {currentDestination && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Where am I?</h3>
            <ul className="list-disc pl-5 space-y-2">
              {currentDestination.clues.map((clue, index) => (
                <li key={index} className="text-gray-700">{clue}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Options display */}
        {!feedback && (
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold">Select your answer:</h3>
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.name)}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
        
        {/* Feedback display */}
        {feedback && (
          <div className={`p-4 rounded-lg text-center mb-6 ${
            feedback.correct ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className="text-2xl mb-2">
              {feedback.correct ? '🎉 Correct!' : '😢 Incorrect!'}
            </div>
            <div className="font-semibold">
              The answer is: {feedback.destination}
            </div>
            <div className="mt-4 text-gray-700">
              <strong>Fun Fact:</strong> {feedback.funFact}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex space-x-3 mt-4">
          <button
            onClick={startNewGame}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            Next Question
          </button>
          <button
            onClick={handleChallengeFriend}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition"
          >
            Challenge a Friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;