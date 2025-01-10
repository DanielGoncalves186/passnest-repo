const Sequelize = require('sequelize');
const db = require('./db');
const bcrypt = require('bcrypt');

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userstate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    verificationtokenemail: {
        type: Sequelize.STRING,
        default: null
    },
    verificationtokpass: {
        type: Sequelize.STRING,
        defaultValue: null
    }

}, {
    hooks: {
        beforeCreate: (user) => {
            const saltRounds = 10;
            return bcrypt.hash(user.password, saltRounds)
            .then((hash) => {
                user.password = hash;
            })
            .catch((err) => {
                throw new Error();
            })
        }
    }
})
User.sync();

module.exports = User;