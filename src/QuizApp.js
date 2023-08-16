import React, { useState } from 'react';
import axios from 'axios';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const startQuiz = async () => {
    const response = await axios.get('http://localhost:3001/getTriviaQuestions');
    setQuestions(response.data);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
  };

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="quiz-app">
      {showScore ? (
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
              <div className="question-text">{questions[currentQuestionIndex].question}</div>
              <div className="answer-section">
                {questions[currentQuestionIndex].answers.map((answer, index) => (
                  <button key={index} onClick={() => handleAnswerOptionClick(answer.isCorrect)}>
                    {answer.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button onClick={startQuiz}>Start Quiz</button>
          )}
        </>
      )}
    </div>
  );
};

export default QuizApp;
