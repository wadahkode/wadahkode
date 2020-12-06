import * as firebase from 'firebase/app';

class CartModel {
    constructor(table) {
        this.ref = firebase.database().ref(table);
        this.cartKey = this.ref.push().key;
        this.table = table;
    }
    
    deleteCart(target, callback) {
        let ref = firebase.database().ref(`${this.table}/${target}`);
        
        if (ref.remove()) {
            callback(true);
        }
    }
    
    getCartLength(uid, callback, count=0) {
        this.ref.on('child_added', snapshot => count++);
        this.ref.once('value', snapshot => {
            if (snapshot.numChildren() == count) {
                snapshot.forEach(item => {
                    if (item.val().buyerId === uid) {
                        callback(snapshot.numChildren());
                    }
                });
            }
        });
    }
    
    getCartValue(uid, callback, count=0) {
        this.ref.on('child_added', snapshot => count++);
        this.ref.once('value', snapshot => {
            if (snapshot.numChildren() == count) {
                snapshot.forEach(item => {
                    if (item.val().buyerId === uid) {
                        callback(item.val());
                    }
                });
            }
        });
    }
    
    getCartByKey(key) {
        let ref = firebase.database().ref(`${this.table}/${key}`),
            response;
        
        ref.on('value', snapshot => {
            if (snapshot.exists()) {
                response = snapshot.val();
            } else {
                response = null;
            }
        });
        
        return response;
    }
    
    async saveToCart(product, callback) {
        let ref = firebase.database().ref(`${this.table}/${product.productId}`);
        
        ref.once('value').then(snapshot => {
            if (snapshot.exists()) {
                let totalOrder = Math.floor(snapshot.val().totalOrder) + 1,
                    totalPrice = Math.floor(snapshot.val().totalPrice + (snapshot.val().productPrices + snapshot.val().productPPN));
                    
                ref.update({
                    "totalOrder": totalOrder,
                    "totalPrice": totalPrice
                    
                }, error => callback(error));
                
            } else {
                ref.set(product, error => callback(error));
            }
        });
    }
}

export default CartModel;