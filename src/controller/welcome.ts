require('jsdom-global')();

class Welcome {
  public container: any;
  
  constructor() {
    this.container = document.getElementById('root')
  }
  
  index() {
    this.container.innerHTML = 'Welcome'
  }
}

module.exports = () => new Welcome;