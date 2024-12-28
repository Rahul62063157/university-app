const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// Show all courses
router.get('/', async (req, res) => {
   try {
      const courses = await Course.find();
      res.render('courses', { courses });
   } catch (err) {
      res.status(500).send('Error fetching courses');
   }
});

// Add a new course
router.post('/add', async (req, res) => {
   const { courseCode, courseName, instructor } = req.body;

   // Check if all required fields are present
   if (!courseCode || !courseName || !instructor) {
      return res.status(400).send('All fields are required');
   }

   const newCourse = new Course({
      courseCode,
      courseName,
      instructor
   });

   try {
      await newCourse.save();
      res.redirect('/courses');
   } catch (err) {
      console.error(err);
      res.status(400).send('Error adding course: ' + err.message);
   }
});

// Update a course
router.post('/update/:id', async (req, res) => {
   try {
      await Course.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/courses');
   } catch (err) {
      res.status(400).send('Error updating course');
   }
});

// Delete a course
router.post('/delete/:id', async (req, res) => {
   try {
      await Course.findByIdAndRemove(req.params.id);
      res.redirect('/courses');
   } catch (err) {
      res.status(400).send('Error deleting course');
   }
});

module.exports = router;
