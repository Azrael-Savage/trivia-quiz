const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); // Added path module

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://azrael-savage.github.io'],
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

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

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all route to serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
