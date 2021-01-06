const Route = require('../router');
const auth = require('../authenticated');
//require('jsdom-global')();

auth();

Route.group('/', function(){
  Route.get('index.html', function(){
  });
  
  Route.get('login', 'login');
});

Route.group('/home', function(){
  console.log(true)
});