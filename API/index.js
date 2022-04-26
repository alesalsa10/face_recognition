require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tokenValidation = require('./routes/token-validation');
const connectDb = require('./config/mongooseConnection');
const PORT = process.env.PORT || 3000;


const app = express();

app.use(cors());
app.use(express.json());


//connect to db
connectDb();

const authRoutes = require('./routes/auth');
const homeRoute = require('./routes/user');
const updateEntriesRoute = require('./routes/updateEntries');

app.get('/', (req, res) => {
  res.send('it is working!');
});

//the path is already created on auth.js with router
app.use('/', authRoutes);

//tokenValidation is the middleware
app.use('/', tokenValidation, homeRoute);
app.use('/', tokenValidation, updateEntriesRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
