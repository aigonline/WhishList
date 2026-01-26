module.exports = (err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};