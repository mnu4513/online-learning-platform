const jwt = require('jsonwebtoken');
const courseModel = require('../models/courseModel');
const {isValidObjectId} = require('mongoose');

const authenticate = async function (req, res, next) {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) return res.status(401).send({ status: false, message: 'you are not logged in, please login first to perform this task 😡' });
        const decodedToken = jwt.verify(token, 'key', (error, decodedToken) => {
            if (error) return res.status(401).send({ status: false, message: error.message });
            req.userId = decodedToken.userId;
            console.log(req.userId);
            next();
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const authorized = async function (req, res, next) {
    try {
        const userId = req.userId;
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) return res.status(400).send({ status: false, message: 'cousreId is invalid, please enter a valid courseId 😡' });
        const course = await courseModel.findOne({_id: courseId, isDeleted: false});
        if (!course) return res.status(404).send({ status: false, message: 'no course found or course has already been deleted 🥺' });
        console.log(course);
        if (userId != course.creator) return res.status(401).send({status: false, message: 'you are not authorised to perform this task 😡😡😡😡😡'});
        next();
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

module.exports = {authenticate, authorized};