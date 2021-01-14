const wadahkode = require('@wadahkode/server'),
  app = wadahkode(),
  path = require('path'),
  client = require('./src/main'),
  session = require('./node_modules/@wadahkode/server/lib/session'),
  port = process.env.PORT || 3000;

session.start();
app.set('views', path.join(__dirname, 'views'));
// client.set({
//   host: "ec2-3-211-149-196.compute-1.amazonaws.com",
//   database: "df5r7sqe9nso4f",
//   user: "ydechwcwxuvqez",
//   port: 5432,
//   password: "a7c07f2c8992a2cd5df3d4fb4aa0d36e0a7c4d552cfebd05b4e48b83fd228bef",
//   uri: "postgres://ydechwcwxuvqez:a7c07f2c8992a2cd5df3d4fb4aa0d36e0a7c4d552cfebd05b4e48b83fd228bef@ec2-3-211-149-196.compute-1.amazonaws.com:5432/df5r7sqe9nso4f"
// });
//client.set('host', 'ec2-3-211-149-196.compute-1.amazonaws.com');
//client.set('database', 'df5r7sqe9nso4f');
//client.set('user', 'ydechwcwxuvqez');
client.set('DATABASE_URL', "postgres://ydechwcwxuvqez:a7c07f2c8992a2cd5df3d4fb4aa0d36e0a7c4d552cfebd05b4e48b83fd228bef@ec2-3-211-149-196.compute-1.amazonaws.com:5432/df5r7sqe9nso4f");

// root
app.get('/', (req, res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  if (session.has('id')) {
    res.redirect('home');
    res.end();
  } else {
    res.render('index', {
      title: 'Wadahgamer',
      description: 'Selamat datang'
    });
  }
});

// about
app.get('/about', (req, res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  res.render('about', {
    title: 'Wadahgamer',
    description: 'Tentang kami'
  });
});

// administrator
app.get('/admin', (req, res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  if (session.has('id')) {
    res.redirect('/admin/dashboard');
    res.end();
  } else {
    res.render('admin/index', {
      title: 'Wadahgamer',
      description: 'Login',
      message: (typeof session.getStore('message') != 'undefined') ? JSON.parse(session.getStore('message')) : ''
    });
  }
});

// login
app.get('/admin/login', (req, res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  if (session.has('id')) {
    res.redirect('admin/dashboard');
    res.end();
  } else {
    res.render('admin/login', {
      title: 'Wadahgamer',
      description: 'Login',
      message: (typeof session.getStore('message') != 'undefined') ? JSON.parse(session.getStore('message')) : ''
    });
  }
});
// register
app.get('/admin/register', (req, res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  if (session.has('id')) {
    res.redirect('admin/dashboard');
    res.end();
  } else {
    res.render('admin/register', {
      title: 'Wadahgamer',
      description: 'Register',
      message: (typeof session.getStore('message') != 'undefined') ? JSON.parse(session.getStore('message')) : ''
    });
  }
});

// post login
app.post('/admin/signin', (req, res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  app.form(req, (error,snapshot) => {
    const {email,password} = snapshot;
    
    if (email == "") {
      session.setStore('message', 'Please input field email');
      res.redirect('/admin/login');
      res.end();
    }
    else if (email != "" && password == "") {
      session.setStore('message', 'Please input field password');
      res.redirect('/admin/login');
      res.end();
    } else {
      client.get('users', [email,password], (err, data) => {
        if (err) throw err;
        if (data.length < 1) {
          session.setStore('message', 'Email or password is wrong!');
          res.redirect('/admin/login');
          res.end();
        } else {
          session.set('id', email);
          for (let row of data) {
            if (row.email == email) {
              session.setStore(session.get('id'), row);
            }
          }
          res.redirect('dashboard');
          res.end();
        }
      });
    }
  });
  // if (session.has('id')) {
  //   res.redirect('admin/dashboard');
  //   res.end();
  // } else {
  //   app.form(req, (err, snapshot) => {
  //     if (!err) {
  //       session.set('id', snapshot.name);
  //       session.setStore(session.get('id'), snapshot);
  //       res.redirect('admin/dashboard');
  //       res.end();
  //     } else {
  //       res.redirect('/admin');
  //       res.end();
  //     }
  //   });
  // }
});
// post register
app.post('/admin/signup', (req, res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  app.form(req, (error, snapshot) => {
    const {firstname,lastname,email,password,passwordVerify} = snapshot;
    
    if (firstname == "") {
      session.setStore('message', 'please input field firstname');
      res.redirect('/admin/register');
      res.end();
    }
    else if (lastname == "") {
      session.setStore('message', 'please input field lastname');
      res.redirect('/admin/register');
      res.end();
    }
    else if (email == "") {
      session.setStore('message', 'please input field email');
      res.redirect('/admin/register');
      res.end();
    }
    else if (password == "") {
      session.setStore('message', 'please input field password');
      res.redirect('/admin/register');
      res.end();
    }
    else if (passwordVerify == "") {
      session.setStore('message', 'please input field password verify');
      res.redirect('/admin/register');
      res.end();
    } else if (password != passwordVerify) {
        session.setStore('message', 'password verify failed!');
        res.redirect('/admin/register');
        res.end();
    } else {
      client.get('users', [email,password], (data) => {
        if (data != null) {
          session.setStore('message', 'Akun sudah terdaftar!');
          res.redirect('/admin/register');
          res.end();
          //res.end('Akun sudah terdaftar');
        } else {
          res.end('Akun belum terdaftar!');
        }
      });
    }
  });
});
// profile
app.get('/admin/profile', (req, res) => {
  if (session.has('id')) {
    let id = session.get('id');
    let data = session.getStore(id);
    
    res.render('admin/profile', {
      title: 'Wadahgamer',
      description: 'Profile',
      data: JSON.parse(data)
    });
  } else {
    res.redirect('/admin/login');
    res.end();
  }
});
// dashboard
app.get('/admin/dashboard', (req,res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  if (!session.has('id')) {
    res.redirect('/admin');
    res.end();
  } else {
    let id = session.get('id');
    let data = session.getStore(id);
    
    res.render('admin/dashboard', {
      title: 'Wadahgamer',
      description: 'Dashboard',
      data: JSON.parse(data)
    });
  }
});

// run
app.listen(port);