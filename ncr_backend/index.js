const express = require('express');
const app = express();
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig'); // Import your swagger configuration
require('dotenv').config();

const categories = require('./data/categories.json');
const authRoutes = require('./routes/authRoutes.js');
const contractsRoute = require('./routes/contractsRoutes.js');
const qualityRoute = require('./routes/qualityRoute.js');
const dovsbuyRoute = require('./routes/dovsbuyRoute.js');
const commonRoute = require('./routes/commonRoute.js');

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


app.use('/api/auth', authRoutes);
app.use('/api', contractsRoute);
app.use('/api', qualityRoute);
app.use('/api', dovsbuyRoute);
app.use('/api', commonRoute);

// Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost: ${port}`);
})