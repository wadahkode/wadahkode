import * as firebase from 'firebase/app';
import Category from './category-model';
import UIkit from 'uikit';

class ProductModel {
    constructor(table) {
        this.table = table;
        this.ref = firebase.database().ref(table);
        this.productKey = this.ref.push().key;
        this.save = firebase.database().ref(table + '/' + this.productKey);
    }
    
    getProduct(callback, count=0) {
        this.ref.on('child_added', snapshot => {
            count++;
            //console.log(this.count);
        });
        
        this.ref.once('value').then(snapshot => {
            if (snapshot.numChildren() === count) {
                snapshot.forEach(item => callback(item.val()));
            }
        });
    }
    
    getProductByKey(key) {
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
    
    getProductByLimit(callback, count=0) {
        this.ref.limitToFirst(count).on('value', snapshot => callback(snapshot));
    }
    
    getProductCategory(callback) {
        var category = new Category('category');
        category.ref.on('value', snapshot => {
            snapshot.forEach(item => {
                callback(item.val());
            });
        });
    }
    
    saveProduct(data) {
        this.save.set(data, error => {
            if (error) {
                alert(error);
            } else {
                UIkit.notification('<span uk-icon="icon: check"></span>&nbsp;Produk berhasil dipajang.', {
                    status: 'success',
                    timeout: 2000
                });
                //alert("Produk berhasil dipajang.");
            }
        });
    }
    
    updateProduct(stock, key) {
        const ref = firebase.database().ref(`${this.table}/${key}`);
        
        ref.update({
            "productStock": stock - 1
        });
    }
    
    off() {
        this.ref.off();
    }
}

export default ProductModel;