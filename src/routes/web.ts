const Route = require('../router');
const Welcome = require('../controller/welcome')();

Route.group('/', function(){
  Route.get('index.html', function(){
    Welcome.index();
  });
  
  Route.get('login', 'login');
});

Route.group('/home', function(){
  console.log(true)
});