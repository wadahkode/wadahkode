import {isUndefined, isEmpty, isNull, isArray, isFunction, isObject} from 'lodash';
import * as Alert from './components/alert';
import * as Cookie from './services/cookie';
import * as Event from './events';
import * as Services from './services';
import Visitor from './services/visitor';
import './routes/web';

/**
 * Application
 * 
 * @author wadahkode
 * @since version v1.0
 */
class App {
    // constructor
    constructor(props) {
        this.name = "Wadahkode";
        this.version = "v1.0.86";
        this.config = {};
    }
    
    //- Event
    addEvent(pattern, eventName) {
        if (!isObject(eventName)) {
            return this.exception();
        }
        
        for (var key in eventName) {
            switch(key) {
                case 'styleWhenScrolled':
                    Event.styleWhenScrolled(pattern, eventName[key]);
                    break;
                    
                case 'formClicked':
                    Event.formClicked(pattern, eventName[key]);
                    break;
            }
        }
    }
    
    //- Exception error handling
    exception() {
        const app = document.getElementById('App');
        app.innerHTML = '<div class="uk-child-width-1-2@m uk-text-center"><h1>What happening!</h1><p>The system may be under repair or the system may have failed.</p></div>';
        app.className = "uk-height-large uk-flex uk-flex-middle uk-container";
    }
    
    getComponents() {
        // product
        Product.getProduct('component-product');
        Product.detailProduct('detail-product');
        // article
        Article.getArticle('component-article');
        Article.detailArticle('detail-article');
        
    }
    
    //- run....
    getCloudServices() {
        return Services.bind(this.config);
    }
    
    //- setting
    setCloudService(cloud) {
        if (isUndefined(cloud)) {
            return this.exception();
        }
        
        Services.setCloudService(cloud.firebase, response => (response != true ? this.exception() : true));
        Services.isConnected(response => (response != true ? this.showOfflineNotification() : true));
    }
    
    //- Cookie init
    showCookieNotification() {
        return Cookie.initializeApp();
    }
    
    //- Offline notification
    showOfflineNotification() {
        return Alert.noInternet('Tidak ada jaringan internet atau koneksi mungkin terputus.');
    }
    
    //- Test
    testFunc() {
        alert('Welcome to wadahkode');
    }
    
    visitorInformation(ip) {
        const visitor = new Visitor('visitor');
        visitor.writeVisitor({
            "ip": ip,
            "path": location.pathname
        });
        visitor.index();
    }
}

export default App;