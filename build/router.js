var request = require('./request');
require('jsdom-global')();
var router = {
    parentPath: Array,
    routeGroup: Array,
    group: Object.create({}),
    get: Object.create({}),
    middleware: Object.create({})
};
router.group = function (path, routeGroup) {
    if (typeof routeGroup != 'function' || path == '' || path == null)
        return false;
    this.parentPath = [path];
    this.routeGroup = [routeGroup];
    this.middleware((location.pathname == path) ? path : '');
};
router.get = function (path, func) {
    if (typeof path == 'undefined')
        return false;
    if (typeof func == 'undefined')
        return false;
    if (path == 'index.html') {
        path = '/';
    }
    var req = request(path);
    if (location.href == req.url && req.method == 'GET') {
        if (typeof func == 'function')
            func(req);
    }
};
router.middleware = function (path) {
    var _this = this;
    if (typeof this.routeGroup != 'object')
        return false;
    if (this.parentPath.includes(path)) {
        return this.parentPath.forEach(function (item, key) { return _this.routeGroup[key](_this); });
    }
    else {
        return false;
    }
};
module.exports = router;
