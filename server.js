const express = require('express')
const app = express();

var path = require('path');

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname+'/views'));
app.use(express.static(path.join(__dirname+"/static")));

const bp = require('body-parser');
app.use(bp.urlencoded({ extended:true }));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotes');

var PostSchema = new mongoose.Schema({
	name:{ type: String, required: true, minlength: 2, maxlength: 50},
	quote:{ type: String, required: true, minlength: 2}
}, {timestamps: true})
mongoose.model('Post', PostSchema)
var Post = mongoose.model('Post')

// Routes go here ==>
app.get('/', function(req, res){
	res.render('index')
})
app.post('/process', function(req, res){
	var post = new Post({name: req.body.name, quote: req.body.quote});
	post.save(function(err){
		if (err){
			console.log('something went wrong')
			res.render('index', {errors: post.errors})
		} else {
			console.log('successfully added quote!')
			res.redirect('/quotes')
		}
	})
})
app.get('/quotes', function(req,res){
	Post.find({}, function(err, posts){
		if(err){
			console.log('something went wrong')
		} else {
			res.render('quotes', {posts: posts})
		}
	})
})
// <== end routes

app.listen(8000, function() {
	console.log("listening on port 8000");
})