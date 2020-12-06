import * as firebase from 'firebase/app';
import UIkit from 'uikit';
import {isNull,isObject} from 'lodash';
import UserModel from './user-model';

class ArticleModel {
    constructor(table) {
        this.ref = firebase.database().ref(table);
        this.table = table;
        this.articleKey = this.ref.push().key;
        this.save = firebase.database().ref(table + '/' + this.articleKey);
        this.auth = firebase.auth().currentUser;
    }
    
    getArticle(count=0) {
        return new Promise(resolve => {
            this.ref.orderByChild('like').on('child_added', snapshot => count++);
            return this.ref.orderByChild('like').once('value', snapshot => {
                (snapshot.numChildren() === count) && resolve(snapshot);
            });
        });
    }
    
    getArticleOrderBy(name) {
        let table = this.ref.orderByChild(name);
        
        return new Promise(resolve => table.startAt().on('value', snapshot => resolve(snapshot)));
    }
    
    getCommentsArticle(key) {
        var comments = firebase.database().ref(this.table + '/' + key + '/comments'),
            response;
            
        comments.on('value', snapshot => {
            if (snapshot.exists()) {
                response = snapshot;
            } else {
                response = null;
            }
        });
        return response;
    }
    
    getTotalCommentsArticle(key) {
        var comments = firebase.database().ref(this.table + '/' + key + '/comments/hook'),
            response;
            
        comments.on('value', snapshot => {
            if (snapshot.exists()) {
                response = Object.keys(snapshot.val()).length;
            } else {
                response = null;
            }
        });
        return response;
    }
    
    getSubTotalCommentsArticle(key, prefix) {
        var comments = firebase.database().ref(this.table + '/' + key + '/comments/hook/' + prefix),
            response;
            
        comments.on('value', snapshot => {
            if (snapshot.exists()) {
                response = snapshot.val().total;
            } else {
                response = null;
            }
        });
        return response;
    }
    
    getLike(key) {
        var like = firebase.database().ref(this.table + '/' + key + '/like'),
            response;
        
        like.on('value', snapshot => {
            if (snapshot.exists()) {
                response = snapshot.val();
            } else {
                response = 0;
            }
        });
        
        return response;
    }
    
    getShare(key) {
        var share = firebase.database().ref(this.table + '/' + key + '/share'),
            response;
        
        share.on('value', snapshot => response = snapshot.exists() ? snapshot.val() : 0);
        
        return response;
    }
    
    setLike(key, total) {
        var like = firebase.database().ref(this.table + '/' + key + '/like');
        
        like.update({
            "total": total
        });
    }
    
    setShare(key, total) {
        var share = firebase.database().ref(this.table + '/' + key + '/share');
        
        share.update({
            "total": total
        });
    }
    
    async saveArticle(data) {
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
    
    async sendComment(c,key,id) {
        var comment = firebase.database().ref(this.table + `/${key}/comments/hook/${this.articleKey}`),
            user = new UserModel('users');
            
        return await this.saveComment(c,key,id,user,comment);
    }
    
    saveComment(c,key,id,user,comment) {
        let response;
        
        return new Promise((resolve,reject) => {
        user.getDetailInfo(id).then(snapshot => {
            let email = snapshot.val().email.toString().split('@')[0];
            
            c.textContext = "";
            
            comment.set({
                idName: email,
                content: c.value
            }, error => {
                if (error) {
                    //
                    reject(false);
                } else {
                    c.textContext = "";
                    c.value = "";
                    resolve(true);
                }
            });
        });
            
        });
    }
    
    off() {
        this.ref.off();
    }
}

export default ArticleModel;