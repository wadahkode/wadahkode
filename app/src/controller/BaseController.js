import Authenticated from '../services/authenticated';

/**
 * Base Controller
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.1
 */
class BaseController {
    constructor(prop) {
        this.prop = prop;
        this.auth = new Authenticated({
            "administrator": "superuser",
            "users": "normal"
        });
    }
    
    authenticate() {
        this.prop = new Promise(resolve => {
            this.auth.isUsers((status,data) => {
                resolve({
                    "status": status,
                    "userData": data
                });
            });
        });
        return this;
    }
    
    backTo(uri) {
        this.prop.then(response => {
            if (response.status) {
                return false;
            } else {
                if (typeof uri == 'undefined') return false;
                return this.auth.redirectTo(uri);
            }
        });
    }
    
    except(uri) {
        this.prop.then(response => {
            if (response.status) {
                return this.auth.redirectTo(this.homepage);
            } else {
                if (typeof uri == 'undefined') return false;
                
                return this.auth.redirectTo(uri);
            }
        });
    }
    
    loadModel(model, table="") {
        let newModel = require(`../model/${model}-model`).default;
    
        return new newModel(table);
    }
    
    view(filename, data) {
        filename = require('../views/' + filename);
        
        if (typeof data != 'undefined') {
            return filename(data);
        } else {
            //if (typeof filename != 'function') return false;
            return filename();
        }
    }
}

export default BaseController;