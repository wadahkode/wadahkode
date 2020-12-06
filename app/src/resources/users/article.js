import ArticleModel from '../../model/article-model';
import * as URL from '../../utility/url';
import DateFormater from '../../utility/dateformater';
import * as GHPages from '../../config/ghpages';
//import * as Pagination from '../events/pagination';
import {changeLike} from '../../events/liked';
import {getCommentsArticle, getTotalCommentsArticle, getSubTotalCommentsArticle, getUserAuthBeforeSendComment, User, sendingComment, viewComment} from '../../events/comments';
import {shareToMedia} from '../../events/share';
import {isNull,isUndefined,isObject,isArray,isEmpty} from 'lodash';
import * as Cookie from '../../services/cookie';
import Memories from '../../utility/memories';

function model() {
    return new ArticleModel('article');
}

function getArticle(id, pattern) {
    let container = document.getElementById(id),
        total = [],
        articleText = "";
    
    if (isNull(container)) return false;
    else if (!isNull(container)) {
        container.innerHTML = `
            <div class="uk-flex uk-flex-center uk-flex-middle uk-height-large">
                <div class="spinner spinner-medium"></div>
            </div>
        `;
    }
    
    model().getArticleOrderBy('like/total').then(snapshot => {
        // deteksi url
        snapshot.forEach(item => {
            item = item.val();
            total.push(item);
            
            if (total.length < 1) {
                articleText += 'tidak ada artikel';
            }
            articleText += viewArticle(item);
            
            container.innerHTML = articleText;
        });
        
        changeLike(model(), snapshot);
        getToolbarArticle(snapshot);
        //decodeLightboxCaption();
    });
}

function getToolbarArticle(article) {
    let readhide = document.querySelectorAll('.read-hide');
    let readmore = document.querySelectorAll('.read-more');
    
    readmore.forEach((more,key) => {
        let height, moreHeight;
        window.addEventListener('scroll', function(event){
            height = Math.floor(event.target.scrollingElement.scrollTop);
        });
        
        more.addEventListener('click', function(){
            moreHeight = height;
        });
        
        readhide[key].addEventListener('click', function(){
            window.scrollTo(0, moreHeight);
        });
    });
    
    let sendComment = document.querySelectorAll('form'),
        postTime = document.querySelectorAll('time'),
        totalComments = document.querySelectorAll('.total-comments'),
        container = document.querySelectorAll('.container-comments');
    
    postTime.forEach(item => {
        item.innerHTML = '';
        let start = new Date(item.getAttribute('datetime').toString().replace(',',''));
        let refresh = setInterval(async () => {
            //item.innerHTML = setCurrentAt(item.getAttribute('datetime').toString().replace(',',''));
            item.innerHTML = `<span uk-icon="icon: world; ratio: 0.7"></span>&nbsp;` + await getMemories(start, new Date());
        }, 1000);
    });
    
    article.forEach((item,key) => {
        var {comments, share, articleTitle, articleUrl, articlePhoto, articleKey} = item.val();
        
        let btnComment = document.querySelectorAll('.btn-comment'),
            container = document.querySelectorAll('.container-comments');
            //commentKey = Object.values(comments).length;
        
        if (!isUndefined(comments)) {
            container.forEach(c => {
                if (c.parentElement.id === `comments-${articleKey}`) {
                    c.textContext = "";
                    c.innerHTML = viewComment(comments,articleKey);
                }
            });
        }
        shareToMedia(articleUrl, "website", "wadahkode", articleTitle, articlePhoto);
    });
    
    User().getInfo().then(user => {
        if (isNull(sendComment)) return false;
        
        sendComment.forEach((form,key) => {
            if (!isNull(form.querySelector('.quick-btn-comment')) && !isNull(form.querySelector('textarea'))) {
                let qbc = form.querySelector('.quick-btn-comment'),
                    txt = form.querySelector('textarea');
                
                qbc.addEventListener('click',event => {
                    event.preventDefault();
                    if (isNull(txt.value) || isEmpty(txt.value)) return false;
                    
                    let saveComment = sendingComment(txt, form.getAttribute('data-id'), user.uid);
                    
                    saveComment.then(status => {
                        if (status) {
                            model().getArticleOrderBy('like/total').then(snapshot => {
                                snapshot.forEach(item => {
                                    const {comments,articleKey} = item.val();
                                    
                                    if (!isUndefined(comments)) {
                                        container.forEach(c => {
                                            if (c.parentElement.id === `comments-${articleKey}`) {
                                                c.textContext = "";
                                                c.innerHTML = viewComment(comments, articleKey);
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    })
                    .catch(error => {
                        //
                    });
                });
            }
        });
    });
    
    let refresh = setInterval(() => {
        totalComments.forEach(total => {
            if (Object.keys(article.val()).includes(total.dataset.target)) {
                total.textContext = "";
                total.innerHTML = isNull(getTotalCommentsArticle(model(), total.dataset.target)) ? '' : getTotalCommentsArticle(model(), total.dataset.target) + '&nbsp;komentar';
            }
        });
    });
}

function readMoreWithoutRedirect(str, start, end, key) {
    if (str.length > end) {
        return `
            <div>
                <div class="toggle-${key}" hidden>
                    <span>${str}</span>
                    <a class="uk-button uk-button-link uk-text-capitalize read-hide" uk-toggle="target: .toggle-${key}">Sembunyikan kembali</a>
                </div>
                <div class="toggle-${key}">
                    <span>${str.substring(start,end)}...</span>
                    <a class="uk-button uk-button-link uk-text-capitalize read-more" uk-toggle="target: .toggle-${key};">tampilkan semuanya</a>
                </div>
            </div>
        `;
    } else {
        return `<div>${str}</div>`;
    }
}

function viewArticle(item) {
    return `
        <div class="uk-card uk-card-default uk-margin-bottom">
            <div class="uk-card-header uk-padding-small">
                <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-auto">
                        <img class="uk-border-circle" width="64" height="64" src="${item.photoAuthor}">
                    </div>
                    <div class="uk-width-expand">
                        <h3 class="uk-card-title uk-margin-remove-bottom">${item.author.replace(/@.*/, '').split('.').join(' ')}</h3>
                        <p class="uk-text-meta uk-margin-remove-top"><time datetime="${item.updated_at}" class="uk-flex uk-flex-middle"></time></p>
                    </div>
                </div>
            </div>
            <div class="uk-card-body uk-padding-remove">
                <div uk-lightbox>
                    <a href="${item.articlePhoto}" class="uk-inline uk-cover-container" data-id="${item.articleKey}" data-type="image">
                        <img src="${item.articlePhoto}" class="uk-height-*" alt="" uk-cover/>
                        <canvas width="600" height="400"></canvas>
                    </a>
                </div>
                <!--div class="uk-flex uk-flex-column">
                    <a href="${item.articleUrl}" class="uk-link-reset"><b class="uk-card-title uk-text-capitalize">${item.articleTitle}</b></a>
                    <b class="">@by ${item.author} pada ${item.created_at}</b>
                </div-->
                <div class="uk-padding-small">
                    ${readMoreWithoutRedirect(item.articleContent, 0, 100, item.articleKey)}
                </div>
            </div>
            <div class="uk-card-footer uk-margin-remove-top uk-padding-small toolbar">
                <div class="uk-child-width-1-3 uk-margin-remove-top" uk-grid>
                    <div data-target="${item.articleKey}" class="total-like" hidden>${isObject(item.like) ? item.like.total : 0}&nbsp;suka</div>
                    <div data-target="${item.articleKey}" class="total-comments uk-text-left"></div>
                    <div data-target="${item.articleKey}" class="uk-text-right total-share" hidden></div>
                </div>
                <div class="uk-child-width-1-3 uk-margin-small-top" uk-grid>
                    <div>
                        <a class="@uk-icon-button btn-like uk-link-reset" data-target="${item.articleKey}">
                            <span class="heart-dislike" uk-icon="icon: heart; ratio: 1"></span>
                            <span class="label-like">suka</span>
                        </a>
                    </div>
                    <a class="uk-link-reset btn-comment" uk-toggle="target: #comments-${item.articleKey}; animation: uk-animation-fade">
                        <span uk-icon="icon: comments; ratio: 1"></span>
                        <span>&nbsp;komentar</span>
                    </a>
                    <a class="uk-link-reset uk-text-right" uk-toggle="target: #share-${item.articleKey}">
                        <span uk-icon="icon: forward; ratio: 1"></span>
                        <span>&nbsp;bagikan</span>
                    </a>
                    <div id="share-${item.articleKey}" uk-modal>
                        <div class="uk-modal-dialog uk-modal-body uk-position-bottom uk-flex uk-flex-center uk-flex-middle uk-flex-between uk-flex-wrap">
                            <div class="fb-share-button" data-href="https://developers.facebook.com/docs/plugins/" data-layout="box_count">
                                <a class="btn-share-facebook uk-text-center uk-link-reset uk-flex uk-flex-center uk-flex-column uk-flex-wrap">
                                    <span uk-icon="icon: facebook; ratio: 1.5"></span>
                                    <span>Facebook</span>
                                </a>
                            </div>
                            <div>
                                <a target="_blank" class="btn-share-whatsapp uk-text-center uk-link-reset uk-flex uk-flex-center uk-flex-column uk-flex-wrap">
                                    <span uk-icon="icon: whatsapp; ratio: 1.5"></span>
                                    <span>Whatsapp</span>
                                </a>
                            </div>
                            <div>
                                <a target="_blank" class="btn-share-twitter uk-text-center uk-link-reset uk-flex uk-flex-center uk-flex-column uk-flex-wrap">
                                    <span uk-icon="icon: twitter; ratio: 1.5"></span>
                                    <span>Twitter</span>
                                </a>
                            </div>
                            <div>
                                <a data-href="${item.articleUrl}" class="btn-copy-url uk-text-center uk-link-reset uk-flex uk-flex-center uk-flex-column uk-flex-wrap">
                                    <span uk-icon="icon: copy; ratio: 1.5"></span>
                                    <span><input class="copied" value="${item.articleUrl}" hidden></span>
                                    <span class="copied-message">Salin</span>
                                </a>
                            </div>
                            <!--p>Maaf, masih dalam tahap pengembangan, mohon untuk menunggu...</p-->
                        </div>
                    </div>
                </div>
            </div>
            <div id="comments-${item.articleKey}" class="uk-card uk-card-body uk-margin-top uk-padding-small" hidden>
                <div class="container-comments"></div>
                <form data-id="${item.articleKey}">
                    <div class="uk-margin">
                        <textarea class="uk-textarea" rows="3" placeholder="berikan komentar anda..."></textarea>
                    </div>
                    <div class="uk-margin">
                        <button type="button" class="uk-button uk-button-small uk-button-primary quick-btn-comment">Komentar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

async function getMemories(start, end) {
    const memories = new Memories(start, end);
    
    return memories.getMemoTime();
}

// function viewComment(comment, articleKey) {
//     let arr = getCommentByKey(comment),
//         text = `<ul class="uk-comment-list uk-background-default">`,
//         ckey = Object.keys(comment.hook);

//     for(let i = 0; i < arr.length; i++) {
//         if (typeof arr[i] != 'object') continue;

//         let first = getCommentByKey(arr[i]);

//         for (let i = 0; i < first.length; i++) {
//             text += `
//                 <li>
//                     <article class="uk-comment uk-background-muted uk-visible-toggle uk-padding-small uk-border-rounded" tabindex="-1">
//                         <header class="uk-comment-header uk-position-relative">
//                             <div class="uk-grid-medium uk-flex-middle" uk-grid>
//                                 <div class="uk-width-auto">
//                                     <img class="uk-comment-avatar uk-border-circle" src="../assets/avatar/me.jpg" width="32" height="32" alt="">
//                                 </div>
//                                 <div class="uk-width-expand">
//                                     <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">mvp.dedefilaras</a></h4>
//                                     <!--p class="uk-comment-meta uk-margin-remove-top"><a class="uk-link-reset" href="#">12 days ago</a></p-->
//                                 </div>
//                             </div>
//                             <!--div class="uk-position-top-right uk-position-small uk-hidden-hover"><a class="uk-link-muted" href="#">Reply</a></div-->
//                         </header>
//                         <div class="uk-comment-body">
//                             <p>${first[i].content}</p>
//                         </div>
//                         <!--div class="uk-comment-footer">
//                             <div class="uk-child-width-1-2 uk-margin-remove-top" uk-grid>
//                                 <div data-target="${ckey[i]}" class="total-like" hidden></div>
//                                 <div data-target="${ckey[i]}" class="total-comments uk-text-left" ${!isUndefined(getSubTotalCommentsArticle(model(), articleKey, ckey[i])) ? '' : 'hidden'}>${getSubTotalCommentsArticle(model(), articleKey, ckey[i])}&nbsp;komentar</div>
//                             </div>
//                             <div class="uk-child-width-1-2 uk-margin-small-top" uk-grid>
//                                 <div>
//                                     <a class="@uk-icon-button btn-sub-like uk-link-reset" data-target="${ckey[i]}">
//                                         <span class="heart-dislike" uk-icon="icon: heart; ratio: 1"></span>
//                                         <span class="label-like">suka</span>
//                                     </a>
//                                 </div>
//                                 <div>komentar</div>
//                             </div>
//                         </div-->
//                     </article>
//                     ${first[i].hasOwnProperty('children') ? createCommentNested(first[i].children) : ''}
//                 </li>
//             `;
//         }
//     }
//     text += `</ul>`;
    
//     return text;
// }

// function getCommentByKey(data) {
//     return Object.keys(data).map(id => data[id]);
// }

// function createCommentNested(data) {
//     let arr = getCommentByKey(data),
//         text = `<ul class="uk-comment-list">`;

//     for (let i = 0; i < arr.length; i++) {
//         text += `
//             <li>
//                 <article class="uk-comment uk-visible-toggle uk-padding-small uk-border-rounded" tabindex="-1">
//                     <header class="uk-comment-header uk-position-relative">
//                         <div class="uk-grid-medium uk-flex-middle" uk-grid>
//                             <div class="uk-width-auto">
//                                 <img class="uk-comment-avatar uk-border-circle" src="../assets/avatar/me.jpg" width="32" height="32" alt="">
//                             </div>
//                             <div class="uk-width-expand">
//                                 <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">mvp.dedefilaras</a></h4>
//                                 <!--p class="uk-comment-meta uk-margin-remove-top"><a class="uk-link-reset" href="#">12 days ago</a></p-->
//                             </div>
//                         </div>
//                         <!--div class="uk-position-top-right uk-position-small uk-hidden-hover"><a class="uk-link-muted" href="#">Reply</a></div-->
//                     </header>
//                     <div class="uk-comment-body">
//                         <p>${arr[i].content}</p>
//                     </div>
//                 </article>

//                 ${arr[i].hasOwnProperty('children') ? createCommentNested(arr[i].children) : ''}
//             </li>
//         `;
//     }

//     text += `</ul>`;

//     return text;
// }

function lightboxCaption(txt) {
    return encodeURIComponent(txt);
}

function decodeLightboxCaption() {
    let lightbox = document.querySelectorAll('div[uk-lightbox]');
    
    lightbox.forEach(p => {
        p.querySelector('a').addEventListener('click',() => {
            let txt = p.querySelector('a').getAttribute('data-caption');
            
            p.querySelector('a').style.overflow = 'hidden';
            p.querySelector('a').setAttribute('data-caption',(readMoreWithoutRedirect(decodeURIComponent(txt), 0, 100, p.querySelector('a').getAttribute('data-id'))));
        });
    });
}

export {getArticle};