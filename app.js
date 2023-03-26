const http = require('http');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyparser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const {Server} = require('socket.io')
const logger = require('./logger/logger');
const httpLogger = require('./logger/httpLogger');
//const io = require('socket.io')(http)
const { notFound, errorHandler} = require('./middleware/errorMiddleware');

const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users');
//const itemRouter = require('./routes/items');

const MongoStore = require('connect-mongo');
const { connection } = require('mongoose');



require('./database')();

const app = express();

const PORT = process.env.PORT;

const options = {
cors: true,

origin: ['http://localhost:5000']

}

app.use(express.static(path.join(__dirname, 'dist')));
// using morgan to log incoming requests' type, in the 'dev' environment
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}


// using express library to gain access to body of request sent by clients
app.use(httpLogger);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json())

process.on('uncaughtException', (err) => {
  logger.info('UNHANDLED EXCEPTION! 💥 Shutting Down');
  process.exit(1);
});


const whitelist = [
  'https://creative90.github.io',
  'https://my-chatbot-api.onrender.com',
  'https://my-chatbot-api.onrender.com/api/v1/chatbot',
  'http://localhost:5000',
  
  
];



//  Implementing CORS
app.use(
  cors({
    origin: whitelist,
   credentials: true,
    methods: 'GET, POST',
     allowedHeaders: [
  'Access-Control-Allow-Origin', 
   'Content-Type',
  'Authorization',
  ],
 })
 );

//  creating in memory sessions for our clients to stay recognized by the server.

app.set('trust proxy', 1);

const sessionOptions = {
  name: 'orderBot',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    touchAfter: 2 * 3600,
  }),
  cookie: {
    name: 'orderBot',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1 * 60 * 60 * 1000,
  },
};
app.use(session(sessionOptions));

app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //initialize session with passport


app.use('/api/v1/chatbot', orderRouter);
app.use('/api/v1/chatbot/users', userRouter);
//app.use('/api/v1/chatbot/items', itemRouter);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find this route: (${req.originalUrl}) on this server.`,
  });
  next(
    new Error(`Can't find this route: (${req.originalUrl}) on this server.`)
  );
});

//use error handler middleware
app.use(errorHandler)
app.use(notFound)


const server = app.listen(process.env.PORT, () => {
  console.log(`listening successfully on PORT ${process.env.PORT}`);
});
  
const io = new Server(server)

io.on = ('connection', socket => {
  socket.on ("message:", message => console.log(message))
})

process.on('unhandledRejection', (err) => {
  logger.info('UNHANDLED REJECTION! 💥 Shutting Down');
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
