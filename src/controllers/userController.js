const userModel = require('../models/userModel');
const { validName, validMail, validPassword, validOtp } = require('../validators/validator');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const nodemailer = require("nodemailer");
const { text } = require('express');

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
        if (user) return res.status(400).send({ status: false, message: 'email is already in use, please provide a unique email to register a user 😡' });

        const hashedPassword = passwordHash.generate(password);
        body.password = hashedPassword

        const otp = Math.round(Math.random() * 1000000);
        body.otp = otp;

        const userCreated = await userModel.create(body);
        const link = 'http://localhost:3000/verify'
        const transport = nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
                    user: 'rahulsaran820@gmail.com',
                    pass: 'kudupemqdaegzwpv'
                }
            }
        )
        const mailOptions = {
            from: 'rahulsaran820@gmail.com',
            to: email,
            subject: `"Hello"${name}`,
            text: `congratulation🥳🥳🥳, you are successfully registered, please verify your account. otp for verification is ${otp}, to verify your acoount please click on ${link}`
        }
        transport.sendMail(mailOptions, function (err, info) {
            if (err) return console.log(err.message)
            if (info) return console.log('Email Sent' + info.response)
        });
        res.status(201).send({ status: true, message: '🥳🥳🥳user successfully created!', data: userCreated });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const verifyUser = async function (req, res) {
    try {
        const body = req.body;
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: 'please enter all required details to veryfy a user 😡' });
        const { otp, email } = body;
        if (!email) return res.status(400).send({ status: false, message: 'please enter email to verify a user 😡' });
        if (!validMail(email)) return res.status(400).send({ status: false, message: 'please enter a valid email to verify a user 😡' });
        if (!otp) return res.status(400).send({ status: false, message: 'please enter otp to verify a user 😡' });
        if (!validOtp(otp)) return res.status(400).send({ status: false, message: 'please enter a valid otp to verify a user 😡' });
        const userVerified = await userModel.findOneAndUpdate({ email: email, otp: otp, verified: false }, { $set: { verified: true } }, { new: true });
        if (!userVerified) return res.status(400).send({ status: false, message: 'incorrect otp 😡' });
        res.status(200).send({ status: true, message: '🥳🥳now you are a verified user' });
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
        const user = await userModel.findOne({ email: email, verified: true });
        if (!user) return res.status(400).send({ status: false, message: 'email or password is invalid, please enter correct email and password to login a user 😡' });
        let checkPassword = passwordHash.verify(password, user.password)
        if (!checkPassword) return res.status(400).send({ status: false, message: "password is wrong" })

        const payload = { email: email, userId: user._id };
        const token = jwt.sign(payload, 'key');
        res.setHeader('x-auth-token', token);
        res.status(200).send({ status: true, message: '🥳🥳sucessfully loggedin', token: token });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

module.exports = { createUser, loginUser, verifyUser };