require('./db.js');
require('./auth.js');

const express = require('express'),
	  path = require('path'),
	  mongoose = require('mongoose'),
	  session = require('express-session'),
	  hbs = require('hbs'),
	  // Handlebars = require('Handlebars'),
	  fs = require('fs'),
	  passport = require('passport'),
	  config = require('./config.json');

const app = express();

const sessionOptions = { 
    secret: config.secret, 
    saveUninitialized: true, 
    resave: true 
};

hbs.registerPartial('postPartial', fs.readFileSync(path.join(__dirname, 'views/partials/postPartial.hbs'), 'utf8'));
hbs.registerPartial('errorPartial', fs.readFileSync(path.join(__dirname, 'views/partials/errorPartial.hbs'), 'utf8'));
hbs.registerPartial('createPartial', fs.readFileSync(path.join(__dirname, 'views/partials/createPartial.hbs'), 'utf8'));
hbs.registerHelper('valOf', (obj) => {
	console.log('####################');
	console.log(obj);
});
hbs.registerHelper('isText', (post) => {
	return post.type === 'text';
});
hbs.registerHelper('toDateString', (dateObj) => {
	return dateObj.toDateString();
});
hbs.registerHelper('getScore', (post) => {
	return post.score;
});
// hbs.registerHelper('userUpvoted', (userId, post) => {
// 	const res = post.upvotedUsers.includes(userId);
// 	if (res) {
// 		console.log('user upvoted ', post.title);	
// 	} else {
// 		console.log('user did not upvoted ', post.title);
// 	}
// 	return res;
// });
// hbs.registerHelper('userDownvoted', (userId, post) => {
// 	const res = post.downvotedUsers.includes(userId);
// 	if (res) {
// 		console.log('user downvoted ', post.title);	
// 	} else {
// 		console.log('user did not downvoted ', post.title);
// 	}
// 	return res;
// });

const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

app.set('view engine', 'hbs');
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

function handleError(err) {
	res.render('error');
};

// Make username available to templates
app.use((req, res, next) => {
	if (req.user) {
		res.locals.userId = req.user._id;
		res.locals.username = req.user.username;
	} else {
		res.locals.username = undefined;
	}
	next();
});

// Make list of all categories available to templates
app.use((req, res, next) => {
	Category.find({}, (err, categories) => {
		if (err) {
			handleError();
		} else {
			res.locals.categories = categories;
		}
		next();	
	});
});

// Route handling
app.use('/', require('./routes/home.js'));
app.use('/', require('./routes/create.js'));
app.use('/', require('./routes/user.js'));
app.use('/', require('./routes/loginRegister.js'));
app.use('/', require('./routes/category.js'));
app.use('/', require('./routes/score.js'));

app.listen(process.env.PORT || 3000);