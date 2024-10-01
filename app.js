const express = require('express');
const cors = require('cors'); // Import the cors package
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerOptions'); 
const app = express();
const PORT = process.env.PORT || 3000;
const dictionaryRoutes = require('./routes/dictionaryRoutes');
const logger = require('./middleware/logger');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(logger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
