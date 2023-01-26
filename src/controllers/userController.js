const userModel = require('../models/userModel');
const { validName, validMail, validPassword } = require('../validators/validator');
const jwt = require('jsonwebtoken');

const createUser = async function (req, res) {
    try {
        const body = req.body;
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: 'please enter all required details to register a user 😡' });
        const { name, email, password, role, rewards } = body;
        if (!name) return res.status(400).send({ status: false, message: 'please enter name to register a user 😡' });
        if (!validName(name)) return res.status(400).send({ status: false, message: 'please enter a valid name to register a user 😡' });
        if (!email) return res.status(400).send({ status: false, message: 'please enter email to register a user 😡' });
        if (!validMail(email)) return res.status(400).send({ status: false, message: 'please enter a valid email to register a user 😡' });
        if (!password) return res.status(400).send({ status: false, message: 'please enter password to register a user 😡' });
        if (!validPassword.validate(password)) return res.status(400).send({ status: false, message: 'please enter a valid password to register a user 😡' });
        if (role && !['employee', 'admin', 'superAdmin'].includes(role)) return res.status(400).send({ status: false, message: 'please provide a valid role to register a user 😡' });
        if (rewards && rewards !== 0) return res.status(400).send({ status: false, message: 'new user must not have any reward, please enter a valid reward to register a user 😡' });

        const user = await userModel.findOne({ email: email });
        if (user) return res.status(400).send({ status: false, message: 'emial is already in use, please provide a unique email to register a user 😡' });

        const userCreated = await userModel.create(body);
        res.status(201).send({ status: true, message: '🥳🥳🥳user sucessfully created!', data: userCreated });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const loginUser = async function (req, res) {
    try {
        const body = req.body;
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: 'please enter all required details to login a user 😡' });
        const { email, password } = body;
        if (!email) return res.status(400).send({ status: false, message: 'please enter email to login a user 😡' });
        if (!validMail(email)) return res.status(400).send({ status: false, message: 'please enter a valid email to login a user 😡' });
        if (!password) return res.status(400).send({ status: false, message: 'please enter password to login a user 😡' });
        const user = await userModel.findOne({email: email, password: password});
        if (!user) return res.status(400).send({ status: false, message: 'email or password is invalid, please enter correct email and password to login a user 😡' });
        const payload = {email: email, userId: user._id};
        const token = jwt.sign(payload, 'key');
        res.setHeader('x-auth-token', token);
        res.status(200).send({status: true, message: '🥳🥳sucessfully loggedin', token: token});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });   
    };
};
module.exports = { createUser, loginUser }