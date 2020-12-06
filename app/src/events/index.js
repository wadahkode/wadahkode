import {isNull,isEmpty,isUndefined} from 'lodash';
import * as URL from '../utility/url';
import Login from './login';
import Register from './register';
import * as GHPages from '../config/ghpages';

/**
 * Semua event
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version v1.0.85
 */
export const formClicked = (pattern, event) => {
    URL.parse('', pattern).then(request => {
        //- work in localhost
        if ((request == '/login.html') || (request == '/register.html')) {
            for (let key in event) {
                switch (key) {
                    case 'login':
                        var login = new Login(event[key]);
                        break;
                    
                    case 'register':
                        var register = new Register(event[key]);
                        break;
                }
            }
        }
        //-noted: on release github pages
        else if ((request == GHPages.getOrigin('/id').pathname + '/login.html') || (request == GHPages.getOrigin('/id').pathname + '/register.html')) {
            for (let key in event) {
                switch (key) {
                    case 'login':
                        const login = new Login(event[key]);
                        break;
                        
                    case 'register':
                        const register = new Register(event[key]);
                        break;
                }
            }
        } else {
            //-
        }
    });
};

export const styleWhenScrolled = (pattern, event) => {
    URL.parse('', pattern).then(request=> {
        request = request.toString();
        for (var key in event) {
            if ((key == 'navbarStyle')) {
                if (request == '/') {
                    //- work in localhost
                    navbarStyle(event[key]);
                } else if (request == '/index.html') {
                    navbarStyle(event[key]);
                } else if (request.match(/\/home/) || request.match(/\/admin/)) {
                    //- work in localhost
                    navbarStyle(event[key]);
                } else {
                    //- work in hosting
                    //-example: github pages
                    if (request == GHPages.getOrigin('/id').pathname + "/") {
                        navbarStyle(event[key]);
                    } else if (request == GHPages.getOrigin('/id').pathname + '/index.html') {
                        navbarStyle(event[key]);
                    } else if (request.match(GHPages.getOrigin('/id').pathname + /\/home/) || request.match(GHPages.getOrigin('/id').pathname + /\/admin/)) {
                        navbarStyle(event[key]);
                    }
                }
            }
        }
    })
    .catch(error => console.error(error)/*Exception(error)*/);
};

export const Exception = (message) => {
    const app = document.body;
    app.innerHTML = `
        <div class="uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-flex-column uk-alert uk-alert-warning">
            <h3>Exception</h3>
            <p><b>${message}</b>.</p>
        </div>
    `;
    app.style.height = '100vh';
};

export const navbarStyle = (param) => {
    const {id, scrollTo, scrollMax} = param;
    
    let element = document.getElementById(id),
        className,
        child;
        
    if (isNull(element)) return false;
        
    className = element.classList.contains('uk-position-top'),
    child = element.children[0];
    
    if (!className) {
        return false;
    }
    
    window.addEventListener('scroll', e => {
        switch (scrollTo) {
            case 'top':
                if (e.target.scrollingElement.scrollTop > scrollMax) {
                    if (className) {
                        element.classList.remove("uk-position-top");
                        element.classList.add("uk-position-fixed");
                        element.classList.add("uk-width-1-1");
                        child.classList.add("uk-background-default");
                        child.classList.add("uk-box-shadow-medium");
                    }
                } else {
                    const className = element.classList.contains("uk-position-fixed");
                    if (className) {
                        element.classList.remove("uk-position-fixed");
                        element.classList.add("uk-position-top");
                        element.classList.remove("uk-width-1-1");
                        child.classList.remove("uk-background-default");
                        child.classList.remove("uk-box-shadow-medium");
                    }
                }
                break;
                
            case 'bottom':
                if (e.target.scrollingElement.scrollBottom > scrollMax) {
                    if (className) {
                        element.classList.remove("uk-position-bottom");
                        element.classList.add("uk-position-fixed");
                        element.classList.add("uk-width-1-1");
                        child.classList.add("uk-background-default");
                        child.classList.add("uk-box-shadow-medium");
                    }
                } else {
                    const className = element.classList.contains("uk-position-fixed");
                    if (className) {
                        element.classList.remove("uk-position-fixed");
                        element.classList.add("uk-position-bottom");
                        element.classList.remove("uk-width-1-1");
                        child.classList.remove("uk-background-default");
                        child.classList.remove("uk-box-shadow-medium");
                    }
                }
                break;
        }
        e.preventDefault();
    });
};

export const onClick = (element, callback) => {
    if (isNull(element)) {
        return false;
    } else {
        element.addEventListener('click', e => {
            callback(element);
            e.preventDefault();
        });
    }
};

export const loading = (callback) => {
    document.body.innerHTML = `
        <div class="uk-container uk-flex uk-flex-middle uk-flex-center uk-height-1-1">
            <div class="uk-width-1-1">
                <h4 class="uk-margin-remove-bottom">Please wait...<h4>
                <progress id="loader" class="uk-progress" value="" max="110" style="height: 2px; margin-top: -2rem"></progress>
            </div>
        </div>
    `;
    document.body.style.height = '100vh';
    
    let bar = document.getElementById('loader');
    
    let progress = setInterval(function(){
        let i = 10;
        bar.value += i;
        
        if (bar.value == bar.max) {
            bar.value = 0;
        } else {
            callback(bar.value);
        }
        i++;
    },100);
};

export const tags = input => {
    input.addEventListener('keyup', function(){
        let backspace = this.value.match(/^\b/),
            coma = this.value.match(/,/),
            tag = document.getElementById('tag'),
            tagView = "";
            
        if (!isNull(coma)) {
            if (coma.indexOf(',') > 1) {
                console.log(coma);
            } else {
                let val = this.value.split(',');
                Array.prototype.forEach.call(val, item => {
                    tagView += createTag(item != "" ? item : '');
                    tag.innerHTML = tagView;
                });
                
                let inputValue = this.value;
                Array.prototype.forEach.call(tag.querySelectorAll('.tag-close'), (label,k) => {
                    label.addEventListener('click', () => {
                        label.parentElement.remove();
                        inputValue = inputValue.replace(val[k],'-');
                        inputValue = inputValue.replace(',-,',',');
                        inputValue = inputValue.replace(',-','');
                        this.value = inputValue;
                        
                        if (!inputValue.match(/\w/)) {
                            this.value = "";
                        }
                    });
                });
            }
        } else if (isNull(backspace)) {
            //
        } else {
            tag.innerHTML = `
                <input type="hidden" class="category-input" name="cat[]" value="${this.value}"/>
            `;
        }
    });
};

export const createTag = item => {
    return ((isEmpty(item)) ? `` : `
        <div class="uk-badge uk-background-default uk-box-shadow-small uk-padding-small uk-margin-small-bottom">
            <input type="hidden" class="category-input" name="cat[]" value="${item}"/>
            <b class="uk-text-meta">${item}</b>
            <b class="uk-margin-small-left tag-close" uk-close></b>
        </div>
    `);
};