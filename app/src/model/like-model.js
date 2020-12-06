import * as firebase from 'firebase/app';

class LikeModel {
    constructor(table) {
        this.table = table;
        this.ref = firebase.database().ref(table);
    }
}

export default LikeModel;