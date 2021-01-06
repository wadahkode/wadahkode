const Route = require('../router');
const auth = require('../authenticated');
require('jsdom-global')();

auth();

Route.group('/', function(){
  Route.get('index.html', function(){
    let container: any = document.getElementById('root')
    container.innerHTML = 'Selamat datang di wadahgamer'
  });
  
  Route.get('login', 'login');
});

Route.group('/home', function(){
  console.log(true)
});