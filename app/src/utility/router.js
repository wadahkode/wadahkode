const {filter,search} = require('./url');
/**
 * Router
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.1
 */
let router = {
    "parentPath": null,
    "groupFunc": ""
};

/**
 * Router add
 * 
 * @param string path
 * @param string|function controller
 */
router.add = (path,controller) => {
    let x;
    
    if (typeof path == undefined) return false;
    else if (typeof controller == undefined) return false;
    
    let newPath = (typeof router.parentPath != null) ? router.parentPath + path : path;
    
    if (typeof controller == 'function') {
        
        filter(newPath, /\/.*/).then(status => status ? controller(newPath) : false);
        
        return false;
    }
    
    if (controller.match(/\@/)) {
        let [c,m] = controller.split('@');
        
        filter(newPath, /\/.*/).then(status => {
            if (status) {
                x = require('../controller/' + c).default;
                x = new x();
                x[m](newPath);
            }
        });
        
        return x;
    } else {
        filter(newPath, /\/.*/).then(status => {
            if (status) {
                x = require('../controller/' + controller).default;
                x = new x();
                x[m](newPath);
                
            }
        });
        return x;
    }
};

/**
 * Router search
 * 
 * @param string path
 * @param regex pattern
 * @param string|function controller
 */
router.search = (path, pattern, controller) => {
    //let pattern = /\?key=.*/,
    let x,
        pathname = location.pathname,
        newPath = (router.parentPath + path).toString();
    
    if (pathname === newPath) {
        search(newPath + location.search, pattern).then(request => {
            if (typeof controller == "function") {
                return controller(request);
            } else {
                if (controller.match(/\@/)) {
                    let [c,m] = controller.split('@');
                    x = require('../controller/' + c).default;
                    x = new x();
                    x[m](request);
                    
                    return x;
                } else {
                    x = require('../controller/' + controller).default;
                    x = new x();
                    x[m](request);
                    
                    return x;
                }
            }
        })
        .catch(error => {});
    }
};

/**
 * Router group
 * 
 * @param string path
 * @param function func
 */
router.group = function(path,func) {
    if (typeof func == 'undefined') return false;
    
    this.parentPath = [path];
    this.groupFunc = [func];
    
    return this;
};

router.middleware = function(){
    if (typeof this.groupFunc == 'object') {
        this.parentPath.forEach((url,key) => {
            this.groupFunc[key](this);
        });
    } else {
        return false;
    }
};

export {router};