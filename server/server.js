const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Import Routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const referenceRoutes = require('./routes/references');
const transactionRoutes = require('./routes/transactions');
const dashboardRoutes = require('./routes/dashboards');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/references', referenceRoutes); // For City, PropertyType, Amenities
app.use('/api/transactions', transactionRoutes); // For Sales, Rentals, Reviews
app.use('/api/dashboards', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Real Estate API is running...');
});
// Global Error Handler to prevent app crashes from unhandled rejections
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error: ', err.stack);
  res.status(500).json({ error: 'Internal Server Error - API integrity preserved' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found' });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
