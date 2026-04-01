const { Article, User } = require('../models');
const { Op } = require('sequelize');

const getArticles = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.search
            ? {
                  title: {
                      [Op.like]: `%${req.query.search}%`,
                  },
              }
            : {};

        const categoryFilter = req.query.cat && req.query.cat !== 'all news'
            ? { category: req.query.cat }
            : {};

        const whereClause = { ...keyword, ...categoryFilter };

        const { count, rows } = await Article.findAndCountAll({
            where: whereClause,
            include: [{
                model: User,
                as: 'author',
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset: pageSize * (page - 1)
        });

        // Map `id` to `_id` for frontend compatibility
        const articles = rows.map(a => {
            const article = a.toJSON();
            article._id = article.id;
            return article;
        });

        res.json({ articles, page, pages: Math.ceil(count / pageSize), count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getArticleById = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['name']
            }]
        });
        
        if (article) {
            article.views += 1;
            await article.save();

            const articleData = article.toJSON();
            articleData._id = articleData.id;

            res.json(articleData);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Article not found' });
    }
};

const createArticle = async (req, res) => {
    try {
        const { title, content, category, image_url } = req.body;

        const article = await Article.create({
            title,
            content,
            category,
            image_url,
            authorId: req.user.id,
        });

        const createdArticle = article.toJSON();
        createdArticle._id = createdArticle.id;
        
        res.status(201).json(createdArticle);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create article', error: error.message });
    }
};

const updateArticle = async (req, res) => {
    try {
        const { title, content, category, image_url } = req.body;

        const article = await Article.findByPk(req.params.id);

        if (article) {
            article.title = title || article.title;
            article.content = content || article.content;
            article.category = category || article.category;
            article.image_url = image_url || article.image_url;

            await article.save();
            
            const updatedArticle = article.toJSON();
            updatedArticle._id = updatedArticle.id;
            
            res.json(updatedArticle);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Failed to update article', error: error.message });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);

        if (article) {
            await article.destroy();
            res.json({ message: 'Article removed' });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete article', error: error.message });
    }
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
};
