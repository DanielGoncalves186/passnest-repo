const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'tz2GeEGmf7SvuSzh', {
    host: 'tenaciously-healing-planarian.data-1.use1.tembo.io',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false
      }
    }
});

sequelize.authenticate()
    .then(function () {
        console.log('Connected to database!');
    })
    .catch(function (err) {
        console.log("Can't connect to database!", err);
    });

module.exports = sequelize;
