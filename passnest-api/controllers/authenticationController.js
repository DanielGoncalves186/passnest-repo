const controllers = {}
const User = require('../models/User')
var sequelize = require('../models/db')
const Sequelize = require("sequelize");
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()


controllers.register = async (req,res) => {

    const { email } = req.body;
    const verificationtokenemail = generateVerificationToken();
    await User.create({
        ...req.body,
        verificationtokenemail
    })
    .then(() => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailersend.net',
            port: 587,
            secure: false,
            auth: {
                user: 'MS_YVTfZZ@trial-351ndgw00rr4zqx8.mlsender.net',
                pass: 'pPbQrutvpsJxJOwO'
            }
        });

        const mailOptions = {
            from: 'MS_YVTfZZ@trial-351ndgw00rr4zqx8.mlsender.net',
            to: email,
            subject: 'Email Verification',
            html: `<p>Please verify your email by clicking <a href="http://localhost:8080/auth/verifyemail?token=${verificationtokenemail}">here</a>.</p>`
        }
        transporter.sendMail(mailOptions, (error) => {
            if(error){
                return res.status(400).json({
                    error: true,
                    message: 'Error: User not created successfully! Failed to send verification email.'
                });
            }
            return res.json({
                error: false,
                message: 'User created successfully! Please check your email for verification.'
            });
        });
    })
    .catch(() => {
        return res.status(400).json({
            error: true,
            message: "Error: User not created successfully!"
        })
    })
}

controllers.verifyEmail = async (req, res) => {
    const {token} = req.query;
    console.log('Token: ' + token)
    try {
    
        await User.update(
            { userstate: true, verificationtokenemail: null },
            { where: { verificationtokenemail: token } }
        );
        return res.send('<h1>Email verified successfully!</h1>');
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: 'Invalid verification token.'
        });
    }
}

const generateVerificationToken = () => {
    const token = jwt.sign({ data: 'emailVerification'}, process.env.VERIFICATION_TOKEN_SECRET,{expiresIn: '7d'});
    return token;
}

const generateVerificationTokenPass = () => {
    const token = jwt.sign({ data: 'emailVerification'}, process.env.VERIFICATION_TOKEN_SECRET,{expiresIn: '30m'});
    return token;
}


controllers.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        if (!user.userstate) {
            return res.status(400).json({
                message: "User is not authorized to login"
            });
        }

        bcrypt.compare(password, user.password)
            .then((result) => {
                if (result) {
                    const usere = { email: req.body.email }
                    const accessToken = jwt.sign(usere, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
                    const iduser = user.id;
                    const username = user.username;
                    const emailuser = user.email;
                    const addressuser = user.address;
                    const dateuser = user.birthdate;

                    console.log(iduser);

                    return res.json({
                        accessToken,
                        emailuser,
                        username,
                        iduser,
                        addressuser,
                        dateuser
                    });
                } else {
                    return res.status(400).json({
                        message: "Invalid Credentials"
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: "Internal server error"
                });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

function verifyJWT(req,res,next){
    
    const  authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({
        message:'Token null'
    });
    
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoded) =>{
        if(err) return res.status(401).json({
            message: "Invalid Token"
        });
        req.user = decoded
        console.log(req.user)
        next();
    })
};    


controllers.users = (req,res) => {
    console.log(req.user.email + ' logged in!');
     return res.status(200).json({
        message:"User logged in"
    })
}

async function userStateFalse(){
    try{
        await User.destroy({
            where: {
                userstate: false,
            },
        });
        console.log('Deleted ${deletedCount} users with userState set to false');
    }catch(error) {
        console.error('Error deleting users:', error);
    }
}

module.exports = {
    authControllers: controllers,
    verifyJWT: verifyJWT,
    userStateFalse: userStateFalse,
};
