const wadahkode = require("@wadahkode/server"),
  Client = wadahkode().Client,
  // Matikan ssl ketika berada dilocalhost
  // sslOptions = false;
  // Hapus komentar ini jika telah berada dihosting
  sslOptions = { rejectUnauthorized: false };

/**
 * Initialize environment
 *
 * Silahkan atur dimana kalian menyimpan file .env
 *
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.6
 */
Client.initialize({
  path: wadahkode().dirname(".") + "/.env",
});

// Menyimpan pada variabel Database ketika terkoneksi
const Database = Client.connect(sslOptions);

// Berapa banyak model yang mau dimuat
const userModel = require("./User")(Database);
const tutorialModel = require("./Tutorial")(Database);

// export model
module.exports = {
  user: userModel,
  tutorial: tutorialModel,
};
