require('jsdom-global')();

/**
 * Parent Of Controller
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
class Controller {
  public container: any;
  public componentBuffer: any;
  
  constructor(prop: any) {
    this.container = prop;
  }
  
  view(fileName: string) {
    this.componentBuffer = require('../views/' + fileName.toLowerCase() + '.component.js');
    this.container.innerHTML = this.componentBuffer;
  }
}

module.exports = Controller;