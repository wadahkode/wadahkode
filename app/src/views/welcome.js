
function Welcome(data) {
    const Article = require('../components/article');
    const Product = require('../components/product');
    
    Article.getArticle('component-article');
    Product.getProductWithGap('component-product');
}

module.exports = Welcome;