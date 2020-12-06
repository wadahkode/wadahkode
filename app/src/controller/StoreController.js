import BaseController from './BaseController';

/**
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.1
 */
class StoreController extends BaseController {
    constructor(prop) {
        super(prop);
        this.homepage = localStorage.getItem('homepage');
        this.authenticate().except();
    }
    
    async index(request) {
        
    }
}

export default StoreController;