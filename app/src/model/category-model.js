import * as firebase from 'firebase/app';
import {isNull} from 'lodash';

class CategoryModel {
    constructor(table) {
        this.ref = firebase.database().ref(table);
        this.columns = [];
    }
    
    setUp() {
        this.ref.on('value', snapshot => {
            if (isNull(snapshot.val())) {
                return this.ref.set(this.columns, error => {
                    if (error) {
                        console.log(error);
                    } else {
                        alert("Kategori berhasil ditambahkan.");
                    }
                });
            } else {
                return this.ref.set(this.columns, error => {
                    if (error) {
                        console.log(error);
                    } else {
                        alert("Kategori berhasil ditambahkan.");
                    }
                });
            }
        });
    }
    
    drop() {
        // delete
    }
}

export default CategoryModel;