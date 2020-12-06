import * as URL from '../../utility/url';
import * as Event from '../../events';
import {logout} from '../../services/authenticated';
import {getArticle} from './article';
import {getProduct, getDetailProduct} from './product';
//import * as GHPages from '../../config/ghpages';

class Homepage {
    constructor(pattern, data) {
        this.pattern = pattern;
        this.userData = data;
    }
    
    parseUrl(request) {
        return URL.parse('', request);
    }
    
    getComponent() {
        getArticle('view-article', this.pattern);
        getProduct('view-product');
    }
    
    getComponentOnlyProduct() {
        getProduct('view-product');
    }
    
    logout() {
        const {uid} = this.userData;
        Event.loading(length => {
            if (length == 100) {
                return logout(uid);
            }
        });
    }
}

export default Homepage;