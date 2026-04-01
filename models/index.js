const { sequelize } = require('../config/db');
const User = require('./User');
const Article = require('./Article');

// Setup Relations
User.hasMany(Article, { foreignKey: 'authorId' });
Article.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = {
    sequelize,
    User,
    Article
};
