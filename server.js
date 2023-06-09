//  a
const express = require("express");
const path = require('path');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(path.join(__dirname, '/public')));


// b
const nunjucks = require("nunjucks")

nunjucks.configure('views', {
    autoescape: true,
    express: app
});


// c
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
const cookieParser = require('cookie-parser')
app.use(cookieParser());


// d
const article = require('./models/article_model.js');
const iArticle = new article();



const HtmlEscaper = require('html-escaper');
FroalaEditor = require('./node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');


// e
app.get('/', function(req, res){
    iArticle.getAllArticles().then(articles => {
        res.render('index.html', {articles: articles})
    }).catch(err => {
        console.log(err);
    });
})

// f
app.get('/lang', function(req, res){

    const lang = req.query.lang;
    res.cookie('lang', lang, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        httpOnly: true,
        sameSite: 'lax'
      });

    res.send();
})


// g
app.get('/article/:article_id', function(req, res){


    const article_id = req.params.article_id;
    
    iArticle.getArticleDetail(article_id).then(detail => {
        const content = detail[0].content;
        const arabicContent = detail[0].arabicContent;
        
        
        if (req.cookies.lang == 'ar'){
            res.render('article.html', {detail: detail[0], content: HtmlEscaper.unescape(arabicContent)});}
        else{
            res.render('article.html', {detail: detail[0], content: HtmlEscaper.unescape(content)});
        }
    }).catch(err => {
        console.log(err);
    });
    
})

// h
app.delete('/articles/:article_id', function(req, res){
    const article_id = req.params.article_id;
    iArticle.deleteArticle(article_id);
})

// i
app.put('/article/:article_id/like', function(req, res){
    const article_id = req.params.article_id;
    iArticle.likeArticle(article_id);
})

// j 
app.get('/new', function(req, res){
    res.render('new_article.html', {detail: {author: "Admin"}, type: "Create", action: "/new"});
})

// k
app.post('/new', (req, res) => {
    const articleData = req.body;
    articleData.content = HtmlEscaper.unescape(articleData.content)
    articleData.arabic_content = HtmlEscaper.unescape(articleData.arabic_content)
    iArticle.addArticle(articleData);
    res.redirect('/');
});

// l
app.get('/edit/:id', function(req, res){
    let id = req.params.id;

    iArticle.getArticleDetail(id).then(detail => {
        res.render('new_article.html', {detail: detail[0], type: "Update", action: `/edit/${id}`});
    }).catch(err => {
        console.log(err);
    });
})

// m
app.post('/edit/:id', function(req, res){

    const articleData = req.body;
    articleData.content = HtmlEscaper.unescape(articleData.content)
    articleData.arabic_content = HtmlEscaper.unescape(articleData.arabic_content)
    const id = req.params.id;
    iArticle.updateArticle(id, articleData);
    res.redirect('/');
})

// n
app.post('/upload', function(req, res){
    
    // Store image.
    FroalaEditor.Image.upload(req, 'public/images/', function(err, data) {
        // Return data.
        if (err) {
            return res.send(JSON.stringify(err));
        }

        res.send(data);
    });


})



app.listen(port, function(){
    console.log(`Server listening on port http://127.0.0.1:${port}!`)
})