const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors()); // Use CORS middleware to handle cross-origin requests

const PORT = 3001;

app.get('/getTriviaQuestions', async (req, res) => {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
        const transformedData = response.data.results.map((question) => {
            let answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
            answers = answers.map((answer) => ({
                text: answer,
                isCorrect: answer === question.correct_answer,
            }));
            return {
                question: question.question,
                answers: answers,
            };
        });
        res.json(transformedData);
    } catch (error) {
        console.error('Error fetching trivia questions:', error);
        res.status(500).send('Failed to fetch questions.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
