const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Course = require('../models/course');

// Show all students and their enrolled courses
router.get('/', async (req, res) => {
   try {
      const students = await Student.find().populate('courses');
      res.render('students', { students });
   } catch (err) {
      res.status(500).send('Error fetching students');
   }
});

// Add a new student
router.post('/add', async (req, res) => {
   const { studentId, name, age } = req.body;

   const newStudent = new Student({
      studentId,
      name,
      age
   });

   try {
      await newStudent.save();
      res.redirect('/students');
   } catch (err) {
      res.status(400).send('Error adding student');
   }
});

// Update a student
router.post('/update/:id', async (req, res) => {
   try {
      await Student.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/students');
   } catch (err) {
      res.status(400).send('Error updating student');
   }
});

// Delete a student
router.post('/delete/:id', async (req, res) => {
   try {
      await Student.findByIdAndRemove(req.params.id);
      res.redirect('/students');
   } catch (err) {
      res.status(400).send('Error deleting student');
   }
});

router.post('/enroll/:id', async (req, res) => {
   const studentId = req.params.id;
   const courseCode = req.body.courseId;  // Using courseCode for enrollment

   console.log('Student ID:', studentId);
   console.log('Course Code:', courseCode);  // Log the course code received

   // Check if courseCode is provided
   if (!courseCode) {
      return res.status(400).send('Course Code is required');
   }

   try {
      const student = await Student.findById(studentId);
      const course = await Course.findOne({ courseCode });  // Find course by courseCode

      if (!student) {
         return res.status(404).send('Student not found');
      }
      if (!course) {
         return res.status(404).send('Course not found');
      }

      // Add the course to the student's course list
      if (!student.courses.includes(course._id)) {  // Use course._id to push
         student.courses.push(course._id);
         await student.save();
      }

      // Optionally, add the student to the course's student list
      if (!course.students.includes(student._id)) {  // Ensure the student's ObjectId is added
         course.students.push(student._id);
         await course.save();
      }

      res.redirect('/students');
   } catch (err) {
      console.error(err);
      res.status(400).send('Error enrolling student in course: ' + err.message);
   }
});

module.exports = router;
