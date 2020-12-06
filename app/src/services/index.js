import * as firebase from 'firebase/app';
import {firebaseConfig} from '../config/firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

/**
 *--------------------------*
 | # |       Services       |
 *--------------------------*
 | 1 | Router Web           |
 | 2 | Firebase setting     |
 | 3 | Detection Connected  |
 *--------------------------*
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version v1.085
 */
export const bind = (config) => {
    localStorage.setItem('homepage', (config.env == 'development') ? config.development.forUser : config.production.forUser);
    
    require('../routes/web');
    
    var containerMessage = document.querySelector('.container-message');
    
    if (sessionStorage.getItem('user-not-auth') && location.pathname.match('login')) {
       var message = window.sessionStorage.getItem('user-not-auth');
       containerMessage.innerHTML = message;
       containerMessage.setAttribute("uk-alert","");
       containerMessage.classList.add('uk-alert');
       containerMessage.classList.add('uk-alert-warning');
    } else {
        sessionStorage.removeItem('user-not-auth');
    }
};

export const setCloudService = (prepend, callback) => {
    if (!prepend) {
        return callback(false);
    }
    firebase.initializeApp(firebaseConfig);
    
    return callback(true);
};

export const isConnected = (callback) => {
    return firebase.database().ref('/.info/connected')
        .on('value', snap => {
            setTimeout(function() {
                if (snap.val() === true) {
                    callback(true);
                }
            }, 3000);
        });
};