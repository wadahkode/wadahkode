import Wadahkode from './src/App';
import * as serviceWorker from './service';

/**
 * Wadahkode Application
 * 
 * Ini hanya sebuah perpustakaan untuk menangani statis web hasil compile dari ruby jekyll,
 * Apa saja yang ditangani oleh perpustakaan ini:
 *
 *-----------------------------------------------*
 | # | Penjelasan                                |
 *-----------------------------------------------*
 | 1 | Pemberitahuan tidak ada koneksi internet  |
 | 2 | Menggunakan layanan dari firebase         |
 | 3 | Menambahkan sebuah event                  |
 | 4 | Menampilkan pesan penggunaan cookie       |
 | 5 | Mendeteksi ip pengunjung                  |
 | 6 | Environment                               |
 | 7 | Menjalankan layanan firebase              |
 | 8 | Memberikan dukungan saat offline          |
 *-----------------------------------------------*
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version v1.085
 * @license MIT
 * @git https://github.com/wadahkode/wadahkodejs.git
 */
(function(app){
    "use strict";
    
    //-1. Jika koneksi internet tidak ada atau sedang offline
    if (!window.navigator.onLine) {
        return app.showOfflineNotification();
    }
    
    //-2. Lanjutkan jika koneksi ada atau sedang online
    app.setCloudService({
        "firebase": true
    });
    
    //-3. add event
    // param1: pattern url
    // param2: event name
    app.addEvent(/\/.*/,{
        "styleWhenScrolled": {
            "navbarStyle": {
                "id": "homeNavbar",
                "scrollTo": "top",
                "scrollMax": 60
            }
        },
        "formClicked": {
            "login": {
                "formId": "form-login",
                "btnSubmit": "quick-btn-login"
            },
            "register": {
                "formId": "form-register",
                "btnSubmit": "quick-btn-register"
            }
        }
    });
    
    //-4. Cookie notification
    //app.showCookieNotification();
    
    //-5. Visitor information
    fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(response => {
            //- param: data.ip
            app.visitorInformation(response.ip);
        });
        
    //-6 Test for environment config
    app.config = {
        "env": "development",
        "development": {
            "forUser": "/home/index.html"
        },
        "production": {
            // github pages https://wadahkode.github.io/[id]
            "forUser": "/id/home/index.html"
        }
    };
    
    //-7. Jika semua berjalan dengan lancar panggil layanannya.
    return app.getCloudServices();
})(new Wadahkode());

//-8. Dukungan mode offline
//- param: path directory of service worker
//serviceWorker.register('id/vendor/uikit/js');
serviceWorker.unregister('./');