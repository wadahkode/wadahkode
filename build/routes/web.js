var Route = require('../router');
var auth = require('../authenticated');
auth();
Route.group('/', function () {
    Route.get('index.html', function () {
    });
    Route.get('login', 'login');
});
Route.group('/home', function () {
    console.log(true);
});
