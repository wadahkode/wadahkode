import UserModel from '../model/user-model';
import {isNull,isUndefined} from 'lodash';
import {getOrigin} from '../config/ghpages';
/**
 * Article comment
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.5
 */
export const model = () => {
    const ArticleModel = require('../model/article-model').default;
    
    return new ArticleModel('article');
};

export const User = () => {
    return new UserModel('users');
};

export const getCommentsArticle = (article,key) => {
    return article.getCommentsArticle(key);
};

export const getTotalCommentsArticle = (article,key) => {
    return article.getTotalCommentsArticle(key);
};

export const getSubTotalCommentsArticle = (article,key, prefix) => {
    return article.getSubTotalCommentsArticle(key, prefix);
};

export const getUserAuthBeforeSendComment = (url) => {
    let btnComment = document.querySelectorAll('.quick-btn-comment');
    
    btnComment.forEach(item => {
        item.addEventListener('click', () => {
            return getUserInfoIsComment().then(user => {
                if (isNull(user)) {
                    sessionStorage.setItem('user-not-auth', 'Anda harus login sebelum melanjutkan!');
                    location.href = url;
                    
                    return false;
                }
            });
        });
    });
};
export const getUserAuthBeforeSendLike = (url) => {
    let btnCommentLike = document.querySelectorAll('.btn-comment-like');
    
    btnCommentLike.forEach(item => {
        item.addEventListener('click', () => {
            return getUserInfoIsComment().then(user => {
                if (isNull(user)) {
                    sessionStorage.setItem('user-not-auth', 'Anda harus login sebelum melanjutkan!');
                    location.href = url;
                    
                    return false;
                }
            });
        });
    });
};

export const getUserInfoIsComment = () => {
    return User().getInfo().then(response => response);
};

export const sendingComment = (c,k,i) => {
    return model().sendComment(c,k,i);
};

function viewComment(comment, articleKey) {
    let arr = getCommentByKey(comment),
        text = `<ul class="uk-comment-list @uk-background-default">`,
        ckey = Object.keys(comment.hook);

    for(let i = 0; i < arr.length; i++) {
        if (typeof arr[i] != 'object') continue;

        let first = getCommentByKey(arr[i]);

        for (let i = 0; i < first.length; i++) {
            text += /**HTML*/`
                <li>
                    <article class="uk-comment @uk-background-muted uk-visible-toggle uk-padding-remove" tabindex="-1" style="border-color: transparent">
                        <header class="uk-comment-header uk-position-relative">
                            <div class="uk-grid-medium uk-flex-middle" uk-grid>
                                <div class="uk-width-auto uk-padding-medium-right uk-margin-medium-right">
                                    <img class="uk-comment-avatar uk-border-circle uk-position-top" src="../assets/avatar/me.jpg" width="36" height="36" alt="">
                                </div>
                                <div class="uk-width-expand uk-background-muted uk-border-rounded uk-margin-small-left uk-padding-remove" style="border: 1px solid #e2e2e2;">
                                    <h4 class="uk-comment-title uk-margin-small-left uk-margin-remove-top"><a class="uk-link-reset" href="#">${first[i].idName}</a></h4>
                                    <!--p class="uk-comment-meta uk-margin-small-left uk-margin-remove-top"><a class="uk-link-reset" href="#">12 days ago</a></p-->
                                    <p class="uk-margin-small-left uk-margin-remove-top uk-margin-remove-bottom">${first[i].content}</p>
                                    <div class="uk-comment-footer uk-margin-small-left uk-margin-remove-top">
                                        <div class="uk-child-width-1-2 uk-margin-remove-top uk-margin-remove-bottom" uk-grid>
                                            <div data-target="${ckey[i]}" class="total-like" hidden></div>
                                            <div data-target="${ckey[i]}" class="total-comments uk-text-left uk-comment-meta" ${!isUndefined(getSubTotalCommentsArticle(model(), articleKey, ckey[i])) ? '' : 'hidden'}>${getSubTotalCommentsArticle(model(), articleKey, ckey[i])}&nbsp;komentar</div>
                                        </div>
                                        <div class="@uk-child-width-1-2 uk-margin-remove-top">
                                            <a class="@uk-icon-button btn-comment-like uk-text-meta uk-text-lowercase uk-margin-small-right uk-link-reset" data-target="${ckey[i]}">
                                                <span class="heart-dislike" uk-icon="icon: heart; ratio: 0.7"></span>
                                                <span class="label-like">suka</span>
                                            </a>
                                            <a class="uk-text-meta uk-text-lowercase uk-link-reset">
                                                <span uk-icon="icon: reply; ratio: 0.7"></span>
                                                <span>balas</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--div class="uk-position-top-right uk-position-small uk-hidden-hover"><a class="uk-link-muted" href="#">Reply</a></div-->
                        </header>
                    </article>
                    ${first[i].hasOwnProperty('children') ? createCommentNested(first[i].children) : ''}
                </li>
            `;
        }
    }
    text += `</ul>`;

    return text;
}

function getCommentByKey(data) {
    return Object.keys(data).map(id => data[id]);
}

function createCommentNested(data, articleKey) {
    let arr = getCommentByKey(data),
        text = `<ul class="uk-comment-list">`;
        
    for (let i = 0; i < arr.length; i++) {
        text += `
            <li>
                <article class="uk-comment uk-visible-toggle uk-padding-remove @uk-border-rounded uk-margin-left" tabindex="-1" style="border-color: transparent">
                    <header class="uk-comment-header uk-position-relative">
                        <div class="uk-grid-medium uk-flex-middle" uk-grid>
                            <div class="uk-width-auto uk-padding-medium-right uk-margin-medium-right">
                                <img class="uk-comment-avatar uk-border-circle uk-position-top" src="../assets/avatar/me2.jpg" width="36" height="36" alt="">
                            </div>
                            <div class="uk-width-expand uk-background-default uk-border-rounded uk-margin-small-left uk-padding-remove" style="border: 1px solid #e2e2e2;">
                                <h4 class="uk-comment-title uk-margin-small-left uk-margin-remove-top"><a class="uk-link-reset" href="#">${arr[i].idName}</a></h4>
                                <!--p class="uk-comment-meta uk-margin-small-left uk-margin-remove-top"><a class="uk-link-reset" href="#">12 days ago</a></p-->
                                <p class="uk-margin-small-left uk-margin-remove-top uk-margin-remove-bottom">${arr[i].content}</p>
                            </div>
                        </div>
                    </header>
                </article>

                ${arr[i].hasOwnProperty('children') ? createCommentNested(arr[i].children) : ''}
            </li>
        `;
    }

    text += `</ul>`;

    return text;
}

export {viewComment};