import BaseController from './BaseController';
import DateFormater from '../utility/dateformater';
import UIkit from 'uikit';
/**
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.1
 */
class HomepageController extends BaseController {
    constructor(prop) {
        super(prop);
        this.authenticate().backTo('../login.html');
        
        this.btnHistory = document.querySelector('#btn-history');
        this.chat = document.querySelector('#chat');
        this.components();
    }
    
    components() {
        const {getCartLength, getCartValue} = require('../resources/users/cart');
        getCartLength('.view-cart-length', this);
        getCartValue('.view-cart', this);
    }
    
    index() {
        this.prop.then(response => {
            this.view('homepage', {
                "pattern": /\/home\/.*/,
                "users": response.userData
            });
        });
    }
    
    getOnlyArticle() {
        const {getArticle} = require('../resources/users/article');
        
        return getArticle('view-article');
    }
    
    getOnlyProduct() {
        const {getProduct} = require('../resources/users/product');
        
        return getProduct('view-product');
    }
    
    async getDetailProduct(key) {
        const {getDetailProduct} = require('../resources/users/product');
        
        this.btnHistory.innerHTML = `<span uk-icon="icon: arrow-left; ratio: 1.5"></span>`;
        
        return await getDetailProduct('detail-product', key);
    }
    
    saveToCart() {
        let model = this.loadModel('product','products'),
            Cart = this.loadModel('cart', 'cart'),
            d = new DateFormater(new Date()),
            order = 0,
            check = document.createElement('span');
            
        document.querySelectorAll('.cart').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                let productKey = item.dataset.target,
                    product = model.getProductByKey(productKey);
                
                const {getPPNProduct} = require('../resources/users/product');
                const ppn = getPPNProduct(product.productPrice, product.productLocation).result;
                
                setTimeout(() => {
                    item.innerHTML = `
                        <div class="uk-flex uk-flex-center uk-flex-middle">
                            <span class="spinner"></span>
                            <span class="uk-margin-small-left">keranjang</span>
                        </div>
                    `;
                }, 1000);
                
                this.prop.then(response => {
                    const {uid} = response.userData;
                    const data = {
                        productId: productKey,
                        productName: product.productName,
                        productPhoto: product.productPhoto,
                        productPrices: product.productPrice,
                        productPPN: ppn,
                        totalPrice: product.productPrice + ppn,
                        paymentStatus: "pending",
                        buyerId: uid,
                        totalOrder: order += 1,
                        created_at: d.halfTime(),
                        updated_at: d.halfTime()
                    };
                    
                    if (product.productStock < 1) {
                        item.querySelector('.spinner').hidden = false;
                        
                        setTimeout(() => {
                            item.querySelector('.spinner').hidden = true;
                            UIkit.notification("Maaf produk sudah habis!", {
                                status: "danger",
                                timeout: 1000
                            });
                        }, 1000);
                        
                        
                        return false;
                    }
                    
                    model.updateProduct(product.productStock, productKey);
                    
                    Cart.saveToCart(data, error => {
                        if (error) {
                            UIkit.notification("Gagal menyimpan produk kedalam keranjang!", {
                                status: "warning",
                                timeout: 2000
                                
                            });
                        } else {
                            setTimeout(() => {
                                item.innerHTML = `
                                    <div class="uk-flex uk-flex-center uk-flex-middle">
                                        <span class="spinner" hidden></span>
                                        <span uk-icon="check"></span>
                                        <span class="uk-margin-small-left">keranjang</span>
                                    </div>
                                `;
                            }, 1000);
                        }
                    });
                });
            });
        });
    }
    
    async getStore(store) {
        let model = this.loadModel('store', 'store');
        
        model.ref.once('value', snapshot => {
            !(snapshot.exists()) ? this.view('store',{
                "storeNotFound": "Toko tidak dapat ditemukan!"
            }) : this.view('store', {
                search: store.toString().split('=')[1],
                result: snapshot
            });
        });
    }
    
    async getChat() {
        
    }
}

export default HomepageController;