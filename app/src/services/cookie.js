import {isEmpty, isNull} from 'lodash';
import DateFormater from '../utility/dateformater';
//import 'cookieconsent';

/**
 * Cookie Application
 * 
 * @author by wadahkode <mvp.dedefilaras@gmail.com>
 * @source w3school
 * @since version v1.0.85
 */
export const initializeApp = () => {
    let cookieContainer = document.getElementById('cookieconsent');
    
    if (getCookie('_token') == "" && window.location.pathname == '/' || window.location.pathname == '/index.html') {
        cookieContainer.innerHTML = `
            <div class="uk-background-primary uk-padding-small uk-text-light">
                <p>This website uses cookies to improve your experience.</p>
                <button id="cookie_temp" type="button" class="uk-button uk-button-small uk-button-default">Got it!</button>
            </div>
        `;
        let cookieTmp = document.getElementById('cookie_temp');
        cookieTmp.addEventListener('click', () => {
            document.getElementById('_wkcookie').style.display = "none";
            //setCookie('_token', 'cookietmp', 30);
        });
    }
};

export const setCookie = (cname, cvalue, exdays) => {
    let d = new DateFormater(new Date());
    
    d.setCookieTime(exdays);
    let expires = "expires="+d.date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

export const getCookie = (cname) => {
    let name = cname + "=",
        ca = document.cookie.split(';');
        
    for(var i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

export const checkCookie = (callback) => {
    let user = getCookie("_token");
    if (user != "") {
        return callback(true);
    } else {
        return callback(false);
    }
};

export const deleteCookie = (n) => {
    let user = getCookie("_token");
    if (user != "") {
        document.cookie = "_token=" + n + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("sukses");
    }
};

export const deleteCookieByName = (name,value) => {
    let user = getCookie(name);
    if (user != "") {
        document.cookie = name + "=" + value + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
};