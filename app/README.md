# Wadahkode
Just Library For [wadahkodejs](https://github.com/wadahkode/wadahkodejs.git)

### catatan

Saat ini saya telah membagi library ini menjadi dua bagian yaitu:

* [dev-admin](https://github.com/wadahkode/wadahkodejs/tree/dev-admin)
* [dev-users](https://github.com/wadahkode/wadahkodejs/tree/dev-users)

### Untuk pengembang

Pustaka ini tidaklah mudah untuk digunakan, ada beberapa syarat yang harus kalian penuhi:

<ol>
    <li>jekyll sudah terinstall</li>
    <li>nodejs sudah terinstall</li>
</ol>

### Bagaimana pustaka ini bekerja

Pertama kalian harus mengunduh / clone repository [wadahkodejs](https://github.com/wadahkode/wadahkodejs.git),
atau kalian dapat mengunduh sesuai branch yang kalian inginkan.

Setelah repository terunduh langkah-langkah yang harus kalian lakukan adalah sebagai berikut:

    $ npm install / yarn install
    $ npm run start / yarn start
    $ npm run serve / yarn serve

### Konfigurasi

Semua konfigurasi untuk firebase, facebook plugin (share only), github pages ada didirektori <code>app/src/config</code>, kamu bisa mengatur konfigurasi sesuai dengan yang dibutuhkan.

### Build

Library ini mempunyai dukungan untuk didemontrasikan di github.io/[repository], tetapi ada beberapa langkah yang harus kalian lakukan
sebelum mendemontrasikannya, langkah-langkahnya seperti berikut:

<ol>
    <li>
        Buka file <code>_config.prod.yml</code>
        
```yaml
# production
title: Wadahkode
email: mvp.dedefilaras@gmail.com
description: Selamat datang di Wadahkode
url: "https://wadahkode.github.io/id"
twitter_username    : AyusVilla
github_username     : wadahkode
source              : ./templates/
destination         : ../wadahkode-id/
```

pada bagian <code>url</code> kalian harus mengubahnya sesuai dengan github pages kalian,
kemudian untuk <code>destination</code> kalian dapat mengaturnya kembali menjadi <code>./docs</code>
    </li>
    <li>
        Buka file <code>app/index.js</code>
        
```js
app.config = {
    "env": "development",
    "development": {
        "forUser": "/home/index.html"
    },
    "production": {
        // github pages https://wadahkode.github.io/[id]
        "forUser": "/id/home/index.html"
    }
};
```

Untuk bagian <code>env</code> kalian harus ubah menjadi <code>"env": "production"</code>, dan pada bagian <code>/id/home/index.html</code> kalian harus ubah menjadi <code>[repository]/home/index.html</code>.

Dan selanjutnya jika kalian ingin mengatur service worker lakukan seperti berikut:

```js
serviceWorker.register("[repository]/[path_service_worker]")
```

Kalian harus membuka file <code>webpack.prod.js</code> untuk mengatur dimana kalian akan menyimpan serviceWorkernya.
    </li>
    <li>
        Langkah selanjutnya seperti berikut:

```shell
$ npm run buildjs / yarn buildjs
$ npm run build / yarn build
```

Terakhir lakukan push ke-repository kalian.
    </li>
</ol>

Pustaka ini sebenarnya digunakan untuk pribadi, jika kalian tidak mengerti itu bukan kesalahan kalian.