import BaseController from './BaseController';

/**
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.1
 */
class WelcomeController extends BaseController {
    constructor(prop) {
        super(prop);
        this.homepage = localStorage.getItem('homepage');
        this.authenticate().except();
    }
    
    index() {
        this.view('welcome');
    }
}

export default WelcomeController;