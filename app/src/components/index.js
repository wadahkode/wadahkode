import * as Article from './article';
import * as Product from './product';

class Component {
    constructor(props) {
        const {product, article} = props;
        
        this.productId = product.view.id;
        this.productIdDetail = product.view.detail;
        
        this.articleId = article.view.id;
        this.articleIdDetail = article.view.detail;
    }
    
    getProduct() {
        Product.getProduct(this.productId);
        Product.detailProduct(this.productIdDetail);
    }
    
    getArticle() {
        Article.getArticle(this.articleId);
        Article.detailArticle(this.articleIdDetail);
    }
}

export default Component;