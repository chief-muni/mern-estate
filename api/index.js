require('dotenv').config();

const 
  express = require('express'),
  cookieParser = require('cookie-parser'),
  cors = require('cors')
;
const
  app = express(),
  connectDb = require('./utils/db'),
  PORT = process.env.PORT || 5001
;
connectDb();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://192.168.5.232:5173'
}));
if(process.env.NODE_ENV === 'development') app.use(require('morgan')('dev'));

app.use('/api/v1/user', require('./routes/user.route'));
app.use('/api/v1/auth', require('./routes/auth.route'));

app.listen(PORT, () => {
  console.log(`✅Node running on port ${PORT}`);
})