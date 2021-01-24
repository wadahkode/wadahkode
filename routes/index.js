const wadahkode = require('@wadahkode/server'),
  Router = wadahkode().Router,
  Client = wadahkode().Client,
  session = require('@wadahkode/server/lib/session')(),
  passwordHash = require('@wadahkode/password-hash');

session.start();
Client.initialize({
  path: wadahkode().dirname('/') + '.env',
});

Router.get('/', (req, res) => res.render('index', {
  title: 'Wadahgamer',
  description: 'Welcome'
}));

// Administrator
Router.get('/admin', (req, res) => res.render('admin/index', {
  title: 'Wadahgamer',
  description: 'Administrator',
  message: ''
}));

// Administrator register
Router.get('/admin/register', (req, res) => res.render('admin/register', {
  title: 'Wadahgamer',
  description: 'Buat akun baru',
  message: ''
}));

// Administrator sign-up
Router.post('/admin/signup', (req, res) => {
  console.log(req.body);
  res.end('oke');
});

module.exports = Router;