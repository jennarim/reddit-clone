const express = require('express'),
      mongoose = require('mongoose'),
      helper = require('./helper.js');

const Post = mongoose.model('Post');

const router = express.Router();

router.get('/', (req, res) => {
	Post
		.find({})
		.populate('category', 'name')
		.populate('author')
		.exec((err, posts) => {
			if (err) {
				res.send('error');
			} else {
				posts = posts.filter(post => post.score >= 1);
				posts.sort(helper.comparePostsByScore).reverse();
				res.render('all', {posts});
			}
	});
});

router.get('/request', (req, res) => {
	res.render('request');
});

module.exports = router;