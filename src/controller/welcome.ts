let BaseController = require('./controller');
require('jsdom-global')();

class Welcome extends BaseController {
  constructor(prop: any) {
    super(prop);
  }
  
  index() {
    super.view('Welcome');
    //this.container.innerHTML = 'Welcome'
  }
}

module.exports = () => new Welcome(document.getElementById('root'));