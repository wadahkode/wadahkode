var internet = require('is-online');
var firebase = require('firebase/app')["default"];
var exception = require('./exception');
require('jsdom-global')();
require('firebase/database');
var WadahkodeTest = (function () {
    function WadahkodeTest(prop) {
        if (prop === void 0) { prop = false; }
        this.name = 'Wadahkode';
        this.splashscreen = false;
        this.container = document.getElementById('root');
        this.splashscreen = prop;
    }
    WadahkodeTest.prototype.connectionLost = function () {
        return (this.container == null)
            ? false
            : this.container.innerHTML = "\n        <div class=\"preloader position-fixed text-center w-100 h-100\">\n          <p>Koneksi jaringan terputus,\n            <a href=\"#\" onclick=\"location.reload()\">muat ulang kembali</a>\n          </p>\n        </div>\n      ";
    };
    WadahkodeTest.prototype.exception = function (message, filename, line) {
        if (message === void 0) { message = null; }
        if (filename === void 0) { filename = null; }
        if (line === void 0) { line = 0; }
        if (this.config.mode !== 'production') {
            return new exception(message, filename, line);
        }
    };
    WadahkodeTest.prototype.firebaseSetup = function () {
        var _a = this.config.firebase, use = _a.use, fileConfig = _a.fileConfig;
        try {
            if (use) {
                var firebaseConfig_1 = require("" + fileConfig);
                firebase.initializeApp(firebaseConfig_1);
            }
            else {
                throw new Error('Firebase belum diaktifkan!');
            }
        }
        catch (e) {
            this.exception(e.message, e.fileName, e.lineNumber);
        }
    };
    WadahkodeTest.prototype.getReady = function () {
        var _this = this;
        this.splashscreen = this.config.splashscreen;
        if (this.splashscreen) {
            this.getSplashScreen();
        }
        this.testFirebaseConnected(function (status) {
            try {
                if (!status)
                    return _this.exception('Layanan firebase tidak dapat terhubung, koneksi internet anda mungkin terlalu lambat!');
                require('./routes/web');
            }
            catch (e) {
                _this.exception(e.message, e.fileName, e.lineNumber);
            }
        });
    };
    WadahkodeTest.prototype.getSplashScreen = function () {
        if (!localStorage.getItem('_spsc')) {
            this.container.style.background = "#fff";
            this.container.innerHTML = "\n        <div class=\"splashscreen\">\n          <div class=\"brand text-light\">Wadahkode</div>\n          <div class=\"loading\">\n            <div class=\"dot\"></div>\n            <div class=\"dot\"></div>\n            <div class=\"dot\"></div>\n            <div class=\"dot\"></div>\n            <div class=\"dot\"></div>\n          </div>\n        </div>\n      ";
            localStorage.setItem('_spsc', 'true');
            this.getSplashScreen();
        }
        else {
            var date = new Date(), seconds = date.getMilliseconds(), limit_1 = 60 * 60 * 6, i_1 = 0, refresh = setInterval(function () {
                if (i_1 == limit_1) {
                    localStorage.removeItem('_spsc');
                    i_1 = 0;
                }
                i_1++;
            }, seconds);
        }
    };
    WadahkodeTest.prototype.isConnected = function (callback) {
        return internet({ timeout: 3000 })
            .then(function (onLine) {
            if (!onLine)
                callback(false);
            else
                callback(true);
        });
    };
    WadahkodeTest.prototype.testFirebaseConnected = function (callback) {
        return firebase.database().ref('/.info/connected')
            .on('value', function (snap) {
            setTimeout(function () {
                if (snap.val() === true) {
                    callback(true);
                }
            }, 20);
        });
    };
    return WadahkodeTest;
}());
module.exports = WadahkodeTest;
