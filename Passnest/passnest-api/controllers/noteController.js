const controllers = {}
const User = require('../models/User');
const Note = require('../models/Note');
const { Op } = require('sequelize');
const moment = require('moment');

const bcrypt = require('bcrypt')

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

/*
controllers.createnote = async (req, res) => {

    try {
        const userId = req.params.userid;
        const noteData = { ...req.body, userId };
        await Note.create(noteData);
        return res.json({
            error: false,
            message: 'Note created successfully!'
        });
    } catch (error) {
        console.error('Error creating Note:', error);
        return res.status(400).json({
            error: true,
            message: 'Error: Note not created successfully!'
        })
    }
};*/

controllers.createnote = async (req, res) => {
    try {
        const userId = req.params.userid;
        const noteData = { ...req.body, userId };

        // Hash the password if it exists
        if (noteData.npass) {
            const { iv, encryptedData } = encryptPassword(noteData.npass);
            noteData.npass = JSON.stringify({ iv, encryptedData });
        }

        await Note.create(noteData);
        return res.json({
            error: false,
            message: 'Note created successfully!',
        });
    } catch (error) {
        console.error('Error creating Note:', error);
        return res.status(400).json({
            error: true,
            message: 'Error: Note not created successfully!',
        });
    }
};

controllers.shownotes= async (req, res) => {
    try {
        const userId = req.params.userid;
        const notes = await Note.findAll({
            where: {
                userId
            }
        });
        return res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error: Internal server error'
        })
    }
}

controllers.editnote= async (req, res) => {
    const {nname, nusername, nemail, npass, nurl,ndesc, color} = req.body;
    const noteId = req.params.noteid;

    try {
        const note = await Note.findOne({ where: { id: noteId } })
        if (!note) {
            return res.status(404).json({ error: 'Note found' });
        }
        if (note.npass) {
            note.npass = bcrypt.compareSync(note.npass, note.npass);
        }
        if (nname !== undefined && nname !== null && nname !== '') {
            note.nname = nname;
        }
        if (nusername !== undefined && nusername !== null && nusername !== '') {
            note.nusername = nusername;
        }
        if (nemail !== undefined && nemail !== null && nemail !== '') {
            note.nemail = nemail;
        }
        if (npass !== undefined && npass !== null && npass !== '') {
            const hashedPassword = await bcrypt.hash(npass, 10);
            note.npass = hashedPassword;
        }
        if (nurl !== undefined && nurl !== null && nurl !== '') {
            note.nurl = nurl;
        }
        if (ndesc !== undefined && ndesc !== null && ndesc !== '') {
            note.ndesc = ndesc;
        }
        if (color !== undefined && color !== null && color !== '') {
            note.color = color;
        }
        await note.save();
        return res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

controllers.deletenote = async (req, res) => {

    try {
        const noteId = req.params.noteid;
        const note = await Note.findByPk(noteId)
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        await note.destroy();
        return res.json({
            error: false,
            message: 'Note deleted successfully!'
        })
    } catch (error) {
        console.error('Error deleting note:', error);
        return res.status(400).json({
            error: true,
            message: 'Error: notenot deleted successfully'
        });
    }
}

// Encrypt function
function encryptPassword(password) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypt function
function decryptPassword(encryptedPassword, iv) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedPassword, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    notecontroller: controllers
}