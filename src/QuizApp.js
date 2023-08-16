import React, { useState } from 'react';
import axios from 'axios';

const QuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [username, setUsername] = useState("");
    const [showSaveScore, setShowSaveScore] = useState(false);

    const startQuiz = async () => {
        const response = await axios.get('http://localhost:3001/getTriviaQuestions');
        setQuestions(response.data);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
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
        const highscores = JSON.parse(localStorage.getItem("highscores") || "[]");
        highscores.push({ username, score });
        localStorage.setItem("highscores", JSON.stringify(highscores));
        setShowSaveScore(false);
        setShowScore(true);
    };

    return (
        <div className="quiz-app">
            {showSaveScore ? (
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
            ) : (
                <>
                    {questions.length > 0 ? (
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
                                        onClick={() => handleAnswerOptionClick(answer.isCorrect, index)}
                                    >
                                        {answer.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                      <>
                <div className="instructions">
                    <p>Welcome to the Trivia Quiz!</p>
                    <p>Answer each question to the best of your ability. Click on your chosen answer to proceed to the next question.</p>
                    <p>Your score will be displayed at the end. Good luck!</p>
                </div>
                <button onClick={startQuiz}>Start Quiz</button>
            </>
                    )}
                </>
            )}
        </div>
    );
};

export default QuizApp;
