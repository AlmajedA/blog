const sqlite3 = require('sqlite3').verbose();

class Article{
    

    // our database

    // open database in memory

    constructor(){
        
        this.db = new sqlite3.Database('./articles_store.db3', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Successfully Connected to the Database');
        });
         
    }

    


    getAllArticles() {
        const query = `SELECT * FROM articles`
        const result = this.getData(query)
        return result
    }


    getArticleDetail(article_id){

        const query = `SELECT * FROM articles WHERE articles.id = ?`
        const result = this.getData(query, [article_id])
        return result
        
    }

    addArticle (article_data){
        
        article_data.likes = 0;

        // Adding the new article to the database

        this.db.run(`INSERT INTO articles(title, description, content, author, likes, arabicContent) VALUES(?, ?, ?, ?, ?, ?)`, [article_data.title, article_data.description, article_data.content, article_data.author, article_data.likes, article_data.arabic_content], function(err) {
            if (err) {
              return console.log(err.message);
            }
            
          });

    }

    updateArticle (article_id, detail){
        const query = `UPDATE articles SET title = ?, description = ?, content = ?, author = ?, arabicContent = ? WHERE id = ?`;
        
        this.db.run(query, [detail.title, detail.description, detail.content, detail.author, detail.arabic_content, article_id], function(err){
            if (err) {
                return console.log(err.message);
            }
        })
    }

    deleteArticle(article_id){
       
        // Removing the article from the database
        this.db.run(`DELETE FROM articles WHERE articles.id = ?`, [article_id], function(err) {
            if (err) {
              return console.log(err.message);
            }
            console.log(`the article with id: ${article_id} has been removed from the database`)
            
          });
    }

    likeArticle(article_id){

        const query = `UPDATE articles SET likes = likes + 1 WHERE id = ?`;
        
        this.db.run(query, [article_id], function(err){
            if (err) {
                return console.log(err.message);
            }
        })

    }


    async getData(query, given = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, given, (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve(rows);
            });
        });
      }



    close_database(){

        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });

    }
    
}

module.exports = Article;
