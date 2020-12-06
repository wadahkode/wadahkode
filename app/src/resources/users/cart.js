const CartModel = require('../../model/cart-model').default;
const {getOrigin} = require('../../config/ghpages');

/**
 * Fungsi untuk menyimpan barang kedalam keranjang.
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.1
 */
const model = () => {
    return new CartModel('cart');
};

const getCartLength = (element, event) => {
    let container = document.querySelector(element);
    
    event.prop.then(response => {
        const {uid} = response.userData;
        let isNull = 0;
        
        let refreshLength = setInterval(() => {
            container.textContext = '';
            
            model().getCartLength(uid, length => {
                isNull = length;
                container.innerHTML = length;
            });
        },10);
        
        if (isNull <= 0) {
            container.innerHTML = isNull;
        }
    });
};

const getCartValue = (element, event) => {
    let container = document.querySelector(element),
        loading = document.querySelector('#cart-loaded'),
        btnEditCart;
    
    if (container == null) return false;
    
    event.prop.then(response => {
        const {uid} = response.userData;
        
        container.innerHTML = '';
        container.textContext = '';
        loading.hidden = false;
        
        let viewContext = async (status) => {
            let cart = false;
            
            await model().getCartValue(uid, value => {
                loading.hidden = true;
                cart = true;
                container.innerHTML += viewCart(value);
            });
            
            setTimeout(() => status(cart), 1000);
        };
        
        setTimeout(() => {
            viewContext(status => {
                if (status) {
                    let btnMinus = document.querySelectorAll('.minus-cart-value'),
                        btnPlus = document.querySelectorAll('.plus-cart-value'),
                        btnDelete = document.querySelectorAll('.btn-delete-cart');
                    let i = 0;
                    
                    while(i < parseInt(btnMinus.length)) {
                        btnMinus[i].addEventListener('click', function() {
                            let value = parseInt(this.parentElement.querySelector('input').value);
                            this.parentElement.querySelector('input').value = value - 1;
                            
                            if (value <= 0) {
                                this.parentElement.querySelector('input').value = 0;
                            }
                        });
                        
                        btnMinus[i].parentElement.querySelector('input').addEventListener('keydown', function(){
                            if (this.value.length > 6) {
                                this.value = this.value.slice(0, 6);
                            }
                        });
                        
                        btnPlus[i].addEventListener('click', function() {
                            let value = parseInt(this.parentElement.querySelector('input').value);
                            this.parentElement.querySelector('input').value = value + 1;
                            
                            if (value < 0) {
                                this.parentElement.querySelector('input').value = 0;
                            }
                        });
                        
                        i++;
                    }
                    // delete cart
                    btnDelete.forEach(item => {
                        item.addEventListener('click', function() {
                            let target = this.dataset.target;
                            
                            model().deleteCart(target, res => {
                                if (res) {
                                    getCartValue(element, event);
                                    getCartLength('.view-cart-length', event);
                                }
                            });
                        });
                    });
                }
                else {
                    loading.hidden = true;
                    container.innerHTML = `
                        <div class="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-small uk-padding-small">
                            <b>Anda belum berbelanja</b>,
                            <a href="${getOrigin('/id').pathname}/home/index.html">lihat-lihat produk</a>
                        </div>
                    `;
                }
            });
        }, 1000);
    });
};

const editCartValue = () => {
    
};

const viewCart = item => {
    return `
        <div class="uk-card uk-card-default uk-width-1-2@m uk-margin">
            <div class="uk-card-body uk-padding-remove">
                <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-auto uk-margin-small-left">
                        <figure class="uk-cover-container uk-border-circle"
                            style="width: 120px; height: 120px;">
                        <img src="${item.productPhoto}"
                            alt=""
                            uk-cover>
                            <canvas width="600" height="400"></canvas>
                        </figure>
                    </div>
                    <div class="uk-width-expand">
                        <h3 class="uk-card-title">${item.productName}</h3>
                        <form>
                            <div class="uk-margin">
                                <div class="uk-inline">
                                    <a class="uk-form-icon minus-cart-value" uk-icon="icon: minus; ratio: 0.7"></a>
                                    <input type="number" class="uk-input uk-form-small uk-form-width-small uk-border-rounded" value="${item.totalOrder}">
                                    <a class="uk-form-icon uk-form-icon-flip plus-cart-value" uk-icon="icon: plus; ratio: 0.7"></a>
                                </div>
                            </div>
                            <div class="uk-margin uk-margin-small-right uk-flex uk-flex-between">
                                <button type="button"
                                    class="uk-button uk-button-small uk-border-rounded uk-text-capitalize"
                                    style="background: #d4ec0e; color: #333">update</button>
                                <button type="button"
                                    class="uk-button uk-button-small uk-border-rounded uk-text-capitalize"
                                    style="background: #13c057; color: #f2f2f2">bayar</button>
                                <button type="button"
                                    class="uk-button uk-button-small uk-border-rounded uk-button-danger uk-text-capitalize btn-delete-cart"
                                    data-target="${item.productId}">hapus</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};

module.exports = {getCartLength, getCartValue};