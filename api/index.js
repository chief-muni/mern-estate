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
}))

app.listen(PORT, () => {
  console.log(`✅Node running on port ${PORT}`);
})