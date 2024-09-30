const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerOptions'); 
const app = express();
const PORT = process.env.PORT || 3000;
const dictionaryRoutes = require('./routes/dictionaryRoutes');
const logger = require('./middleware/logger');
app.use(express.json());
app.use(logger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/', (req, res) => {
    res.send('Dictionary API');
});
app.use('/', dictionaryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

