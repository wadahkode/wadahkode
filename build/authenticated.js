var Authenticated = (function () {
    function Authenticated(firebase) {
        this.firebase = firebase;
        this.factory();
    }
    Authenticated.prototype.factory = function () {
        this.firebase.auth().onAuthStateChanged(function (user) {
            console.log(user.uid);
        });
    };
    return Authenticated;
}());
module.exports = function () { return new Authenticated(require('firebase/app')["default"]); };
