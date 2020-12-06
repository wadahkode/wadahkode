import * as firebase from 'firebase';

/**
 * Storage Bucket
 * 
 * Menyimpan file ke cloud storage bucket.
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.95
 */
class StorageBucket {
    constructor(table, prepend) {
        if (prepend) {
            this.ref = firebase.storage().ref(table);
        } else {
            this.table = table;
        }
    }
    
    save(fileName, options={}) {
        
    }
    
    find() {
        
    }
}