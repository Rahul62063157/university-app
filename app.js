const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// View Engine
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/university_app_db')
   .then(() => console.log("MongoDB connected"))
   .catch((err) => console.error(err));

// Route to render index.ejs
app.get('/', (req, res) => {
   res.render('index');
});

// Routes for courses and students
app.use('/courses', courseRoutes);
app.use('/students', studentRoutes);

// Start server
app.listen(3000, () => {
   console.log('Server is running on http://localhost:3000');
});
