const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const routes = require('./src/routes.root');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Boom = require('@hapi/boom');

require('dotenv').config();


app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); 

app.use(bodyParser.json());

app.get("/",async(req,res)=>{
  res.send("WorkWise");
})

app.use(routes);

app.use((req, res, next) => {
  const error = Boom.notFound('The requested resource could not be found');
  next(error);
});


app.use((err, req, res, next) => {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json({ success: false, ...output.payload });
  } else {
    res.status(err.statusCode||500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? err?.message 
          : message.internalError.error,
    });
  }
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = app;
