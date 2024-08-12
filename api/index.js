require('dotenv').config();

const 
  express = require('express')
;
const
  app = express(),
  PORT = process.env.PORT || 5001
;


app.listen(PORT, () => {
  console.log(`✅Node running on port ${PORT}`);
})