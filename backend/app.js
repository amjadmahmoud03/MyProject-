const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routers/userRoutes');
const adRouter = require('./routers/adRoutes');
const reportRouter = require('./routers/reportRoutes');
const adminRouter = require('./routers/adminRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/ads', adRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/admins', adminRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
