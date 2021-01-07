const Route = require('../router');
const welcome = require('../controller/welcome')();

Route.group('/', function(){
  Route.get('index.html', () => welcome.index());
});

Route.group('/home', function(){});