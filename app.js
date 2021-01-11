const wadahkode = require('@wadahkode/server'),
  app = wadahkode(),
  path = require('path'),
  port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));

// root
app.get('/', (req, res) => {
  console.log(
    '🌏 %s %s %s %s',
    req.method,
    res.statusCode,
    new Date(),
    req.url
  );
  
  res.render('index', {
    title: 'Wadahgamer',
    description: 'Selamat datang'
  });
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
    title: 'Wadahgamer | Tentang kami'
  });
});

// run
app.listen(port);