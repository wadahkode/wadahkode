import ArticleModel from '../model/article-model';
import * as URL from '../utility/url';
import * as GHPages from '../config/ghpages';
//import * as Pagination from '../events/pagination';
import {changeLike} from '../events/liked';
import {getCommentsArticle, getTotalCommentsArticle, getSubTotalCommentsArticle, getUserAuthBeforeSendComment, getUserAuthBeforeSendLike, User, viewComment} from '../events/comments';
import {shareToMedia} from '../events/share';
import {isNull,isUndefined,isObject} from 'lodash';
import * as Cookie from '../services/cookie';

export const model = () => {
    return new ArticleModel('article');
};

export const getArticle = id => {
    let container = document.getElementById(id),
        pattern = /\/.*/g,
        total = [],
        articleText = "",
        article = [];
    
    
    if (isNull(container)) return false;
    
    model().getArticle().then(snapshot => {
        snapshot.forEach(item => {
            item = item.val();
            total.push(item);
            
            if (total.length <= 3) {
                articleText += viewArticle(item);
            }
            container.innerHTML = articleText;
            container.innerHTML += `
                <a href="article/index.html" class="uk-button uk-button-primary uk-button-small uk-text-capitalize">
                    <span>Lihat semua artikel</span>
                    <span uk-icon="icon: arrow-right"></span>
                </a>
            `;
        });
        
        model().off();
    });
};

export const getArticleNoLimit = id => {
    let container = document.getElementById(id),
        pattern = /\/.*/g,
        total = [],
        articleText = "",
        article = [];
        
    if (isNull(container)) return false;
    
    container.innerHTML = `
        <div class="uk-flex uk-flex-center uk-flex-middle uk-height-large">
            <div class="spinner spinner-medium"></div>
        </div>
    `;
    
    let title = document.createElement("h4");
    title.innerHTML = "semua artikel";
    title.className = "uk-text-capitalize";
    
    model().getArticle().then(snapshot => {
        snapshot.forEach(item => {
            total.push(item.val());
            articleText += viewArticle(item.val());
            container.parentElement.insertBefore(title, container);
            container.innerHTML = articleText;
        });
        
        model().off();
    });
};

export const lineBreak = (str, breakTag) => {
    str = (str.split("\\n").join(breakTag));
    return (str.split("@").join(breakTag + breakTag));
};

export const readMore = (str,link) => {
    return (str.substring(0,100) + '...&nbsp;<a href="' + GHPages.getOrigin('/id').pathname + '/article/?key=' + link.split('=')[1] + '">baca selengkapnya</a>');
};

export const detailArticle = (id,key)=> {
    let container = document.getElementById(id),
        patternPath = /\/article/g,
        patternKey = /\?key.*/g,
        total = [],
        articleText = "";
    
    if (isNull(container)) return false;
    
    container.innerHTML = `
        <div class="uk-flex uk-flex-center uk-flex-middle uk-height-large">
            <div class="spinner spinner-medium"></div>
        </div>
    `;
    
    model().getArticle().then(snapshot => {
        let request = key.toString().replace('?key=', '');
                    
        if (request == 0) {
            request = null;
        }
        showDetailArticle(request, container);
        
        function showDetailArticle(name, container) {
            container.innerHTML = `
                <div class="uk-flex uk-flex-center uk-flex-middle uk-height-large">
                    <div class="spinner spinner-medium"></div>
                </div>
            `;
            
            snapshot.forEach(item => {
                if (!isNull(item.val().articleUrl.match(name))) {
                    
                    setTimeout(() => {
                        container.innerHTML = createDetailArticle(item.val());
                        changeLike(model(), snapshot);
                        getToolbarArticle(snapshot);
                    }, 1000);
                    
                    //return false;
                } else if (isNull(name) || name.match(/^[0-9]/) || name.match(/^[0-9].*/)) {
                    container.innerHTML = `
                        <div class="uk-card uk-card-default">
                            <div class="uk-card-header uk-padding-small">
                                <span class="uk-text-bold">Pencarian: </span>
                                <span class="uk-text-italic uk-text-underline">${name}</span>
                            </div>
                            <div class="uk-card-body uk-padding-small">
                                <b>Artikel tidak dapat ditemukan!</b>
                            </div>
                        </div>
                    `;
                } else {
                    //
                }
            });
        }
    });
};

function createDetailArticle(response) {
    var head = document.querySelector('head');
    head.querySelector('title').innerHTML = `Wadahkode | ${response.articleTitle}`;
    
    return `
        <div class="uk-card @uk-card-default uk-margin-bottom">
            <div class="uk-card-body uk-padding-remove">
                <div class="uk-flex uk-flex-column">
                    <b class="uk-card-title uk-text-capitalize">${response.articleTitle}</b>
                    <b class="">@oleh ${response.author} pada ${response.created_at}</b>
                </div>
                <figure class="uk-cover-container uk-height-medium @uk-card-media-left uk-border-rounded">
                    <img src="${response.articlePhoto}" alt="" uk-cover/>
                </figure>
                <p>${response.articleContent}</p>
            </div>
            <div class="uk-card-footer uk-margin-remove-top uk-padding-remove toolbar">
                <div class="uk-child-width-1-3 uk-margin-remove-top" uk-grid>
                    <div data-target="${response.articleKey}" class="total-like" hidden>${isObject(response.like) ? response.like.total : 0}&nbsp;suka</div>
                    <div data-target="${response.articleKey}" class="total-comments uk-text-left" ${!isNull(getTotalCommentsArticle(model(), response.articleKey)) ? '' : 'hidden'}>${getTotalCommentsArticle(model(), response.articleKey)}&nbsp;komentar</div>
                    <div data-target="${response.articleKey}" class="uk-text-right total-share" hidden>${isObject(response.share) ? response.share.total : 0}&nbsp;kali dibagikan</div>
                </div>
                <div class="uk-child-width-1-3 uk-margin-small-top" uk-grid>
                    <div>
                        <a class="@uk-icon-button btn-like uk-link-reset" data-target="${response.articleKey}">
                            <span class="heart-dislike" uk-icon="icon: heart; ratio: 1"></span>
                            <span class="label-like">suka</span>
                        </a>
                    </div>
                    <a class="uk-link-reset btn-comment" uk-toggle="target: #comments-${response.articleKey}; animation: uk-animation-fade">
                        <span uk-icon="icon: comments; ratio: 1"></span>
                        <span>&nbsp;komentar</span>
                    </a>
                    <a class="uk-link-reset uk-text-right" uk-toggle="target: #share-${response.articleKey}">
                        <span uk-icon="icon: forward; ratio: 1"></span>
                        <span>&nbsp;bagikan</span>
                    </a>
                    <div id="share-${response.articleKey}" uk-modal>
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
                                <a data-href="${response.articleUrl}" class="btn-copy-url uk-text-center uk-link-reset uk-flex uk-flex-center uk-flex-column uk-flex-wrap">
                                    <span uk-icon="icon: copy; ratio: 1.5"></span>
                                    <span><input class="copied" value="${response.articleUrl}" hidden></span>
                                    <span class="copied-message">Salin</span>
                                </a>
                            </div>
                            <!--p>Maaf, masih dalam tahap pengembangan, mohon untuk menunggu...</p-->
                        </div>
                    </div>
                </div>
                <div id="comments-${response.articleKey}" class="uk-card uk-card-body uk-margin-top uk-padding-small-top uk-padding-remove-left uk-padding-remove-right" hidden>
                    <div class="container-comments"></div>
                    <form>
                        <div class="uk-margin">
                            <textarea class="uk-textarea" rows="3" placeholder="berikan komentar anda..."></textarea>
                        </div>
                        <div class="uk-margin">
                            <button type="button" class="uk-button uk-button-small uk-button-primary quick-btn-comment">Komentar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function getToolbarArticle(article) {
    //var {comments, share, articleTitle, articleUrl, articlePhoto, articleKey} = article;
    //let btnComment = document.querySelectorAll('.btn-comment');
    
    article.forEach(item => {
        var {comments, share, articleTitle, articleUrl, articlePhoto, articleKey} = item.val();
        
        let btnComment = document.querySelectorAll('.btn-comment'),
            container = document.querySelectorAll('.container-comments');
            //commentKey = Object.keys(comments);
        
        btnComment.forEach((btn,key) => {
            btn.addEventListener('click', () => {
                User().getInfo().then(user => {
                    if (!isUndefined(comments) && !isNull(container[key])) {
                        if (container[key].parentElement.id == 'comments-' + articleKey) {
                            container[key].innerHTML = viewComment(comments, articleKey);
                        }
                    }
                });
                getUserAuthBeforeSendComment(GHPages.getOrigin('/id').pathname + '/login.html');
                getUserAuthBeforeSendLike(GHPages.getOrigin('/id').pathname + '/login.html');
            });
        });
        shareToMedia(articleUrl, "website", "wadahkode", articleTitle, articlePhoto);
    });
    /*btnComment.forEach((item,key) => {
        item.addEventListener('click', () => {
            getCommentsArticle(model(), articleKey);
        });
    });
    shareToMedia(articleUrl, "website", "wadahkode", articleTitle, articlePhoto);*/
}

        
export const viewArticle = item => {
    return `
        <div class="uk-card uk-card-default uk-margin-bottom uk-flex uk-overflow-hidden" style="height: 120px">
            <a href="${GHPages.getOrigin('/id').pathname}/article/?key=${item.articleUrl.split('=')[1]}" class="uk-link-reset">
                <figure class="uk-card-media-left @uk-child-width-1-1 uk-cover-container uk-height-medium" style="width: 120px; height: 120px;">
                    <img src="${item.articlePhoto}" class="uk-height-*" alt="" uk-cover/>
                </figure>
            </a>
            <div class="uk-card-body uk-padding-remove-vertical uk-padding-small">
                <div class="@uk-flex @uk-flex-column">
                    <h4 class="uk-margin-remove-bottom"><a href="${item.articleUrl}" class="uk-link-reset"><b class="uk-text-secondary uk-text-normal @uk-card-title uk-text-capitalize">${item.articleTitle}</b></a></h4>
                    <sub class="">@by ${item.author} pada ${item.created_at}</sub>
                </div>
                <p class="uk-text-justify">${readMore(lineBreak(item.articleContent.toString(), '<br>'), item.articleUrl)}</p>
            </div>
        </div>
    `;
};