const Route = require('../router');
const welcome = require('../controller/welcome')();

Route.group('/', function(){
  Route.get('index.html', function(){
    welcome.index();
  });
  
  Route.get('login', 'login');
});

Route.group('/home', function(){
  console.log(true)
});