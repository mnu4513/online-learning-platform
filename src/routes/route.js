const express = require('express');
const router = express.Router();

const {createUser, loginUser} = require('../controllers/userController');
const {authenticate, authorized} = require('../middlewares/auth');
const {createCourse, approveCourse, viewCourse, viewAllCourse, updateCourse, deleteCourse} = require('../controllers/courseController');

router.post('/register', createUser);
router.post('/login', loginUser);

router.post('/course', authenticate, createCourse);
router.put('/approve/:courseId', authenticate, approveCourse);
router.get('/course/:courseId', authenticate, viewCourse);
router.get('/courses', authenticate, viewAllCourse);
router.put('/course/:courseId', authenticate, authorized, updateCourse);
router.delete('/course/:courseId', authenticate, authorized, deleteCourse);

router.all('/*', function (req, res) {
    res.status(400).send({status: false, message: 'invalid url'});
});

module.exports = router;