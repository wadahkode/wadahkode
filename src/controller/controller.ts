require('jsdom-global')();

class Controller {
  public container: any;
  
  constructor(prop: any) {
    this.container = prop;
  }
  
  view(fileName: string) {
    this.container.innerHTML = fileName;
  }
}

module.exports = Controller;