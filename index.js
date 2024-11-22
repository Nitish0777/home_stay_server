import express from 'express';
import dotenv from 'dotenv';
import roomRouter from './routes/roomRouter.js';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization'
  );
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use('/user', userRouter);
app.use('/room', roomRouter);
app.get('/', (req, res) => res.json({ message: 'Welcome to our API' }));
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Not Found' })
);

const startServer = async () => {
  try {
    mongoose.set('strictQuery', true);

    const connectionString = process.env.MONGO_CONNECT;
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    }).on('error', (e) => {
      console.error('Error happened: ', e.message);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};


startServer();