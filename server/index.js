require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const gameRoutes = require("./routes/games");

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['https://pollub.pl', 'https://www.google.com/', 'http://localhost:3000']
}));

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Połączono z bazą danych MongoDB'))
    .catch((err) => console.log('Błąd połączenia z bazą danych:', err));

app.get('/', (req, res) => {
    res.send('Backend działa i łączy się z bazą MongoDB!');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});

const historyRoutes = require("./routes/history");
app.use("/api/history", historyRoutes);

app.use("/api/games", gameRoutes);

