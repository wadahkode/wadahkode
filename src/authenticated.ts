class Authenticated {
  private firebase: any;
  
  constructor(firebase: any) {
    this.firebase = firebase;
    this.factory();
  }
  
  factory() {
    this.firebase.auth().onAuthStateChanged((user: any) => {
      console.log(user.uid);
    });
  }
}

module.exports = () => new Authenticated(
  require('firebase/app').default
);