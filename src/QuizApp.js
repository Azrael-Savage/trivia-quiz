import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [username, setUsername] = useState("");
    const [showSaveScore, setShowSaveScore] = useState(false);
    const [highscores, setHighscores] = useState([]);
    const [showHighScores, setShowHighScores] = useState(false);

    useEffect(() => {
        const storedHighscores = JSON.parse(localStorage.getItem("highscores") || "[]");
        setHighscores(storedHighscores);
    }, []);

    const startQuiz = async () => {
        const response = await axios.get('http://localhost:3001/getTriviaQuestions');
        setQuestions(response.data);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setShowHighScores(false);
    };

    const handleAnswerOptionClick = (isCorrect, index) => {
        if (isCorrect) {
            setScore(score + 1);
            document.querySelectorAll(".answer-section button")[index].classList.add("correct-answer");
        } else {
            document.querySelectorAll(".answer-section button")[index].classList.add("wrong-answer");
        }

        const nextQuestion = currentQuestionIndex + 1;
        setTimeout(() => {
            if (nextQuestion < questions.length) {
                setCurrentQuestionIndex(nextQuestion);
            } else {
                setShowSaveScore(true);
            }
            document.querySelectorAll(".answer-section button")[index].classList.remove("correct-answer", "wrong-answer");
        }, 1000);
    };

    const saveScore = () => {
        const newHighscores = [...highscores, { username, score }];
        newHighscores.sort((a, b) => b.score - a.score);  
        localStorage.setItem("highscores", JSON.stringify(newHighscores));
        setHighscores(newHighscores);
        setShowSaveScore(false);
        setShowScore(true);
    };

    const toggleHighScores = () => {
        setShowHighScores(prev => !prev);
    };

    return (
        <div className="quiz-app">
            {showHighScores ? (
                <div className="highscores-section">
                    <h2>High Scores</h2>
                    <ul>
                        {highscores.map((scoreEntry, index) => (
                            <li key={index}>
                                {scoreEntry.username}: {scoreEntry.score}
                            </li>
                        ))}
                    </ul>
                    <button onClick={toggleHighScores}>Back to Start</button>
                </div>
            ) : showSaveScore ? (
                <div className="save-score-section">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={saveScore}>Save Score</button>
                </div>
            ) : showScore ? (
                <div className="score-section">
                    You scored {score} out of {questions.length}
                    <button onClick={startQuiz}>Try Again</button>
                </div>
            ) : questions.length > 0 ? (
                <div className="question-section">
                    <div className="question-count">
                        <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
                    </div>
                    <div className="score-section">
                        Current Score: {score}
                    </div>
                    <div className="question-text">{questions[currentQuestionIndex].question}</div>
                    <div className="answer-section">
                        {questions[currentQuestionIndex].answers.map((answer, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleAnswerOptionClick(answer.isCorrect, index)}>
                                {answer.text}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="start-section">
                    <div className="instructions">
                        <p>Welcome to the Trivia Quiz!</p>
                        <p>Answer each question to the best of your ability. Click on your chosen answer to proceed to the next question.</p>
                        <p>Your score will be displayed at the end. Good luck!</p>
                    </div>
                    <button onClick={startQuiz}>Start Quiz</button>
                    
                    <div className="top-score">
                        <h3>Top Score:</h3>
                        {highscores[0] && (
                            <p>{highscores[0].username}: {highscores[0].score}</p>
                        )}
                    </div>
                    <button onClick={toggleHighScores}>High Scores</button>
                </div>
            )}
        </div>
    );
};

export default QuizApp;
