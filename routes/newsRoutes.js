const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
} = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getArticles)
    .post(protect, admin, createArticle);

router.route('/:id')
    .get(getArticleById)
    .put(protect, admin, updateArticle)
    .delete(protect, admin, deleteArticle);

module.exports = router;
