import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import {isNull, isEmpty, isObject, isUndefined} from 'lodash';
import * as firebase from 'firebase/app';
import DateFormater from '../utility/dateformater';
import * as Maker from '../utility/maker';
import * as GHPages from '../config/ghpages';

/**
 * Authenticated
 *------------------------------------------------------*
 | Administrator             | Normal User              |
 *------------------------------------------------------*
 | Login                     | Login                    |
 | Register                  | Register                 |
 | Dashboard                 | Homepage                 |
 | logout                    | logout                   |
 | setOnline                 | setOnline                |
 | password crypt (failed)   | password crypt (failed)  |
 *------------------------------------------------------*
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version v1.0.85
 */
class Authenticated {
    constructor(props) {
        this.admin = !isUndefined(props) ? 'superuser' : props.administrator;
        this.users = !isUndefined(props) ? 'normal' : props.users;
        
        let date = new DateFormater(new Date());
        this.now = date.halfTime();
        this.randomId = Maker.makeId(16);
        this.uid = "";
        this.level = '';
        this.href = window.location.href;
    }
    
    onAuthStateChanged(callback) {
        return firebase.auth().onAuthStateChanged(function(user){
            if (user) {
                return callback(user);
            } else {
                return callback(false);
            }
        });
    }
    
    checkOnDatabase(user,callback) {
        const {uid,displayName,email,emailVerified,photoURL,isAnonymous,providerData} = user;
        const users = firebase.database().ref('users/' + uid);
        this.uid = uid;
        
        this.createNewAccount(users, {
            "id": Maker.makeId(12),
            "displayName": isNull(displayName) ? this.randomId : displayName,
            "firstName": false,
            "lastName": false,
            "email": email,
            "emailVerified": emailVerified,
            "photoURL": isNull(photoURL) ? GHPages.getOrigin('/id').href + '/assets/avatar/no-image.png' : photoURL,
            "isAnonymous": isAnonymous,
            "providerData": providerData,
            // salin UID dari email yang didaftarkan ke realtime database anda.
            // jika ingin menentukan UID tersebut sebagai superuser / admin
            "level": (uid === 'Oht0jHsudug0x5QJkKiqSoiAuDe2') ? 'superuser' : 'normal',
            "remember_token": false,
            "statusOnline": "online",
            "dateOfBirth": false,
            "gender": false,
            "created_at": this.now
        })
        .then(response => callback(response))
        .catch(error => callback(error));
    }
    
    createNewAccount(users, data) {
        const subscriber = firebase.database().ref("subscriber/" + this.uid);
        
        return new Promise((resolve,reject) => {
            return users.on('value', snapshot => {
                if (isNull(snapshot.val())) {
                    subscriber.set({
                        "idUser": data.id,
                        "idFollower": false,
                        "follower": parseInt(0),
                        "following": parseInt(0),
                        "created_at": this.now,
                        "updated_at": this.now
                    });
                    users.set(data, error => {
                        if (error) {
                            UIkit.notification('<span uk-icon="icon: warning"></span>&nbsp;server not responding!', {
                                status: 'danger',
                                timeout: 3000
                            });
                            reject(error);
                        } else {
                            resolve(snapshot.val());
                        }
                    });
                }
                else {
                    resolve(snapshot.val());
                }
            });
        });
    }
    
    isAdmin(callback) {
        return this.onAuthStateChanged(user => {
            if (user) {
                if (!user.emailVerified) {
                    return callback(false);
                } else {
                    return this.checkOnDatabase(user, response => {
                        if (response.level == this.admin) {
                            return callback(true, user);
                        } else {
                            return callback(false);
                        }
                    });
                }
            } else {
                return callback(false);
            }
        });
    }
    
    isUsers(callback) {
        return this.onAuthStateChanged(user => {
            if (user) {
                if (!user.emailVerified) {
                    return callback(false);
                } else {
                    return this.checkOnDatabase(user, response => {
                        if (response.level == this.users) {
                            return callback(true, user);
                        } else {
                            return callback(false);
                        }
                    });
                }
            } else {
                return callback(false);
            }
        });
    }
    
    redirectTo(url) {
        window.location.href = url;
    }
}

const SECRET_PASSWORD = process.env.SECRET_PASSWORD || "RandomSecretLikeThis:x49cddf4849ccc9494edfdef9dd9dv";

export const login = (form, btnForm) => {
    const {email, password, customCheck} = form;
    
    return new Promise(resolve => {
        if (isEmpty(email.value)) {
            UIkit.notification("<span uk-icon=\"icon: mail;\"></span>&nbsp;email can't be empty!", {
                status: 'warning',
                timeout: 3000
            });
            
            setTimeout(function(){
                btnForm.disabled = false;
                btnForm.innerHTML = 'Login';
            }, 3000);
        } else if (isEmpty(password.value)) {
            UIkit.notification("<span uk-icon=\"icon: lock;\"></span>&nbsp;password can't be empty!", {
                status: 'warning',
                timeout: 2000
            });
            
            setTimeout(function(){
                btnForm.disabled = false;
                btnForm.innerHTML = 'Login';
            }, 3000);
        } else {
            return firebase.auth()
                .signInWithEmailAndPassword(email.value, password.value)
                .then((response) => {
                    if (!response.user.emailVerified) {
                        UIkit.notification("<span uk-icon=\"icon: warning;\"></span>&nbsp;You cannot log in before verifying your email, please check your email.", {
                            status: 'warning',
                            timeout: 2000
                        });
                        
                        setTimeout(function(){
                            btnForm.disabled = false;
                            btnForm.innerHTML = 'Login';
                        }, 3200);
                        
                        return false;
                    } else {
                        UIkit.notification("<span uk-icon=\"icon: check;\"></span>&nbsp;login is successful", {
                            status: 'success',
                            timeout: 2000
                        });
                        
                        return resolve({
                            "ok": true,
                            "email": email.value,
                            "password": password.value,
                            //"secretPassword": hashPassword,
                            //"isValidPassword": isValidPassword,
                            "uid": response.user.uid,
                            "rememberMe": customCheck.checked,
                            "idToken": response.user.getIdToken(),
                            "isLevel": response.user.level
                        });
                    }
                })
                .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = (errorCode == 'auth/user-not-found') ? 'account cannot be found, or your email has not been registered.' : error.message;
                    UIkit.notification('<span uk-icon="icon: warning"></span>&nbsp;' + errorMessage, {
                        status: (errorCode == 'auth/user-not-found') || (errorCode == 'auth/wrong-password') ? 'danger' : 'success',
                        timeout: 2000
                    });
                    setTimeout(function(){
                        btnForm.disabled = false;
                        btnForm.innerHTML = 'Login';
                    }, 3000);
                });
        }
    });
};
export const register = (form,btnForm) => {
    const {email, password, checkbox} = form;
    
    var validate = validation(email,password,checkbox,'%s can\'t be empty!');
    
    if (validate) {
        let currentUser = firebase.auth().currentUser;
        
        if (isNull(currentUser)) {
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
                .then(response => {
                    response.user.sendEmailVerification().then(() => {
                        UIkit.notification('<span uk-icon="check"></span>&nbsp;Registration is successful and email verification has been sent, please check your email.', {
                            status: 'success',
                            timeout: 3000
                        });
                    })
                    .catch(error => {
                        UIkit.notification('<span uk-icon="icon: warning"></span>&nbsp;register failed!', {
                            status: 'danger',
                            timeout: 3000
                        });
                    });
                })
                .catch(error => {
                    let errorCode = error.code,
                        errorMessage = error.message;
                    
                    console.log(error.code);
                    UIkit.notification('<span uk-icon="icon: warning"></span>&nbsp;' + errorMessage, {
                        status: ((errorCode == 'auth/weak-password') || (errorCode == 'auth/email-already-in-use') ? 'warning' : 'danger'),
                        timeout: 3000
                    });
                });
        }
        else {
            //
        }
    }
    setTimeout(function() {
        btnForm.disabled = false;
        btnForm.innerHTML = "Register";
    }, 3000);
};
export const rememberMe = (uid,token) => {
    const users = firebase.database().ref('users/' + uid);
    
    return users.update({
        "remember_token": token
    });
};
export const setOnline = uid => {
    const users = firebase.database().ref('users/' + uid);
    
    return users.update({
        "statusOnline": "online"
    });
};
export const logout = (uid) => {
    let users = firebase.database().ref('users/' + uid);
    users.update({
        "remember_token": false,
        "statusOnline": "offline",
    });
    return firebase.auth().signOut()
        .then(() => {
            window.location.href = '../index.html';
        }).catch(error => {
            UIkit.notification('<span uk-icon="icon: warning;"></span>&nbsp;' + error.message, {
                status: 'warning',
                timeout: 3000
            });
        });
};
// belum digunakan
export const passwordHash = password => {
    return Crypt(SECRET_PASSWORD, password);
};
// belum digunakan
export const passwordVerify = (cleanPassword, hashPassword) => {
    return Compare(SECRET_PASSWORD, cleanPassword, hashPassword);
};
// baru digunakan untuk percobaan pada form register
export const validation = (...input) => {
    if (isObject(input)) {
        let [email,password,checkbox,message] = input;
        
        if (isEmpty(email.value)) {
            message = message.replace("%s", email.type);
            UIkit.notification('<span uk-icon="icon: mail"></span>&nbsp;' + message, {
                status: 'warning',
                timeout: 2000
            });
        }
        else if (isEmpty(password.value)) {
            message = message.replace("%s", password.type);
            UIkit.notification('<span uk-icon="icon: lock"></span>&nbsp;' + message, {
                status: 'warning',
                timeout: 2000
            });
        }
        else if (!checkbox.checked) {
            UIkit.notification('<span uk-icon="icon: warning"></span>&nbsp;Please accept the terms and conditions, if you want to create a new account!', {
                status: 'warning',
                timeout: 2000
            });
        } else {
            return true;
        }
    }
};

export default Authenticated;




