const http = require('http');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyparser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

const io = require('socket.io')(http)
const { notFound, errorHandler} = require('./middleware/errorMiddleware');

const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users');
//const itemRouter = require('./routes/items');

const MongoStore = require('connect-mongo');



require('./database')();

const app = express();

const PORT = process.env.PORT;

//creat new connection

io.on('connection', socket =>{})

//route

// app.get('/',(req, res)=>{

//   res.sendFile(path.join(__dirname, 'src/index.html'))
// })


//setting the public folder as the static folder
app.use(express.static(path.join(__dirname, 'public')));

// using morgan to log incoming requests' type, in the 'dev' environment
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

// using express library to gain access to body of request sent by clients
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json())
//app.use(cors)
const whitelist = [
  'https://creative90.github.io',
  'https://my-chatbot-api.onrender.com',
  'http://localhost:5501',
  'http://localhost:5500',
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


app.use('/api/v1/chatbot/orders', orderRouter);
app.use('/api/v1/chatbot/users', userRouter);
//app.use('/api/v1/chatbot/items', itemRouter);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find this route: (${req.originalUrl}) on this server.`,
  });
  next(
    new Error(`Can't find this route: (${req.originalUrl}) on this server.`)
  );
});

// use error handler middleware
app.use(errorHandler)
app.use(notFound)


app.listen(process.env.PORT, () => {
  console.log(`listening successfully on PORT ${process.env.PORT}`);
});

module.exports = app;
