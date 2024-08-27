require('dotenv').config();
const 
  express = require('express'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  path = require('path')
;
const
  app = express(),
  connectDb = require('./utils/db'),
  PORT = process.env.PORT || 5001,
  baseDir = path.resolve();
;
connectDb();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://192.168.101.143:5173'   // Office network
}));
if(process.env.NODE_ENV === 'development') app.use(require('morgan')('dev'));

app.use('/api/v1/user', require('./routes/user.route'));
app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/listing', require('./routes/listing.route'));
// Linking backend to frontend
app.use(express.static(path.join(baseDir, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(baseDir, 'client', 'dist', 'index.html'));
});
// Creating error handler below all routes to enable it receive the next
app.use((err, req, res, next) => {
  const 
    statusCode = err.statusCode || 500,
    message = err.message || 'Internal Server Error'
  ;
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
})

app.listen(PORT, () => {
  console.log(`✅Node running on port ${PORT}`);
})