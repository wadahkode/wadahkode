import {getOrigin} from '../config/ghpages';
import {router} from '../utility/router';
import HomepageController from '../controller/HomepageController';
import LogoutController from '../controller/LogoutController';

// fungsi getOrigin mempunyai satu parameter yaitu nama dari repository github pages.
const path = getOrigin('/id').pathname;

// group pada path /
router.group(`${path}/`, () => {
    router.add('', 'WelcomeController@index');
    router.add('index.html', 'WelcomeController@index');
    router.add('article/index.html', 'ArticleController@index');
    router.add('product/index.html', 'ProductController@index');
    
    // login and register
    router.add('login.html', 'LoginController@index');
    router.add('register.html', 'RegisterController@index');
    
    router.search('product/', /\/?key=.*/, 'ProductController@getDetailProduct');
    router.search('article/', /\/?key=.*/, 'ArticleController@getDetailArticle');
    router.search('store/', /\/?ref=.*/, 'HomepageController@getStore');
    router.search('chat/seller/', /\/?rc=.*/, 'HomepageController@getChat');
}).middleware();

// group pada path /home/
router.group(`${path}/home/`, () => {
    router.add('index.html', () => {
        const Homepage = new HomepageController();
        Homepage.index();
    });
    router.add('cart/index.html', () => {
        const Homepage = new HomepageController();
        const btnHistory = document.querySelector('#btn-history');
        btnHistory.innerHTML = `<span uk-icon="icon: arrow-left; ratio: 1.5"></span>`;

        Homepage.index();
    });
    router.add('article/index.html', () => {
        const Homepage = new HomepageController();
        Homepage.getOnlyArticle();
    });
    router.add('product/index.html', () => {
        const Homepage = new HomepageController();
        Homepage.getOnlyProduct();
    });
    router.add('settings.html', () => {
        const btnHistory = document.querySelector('#btn-history');
        btnHistory.innerHTML = `<span uk-icon="icon: arrow-left; ratio: 1.5"></span>`;
    });
    router.add('logout.html', () => {
        const Logout = new LogoutController();
        Logout.index();
    });
    router.search('product/', /\/?key=.*/, (request) => {
        const Homepage = new HomepageController();
        const detail = Homepage.getDetailProduct(request);
        
        setTimeout(function() {
            if (typeof detail == 'object') {
                Homepage.saveToCart();
            }
        }, 3000);
    });
    router.search('store/', /\/?ref=.*/, (request) => {
        const Homepage = new HomepageController();
        const btnHistory = document.querySelector('#btn-history');
        btnHistory.innerHTML = `<span uk-icon="icon: arrow-left; ratio: 1.5"></span>`;
        
        Homepage.getStore(request);
    });
    router.search('chat/', /\/?rc=.*/, (request) => {
        const btnHistory = document.querySelector('#btn-history');
        btnHistory.innerHTML = `<span uk-icon="icon: arrow-left; ratio: 1.5"></span>`;
        console.log(request);
    });
    router.search('checkout/', /\/?ro=.*/, (request) => {
        const btnHistory = document.querySelector('#btn-history');
        btnHistory.innerHTML = `<span uk-icon="icon: arrow-left; ratio: 1.5"></span>`;
        console.log(request);
    });
}).middleware();
