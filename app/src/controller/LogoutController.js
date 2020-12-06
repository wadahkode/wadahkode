import BaseController from './BaseController';
import * as Event from '../events';
import {logout} from '../services/authenticated';

/**
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.1
 */
class LogoutController extends BaseController {
    constructor(prop) {
        super(prop);
        this.authenticate().backTo('../login.html');
    }
    
    index() {
        this.prop.then(response => {
            if (response.status) {
                const {uid} = response.userData;
                Event.loading(length => {
                    if (length == 100) {
                        return logout(uid);
                    }
                });
            }
        });
    }
}

export default LogoutController;