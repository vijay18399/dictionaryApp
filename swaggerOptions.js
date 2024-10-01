const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', 
        info: {
            title: 'My Dictionary API', 
            version: '1.0.0', 
            description: 'API Documentation for My Dictionary application', 
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
