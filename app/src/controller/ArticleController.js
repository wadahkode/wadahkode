import BaseController from './BaseController';

class ArticleController extends BaseController{
    constructor(props) {
        super(props);
        this.homepage = localStorage.getItem('homepage');
        this.authenticate().except();
    }
    
    index(request) {
        this.view('article');
    }
    
    getDetailArticle(key) {
        const {detailArticle} = require('../components/article');
        
        return detailArticle('detail-article', key);
    }
}

export default ArticleController;