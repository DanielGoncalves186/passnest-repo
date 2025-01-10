const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');

const Note = db.define('notes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    nname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    nusername: {
        type: Sequelize.STRING,
        allowNull: true,
        default: null
    },
    nemail: {
        type: Sequelize.STRING,
        allowNull: true,
        default: null
    },
    npass: {
        type: Sequelize.STRING,
        allowNull: true,
        default: null
    },
    nurl: {
        type: Sequelize.STRING,
        allowNull: true,
        default: null
    },
    ndesc: {
        type: Sequelize.STRING,
        allowNull: true,
        default: null
    },    
    color : {
        type: Sequelize.STRING,
        allowNull:false
    },
});
Note.belongsTo(User, { foreignKey: 'userId' });

Note.sync();
module.exports = Note;