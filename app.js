const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3000;
const dictionaryRoutes = require('./routes/dictionaryRoutes');
const logger = require('./middleware/logger');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(logger);


// Root Route
app.get('/', (req, res) => {
    res.send('Dictionary API');
});

// Dictionary Routes
app.use('/', dictionaryRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
