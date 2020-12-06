import * as firebase from 'firebase/app';

class ChatModel {
    constructor(table) {
        this.table = table;
        this.ref = firebase.database().ref(table);
    }
}

export default ChatModel;