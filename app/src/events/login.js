import {isNull} from 'lodash';
import {login,setOnline,rememberMe,passwordVerify} from '../services/authenticated';
import Auth from '../services/authenticated';
import * as Cookie from '../services/cookie';
import * as GHPages from '../config/ghpages';

class Login {
    constructor(props) {
        this.formId = props.formId;
        this.btnSubmit = props.btnSubmit;
        this.auth = new Auth({
            "administrator": " superuser",
            "users": " normal"
        });
        this.setUp();
        
        // ubah checked jika cookie sudah ada
        Cookie.checkCookie(status => {
            if (status && window.location.href.match('/login')) {
                let email = document.getElementById('email'),
                    password = document.getElementById('password'),
                    rememberMe = document.getElementById('customCheck');
                
                email.value = Cookie.getCookie('email');
                rememberMe.checked = Cookie.getCookie('_token') == '' ? false : status;
            }
        });
    }
    
    handleChange(form,btn) {
        return login(form,btn).then(response => {
            if (response.ok && response.rememberMe == true) {
                Cookie.checkCookie(status => {
                    if (!status) {
                        response.idToken.then(token => {
                            Cookie.setCookie("_token", token, 30);
                            rememberMe(response.uid, token);
                        });
                    }
                });
                Cookie.setCookie("email", response.email, 7);
                this.auth.isAdmin(status => {
                    if (status) {
                        setOnline(response.uid);
                    }
                });
                this.auth.isUsers(status => {
                    if (status) {
                        setOnline(response.uid);
                    }
                });
            } else {
                this.auth.isAdmin(status => {
                    if (status) {
                        setOnline(response.uid);
                    }
                });
                this.auth.isUsers(status => {
                    if (status) {
                        setOnline(response.uid);
                    }
                });
            }
            
            if (response.isLevel === "normal") {
                setTimeout(function() {
                    window.location.href = GHPages.getOrigin('/id').pathname + '/home/index.html';
                }, 3000);
                
                return false;
            } else if (response.isLevel == "superuser") {
                setTimeout(function() {
                    window.location.href = GHPages.getOrigin('/id').pathname + '/admin/index.html';
                }, 3000);
            }
        });
    }
    
    setUp() {
        let form = document.getElementById(this.formId),
            btnForm = document.querySelector("." + this.btnSubmit);
        
        if (!isNull(form)) {
            btnForm.addEventListener('click', event => {
                btnForm.disabled = true;
                btnForm.innerHTML = `
                    <span id="login-spinner"></span>
                    <span class="uk-margin-small-left">Please wait</span>
                `;
                form.onsubmit = this.handleChange(form, btnForm);
                event.preventDefault();
            });
        }
    }
}

export default Login;