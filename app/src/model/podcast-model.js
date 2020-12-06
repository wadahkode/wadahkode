import * as firebase from 'firebase/app';
import UIkit from 'uikit';

class PodcastModel {
    constructor(table) {
        this.ref = firebase.database().ref(table);
        this.podcastKey = this.ref.push().key;
        this.save = firebase.database().ref(table + '/' + this.podcastKey);
    }
    
    async getPodcast(callback) {
        await this.ref.on('value', snapshot => {
            //var key = Object.keys(snapshot.val());
            snapshot.forEach(item => {
                callback(item.val());
            });
        });
    }
    
    async savePodcast(data) {
        await this.save.set(data, error => {
            if (error) {
                UIkit.notification('<span uk-icon="icon: warning"></span>&nbsp;' + error.message, {
                    status: 'warning',
                    timeout: 2000
                });
                
                return false;
            } else {
                UIkit.notification('<span uk-icon="icon: check"></span>&nbsp;artikel berhasil ditambahkan dan dipajang.', {
                    status: 'success',
                    timeout: 2000
                });
                
                return true;
            }
        });
    }
}

export default PodcastModel;