const express = require('express');
const app = express();
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig'); // Import your swagger configuration
require('dotenv').config();

const categories = require('./data/categories.json');

// Middleware
app.use(cors());
app.use(express.json());


// Swagger Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Routes
app.get('/', (req, res) => {
    res.send("Server is running");
});

app.get('/categories', (req, res) => {
    res.send(categories); 
})


// Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server (categories) is running on port: ${port}`);
})