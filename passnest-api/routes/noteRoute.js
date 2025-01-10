const express = require('express');
const router = express.Router();

require('dotenv').config()

const { verifyJWT } = require('../controllers/authenticationController')
const { notecontroller } = require('../controllers/noteController')

router.post('/createnote/:userid', verifyJWT, notecontroller.createnote)
router.get('/shownotes/:userid', notecontroller.shownotes)
router.post('/editnote/:noteid', verifyJWT, notecontroller.editnote)
router.delete('/deletenote/:noteid',verifyJWT, notecontroller.deletenote)

module.exports = router;