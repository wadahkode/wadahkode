import BaseController from './BaseController';

class ProductController extends BaseController {
    constructor(props) {
        super(props);
        this.homepage = localStorage.getItem('homepage');
        this.authenticate().except();
        this.components();
    }
    
    components() {
        const {getCartLength} = require('../resources/users/cart');
        this.prop.then(response => {
            if (response.status) {
                getCartLength('.view-cart-length');
            }
        });
    }
    
    index(request) {
        this.view('product');
    }
    
    getDetailProduct(key) {
        const {detailProduct} = require('../components/product');
        
        return detailProduct('detail-product', key);
    }
}

export default ProductController;