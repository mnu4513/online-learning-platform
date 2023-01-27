const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');
const { validName, isUrl } = require('../validators/validator');
const { isValidObjectId } = require('mongoose');

const createCourse = async function (req, res) {
    try {
        const body = req.body;
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: 'please enter all required details to create a course 😡' });
        const { title, description, videoUrl, topics, duration, category, creator, isDeleted, approved } = body;
        if (!title) return res.status(400).send({ status: false, message: 'please enter title to create a course 😡' });
        if (!validName(title)) return res.status(400).send({ status: false, message: 'please enter a valid title create a course 😡' });
        if (!description) return res.status(400).send({ status: false, message: 'please enter description to create a course 😡' });
        // if (!description) return res.status(400).send({ status: false, message: 'please enter a valid description to create a course 😡' });
        if (!creator) return res.status(400).send({ status: false, message: 'please enter a creator id create a course 😡' });
        if (!isValidObjectId(creator)) return res.status(400).send({ status: false, message: 'please enter a valid creator id create a course 😡' });
        if (!duration) return res.status(400).send({ status: false, message: 'please enter a duration id create a course 😡' });
        // if (!duration) return res.status(400).send({ status: false, message: 'please enter a valid duration id create a course 😡' });
        if (videoUrl && !isUrl(videoUrl)) return res.status(400).send({ status: false, message: 'please enter a valid video url to create a course 😡' });
        if (topics && !validName(topics)) return res.status(400).send({ status: false, message: 'please enter a valid topic to create a course 😡' });
        if (category && !validName(category)) return res.status(400).send({ status: false, message: 'please enter a valid category to create a course 😡' });
        if (isDeleted && isDeleted !== false) return res.status(400).send({ status: false, message: 'please enter a valid value for delete status to create a course 😡' });
        if (approved && approved !== false) return res.status(400).send({ status: false, message: 'please enter a valid value for approve status to create a course 😡' });

        const user = await userModel.findById(creator);
        if (!user) return res.status(400).send({ status: false, message: 'no user found with given creator id 😡' });

        if (user.role != 'admin') return res.status(400).send({ status: false, message: 'you are not authorised to create a course 😡' });
        const courseCreated = await courseModel.create(body);
        res.status(201).send({ status: true, message: '🥳🥳🥳🥳course sucessfully created', data: courseCreated });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const approveCourse = async function (req, res) {
    try {
        const userId = req.userId;
        const courseId = req.params.courseId;
        const { approved } = req.body;
        if (approved && approved !== true) return res.status(400).send({ status: false, message: 'please enter a valid value for approve status to create a course 😡' });

        const user = await userModel.findById(userId);
        if (user.role != 'superAdmin') return res.status(400).send({ status: false, message: 'you are not authorized to approve any course, only a super admin can do this 😡' });

        const approvedCourse = await courseModel.findOneAndUpdate({ _id: courseId, approved: false, isDeleted: false }, { $set: { approved: true } }, { new: true });
        if (!approvedCourse) return res.status(404).send({ status: false, message: 'no such course found to approve 🥺 or alreday approved 🥳' });
        res.status(200).send({ status: true, message: '🥳🥳🥳🥳course has been approved', data: approvedCourse });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const viewCourse = async function (req, res) {
    try {
        const userId = req.userId;
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) return res.status(400).send({ status: false, message: 'cousreId is invalid, please enter a valid courseId 😡' });

        const course = await courseModel.findOne({ _id: courseId, isDeleted: false, approved: true });
        if (!course) return res.status(404).send({ status: false, message: 'sorry! no course found with given courseId 🥺' });

        const rewardedUser = await userModel.findOneAndUpdate({ _id: userId, role: 'employee' }, {$inc: {rewards: 1}}, {new: true});
        console.log(userId);
        console.log(rewardedUser);
        let data = { course: course };
        let message = '';
        if (rewardedUser) {
            message = '🥳🥳 your reward is increased by 1, keep studying! you are about to complete your graduation';
            data.message = message;
        };
        if (rewardedUser) {
            res.status(200).send({ status: true, data: data, user: rewardedUser });
        } else {
            res.status(200).send({ status: true, data: data});
        };
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const viewAllCourse = async function (req, res) {
    try {
        const allCourse = await courseModel.find({ isDeleted: false, approved: true }).sort({ title: 1 });
        if (allCourse.length == 0) return res.status(404).send({ status: false, message: 'sorry!, no course available at this time 🥺' });
        res.status(200).send({ status: true, message: '🥳🥳here is list of all courses, in order of title sorting', data: allCourse });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const updateCourse = async function (req, res) {
    try {
        const courseId = req.params.courseId;
        const body = req.body;
        bodyapproved = false;
        const courseUpdated = await courseModel.findOneAndUpdate({ _id: courseId, isDeleted: false, approved: true }, { $set: { ...body } }, { new: true });
        res.status(200).send({ status: true, message: '🥳🥳 course sucessfully updated, now wait for approval', data: courseUpdated });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const deleteCourse = async function (req, res) {
    try {
        const courseId = req.params.courseId;
        const courseDeleted = await courseModel.findOneAndUpdate({ _id: courseId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
        res.status(200).send({ status: true, message: '🥳🥳 course sucessfully deleted', data: courseDeleted });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

module.exports = { createCourse, approveCourse, viewCourse, viewAllCourse, updateCourse, deleteCourse }