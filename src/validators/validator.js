const passwordValidator = require('password-validator');
const validUrl = require("valid-url")

const validPassword = new passwordValidator();
validPassword
    .is().min(8)
    .is().max(15)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .not().spaces();

const validName = (name) => /^[a-zA-Z ]{3,20}$/.test(name);
const validDuration = (duration) => /^[a-zA-Z0-9 ]{3,20}$/.test(duration);
const validMail = (mail) => /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail);
const validOtp = (otp) => /^[1-9]{6}$/.test(otp);
const validDescription = (description) => /^[a-zA-Z0-9_. ]{5,2000}/.test(description);
const isUrl = validUrl.isUrl;
module.exports = { validName, validMail, validDuration, validPassword, isUrl, validOtp, validDescription };