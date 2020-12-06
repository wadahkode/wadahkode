import * as firebase from 'firebase/app';

class StoreModel {
    constructor(table) {
        this.table = table;
        this.ref = firebase.database().ref(table);
    }
}

export default StoreModel;