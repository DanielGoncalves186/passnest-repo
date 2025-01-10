const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()

const {authControllers, verifyJWT} = require('../controllers/authenticationController')

router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.get("/users", verifyJWT , authControllers.users);
router.get("/verifyemail", authControllers.verifyEmail);

module.exports = router;