import BaseController from './BaseController';

/**
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.1
 */
class LoginController extends BaseController {
    constructor(prop) {
        super(prop);
        this.homepage = localStorage.getItem('homepage');
    }
    
    index() {
        let refresh = setInterval(() => {
            this.authenticate().except();
        },1000);
    }
}

export default LoginController;