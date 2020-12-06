//import {isNull} from 'lodash';
//import * as Cookie from '../services/cookie';

export const changeIconLike = (icon) => {
    if (!icon.classList.contains('heart-like')) {
        icon.classList.add('heart-like');
        
        return true;
    } else {
        icon.classList.remove('heart-like');
        
        return false;
    }
};

export const changeLabelLike = (label, statusIcon) => {
    if (statusIcon) {
        label.innerHTML = 'tidak suka';
        
        return statusIcon;
    } else {
        label.innerHTML = 'suka';
        
        return statusIcon;
    }
};

export const stagedLike = (article, key) => {
    let like = article.getLike(key);
    like = parseInt(like.total) + 1;
    localStorage.removeItem('dislike' + key);
    localStorage.setItem('like' + key, like);
    //Cookie.deleteCookieByName('dislike' + key, like);
    //Cookie.setCookie('like' + key, like, 30);
    article.setLike(key, like);
};
export const unstagedLike = (article, key) => {
    let like = article.getLike(key);
    like = (like.total < 1) ? parseInt(like.total) : parseInt(like.total) - 1;
    localStorage.removeItem('like' + key);
    localStorage.setItem('dislike' + key, like);
    //Cookie.deleteCookieByName('like' + key, like);
    //Cookie.setCookie('dislike' + key, like, 30);
    article.setLike(key, like);
};

function changeLike(article, data) {
    let buttonLike = document.querySelectorAll('.btn-like'),
        iconLike = document.querySelectorAll('.heart-dislike'),
        labelLike = document.querySelectorAll('.label-like'),
        totalLike = document.querySelectorAll('.total-like');
    
    let articleKey = Object.keys(data.val());
    
    buttonLike.forEach((btn,key) => {
        btn.addEventListener('click', function(e){
            if (articleKey.includes(this.dataset.target)) {
                let statusIcon = changeIconLike(iconLike[key]);
                let statusLabel = changeLabelLike(labelLike[key], statusIcon);
                
                if (statusLabel) {
                    stagedLike(article, this.dataset.target);
                } else {
                    unstagedLike(article, this.dataset.target);
                }
            }
            e.preventDefault();
        });
        
        let refreshLike = setInterval(() => {
            let dataset = totalLike[key].dataset.target;
            if (articleKey.includes(dataset) && localStorage.getItem('like' + dataset)) {
                totalLike[key].innerHTML = article.getLike(dataset).total + '&nbsp;suka';
                totalLike[key].hidden = false;
                
            } else if (articleKey.includes(dataset) && localStorage.getItem('dislike' + dataset)) {
                totalLike[key].innerHTML = article.getLike(dataset).total + '&nbsp;suka';
                
                if (article.getLike(dataset).total < 1) {
                    totalLike[key].hidden = true;
                } else {
                    totalLike[key].hidden = false;
                }
                
            } else {
                if (article.getLike(dataset).total < 1) {
                    totalLike[key].hidden = true;
                } else {
                    totalLike[key].hidden = false;
                }
            }
        }, 10);
        
        // icon and label
        let dataset = btn.dataset.target;
        if (articleKey.includes(dataset) && localStorage.getItem('like' + dataset)) {
            let statusIcon = changeIconLike(iconLike[key]);
            
            if (statusIcon) {
                return changeLabelLike(labelLike[key], statusIcon);
            }
        }
    });
}

export {changeLike};