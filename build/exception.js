require('jsdom-global')();
var Exception = (function () {
    function Exception(message, filename, line) {
        var el = document.createElement('button'), modal = document.createElement('div');
        el.className = 'debug btn btn-primary';
        el.setAttribute('data-toggle', 'modal');
        el.setAttribute('data-target', '#debuging');
        el.innerHTML = 'debug';
        modal.className = 'modal fade';
        modal.id = 'debuging';
        modal.innerHTML = "\n      <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n          <div class=\"modal-header\">\n            <h5 class=\"modal-title\" id=\"exampleModalLabel\">WARNING <span class=\"text-danger\">(!)</span></h5>\n            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n              <span aria-hidden=\"true\">&times;</span>\n            </button>\n          </div>\n          <div class=\"modal-body\">\n            <p>" + (line > 0 ? "[" + line + "]" : "") + "\n            " + (message !== null ? message : "Sedang dalam pengembangan!") + "\n            " + (filename !== null ? filename : "") + "</p>\n          </div>\n        </div>\n      </div>\n    ";
        var containter = document.getElementById('root');
        containter.appendChild(el);
        containter.appendChild(modal);
    }
    return Exception;
}());
module.exports = Exception;
