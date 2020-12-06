import * as firebase from 'firebase/app';

class UserModel {
    constructor(table) {
        this.ref = firebase.database().ref('users');
        this.table = table;
    }
    
    getInfo() {
        return new Promise(resolve => {
            firebase.auth().onAuthStateChanged(user => resolve(user));
        });
    }
    
    getDetailInfo(uid) {
        var ref = firebase.database().ref(this.table + `/${uid}`);
        
        return new Promise(resolve => {
            ref.on('value', snapshot => resolve(snapshot));
        });
    }
}

export default UserModel;