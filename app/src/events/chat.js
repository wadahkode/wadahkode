const ChatModel = require('../model/chat-model').default;

/**
 * Chat room
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.3
 */
let Chat = {};

Chat.model = "";

Chat.getRoom = function(){
    let ref = this.model.ref;
    
    console.log(ref.child());
};

Chat.setModel = function(table){
    this.model = new ChatModel(table);
    
    return this.model;
};

export {Chat};

