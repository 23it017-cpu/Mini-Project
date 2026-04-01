const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('placements', 'events', 'departments', 'exams', 'sports', 'technology'),
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(1000),
        defaultValue: 'https://images.unsplash.com/photo-1585829365234-78ef2757c818?auto=format&fit=crop&q=80&w=1200'
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true,
});

module.exports = Article;
