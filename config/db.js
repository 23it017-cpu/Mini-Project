const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './newskrish_db.sqlite',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`SQLite Connected`);
    } catch (error) {
        console.error(`SQLite Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
