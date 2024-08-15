const express = require('express');
const morgan = require('morgan');
const winston = require('winston');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('combined'));

// Winston Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ],
});

// Importing all service routes
const incomeRoutes = require('./routes/income');
const expenseRoutes = require('./routes/expense');
const budgetRoutes = require('./routes/budget');
const reportRoutes = require('./routes/report');

app.use('/income', incomeRoutes);
app.use('/expense', expenseRoutes);
app.use('/budget', budgetRoutes);
app.use('/report', reportRoutes);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Personal Finance Tracker running on port ${PORT}`);
});
