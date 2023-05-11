const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const fileupload = require('express-fileupload');
const socketio = require('./middleware/socketIo');

//Load env vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Router files
const trucks = require('./routers/trucks');
const truckInfo = require('./routers/truckinfo');
const truck_model = require('./routers/truck_model');
const fournisseur = require('./routers/founisseur');
const reclamation = require('./routers/reclamation');
const intervention = require('./routers/intervention');
const mission = require('./routers/mission');
const contract = require('./routers/contract');
const auth = require('./routers/auth');
const users = require('./routers/user');
const fuel = require('./routers/fuel');
const cost = require('./routers/cost');
const clients = require('./routers/client');

const app = express();

// Body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// File uploading
app.use(fileupload());

// Set static folder
//ex: http://localhost:8080/photo_6224c4c6ccf1cf369dc0896b.png
app.use(express.static(path.join(process.env.FILE_UPLOAD_PATH)));

// Mount routers
app.use('/api/v1/trucks', trucks);
app.use('/api/v1/model', truck_model);
app.use('/api/v1/fournisseur', fournisseur);
app.use('/api/v1/reclamation', reclamation);
app.use('/api/v1/intervention', intervention);
app.use('/api/v1/fuel', fuel);
app.use('/api/v1/missions', mission);
app.use('/api/v1/contract', contract);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/cost', cost);
app.use('/api/v1/clients', clients);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(
    `server runnig in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});

//socket io
// createServer = require('http');
const http = require('http');
const httpServer = http.createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

httpServer.listen(3000, () => {
  console.log('3000');
});

app.set('socketIo', io);
app.use(socketio(io));
app.use('/api/v1/truckinfo', truckInfo);
io.on('connection', (socket) => {
  console.log('user connect');
  socket.emit('new information added', []);
});
