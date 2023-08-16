const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Set up CORS to accept requests from your client deployed on GitHub Pages
const corsOptions = {
    origin: 'https://Azrael-Savage.github.io',
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

// This ensures the app uses the port provided by Heroku or defaults to 3001 for local development
const PORT = process.env.PORT || 3001;

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
    console.log(`Server running on port ${PORT}`);
});
