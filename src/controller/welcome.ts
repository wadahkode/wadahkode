require('jsdom-global')();

class Welcome {
  constructor() {
    this.container = document.getElementById('root')
  }
  
  index() {
    this.container.innerHTML = 'Welcome'
  }
}

module.exports = () => new Welcome;