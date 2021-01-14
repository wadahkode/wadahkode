
class Connection {
  constructor() {
    // const {Client, Pool} = require(type);
    // return new Pool({
    //   user: 'root',
    //   host: 'localhost',
    //   database: database,
    //   password: '',
    //   port: 5432
    // });
    // this.client = new Client({
    //   connectionString: process.env.DATABASE_URL,
    //   ssl: {
    //     rejectUnauthorized: false,
    //     sslmode: require
    //   }
    // });
    // this.client.connect();
  }
}

module.exports = class {
  constructor(module) {
    this.connect = require(module);
  }
  
  client() {
    const {Client} = this.connect;
    
    return new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  
  get(table, params, callback) {
    const client = this.client();
    client.connect();
    
    client.query(`SELECT * FROM ${table} WHERE email=$1 AND password=$2;`, params, (err, res) => {
      // if (err) throw err;
      // for (let row of res.rows) {
      //   callback(JSON.stringify(row));
      // }
      if (err) {
        callback(err, res.rows);
        client.end();
      } else {
        callback(err, res.rows);
        client.end();
      }
    });
    // client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    //   if (err) throw err;
    //   for (let row of res.rows) {
    //     console.log(JSON.stringify(row));
    //   }
    //   client.end();
    // });
  }
  
  push(query, callback) {
    const client = this.client();
    client.connect();
    
    client.query(query, (err,res) => {
      callback(err);
      client.end();
    });
  }
  
  settings(name, value) {
    if (!process.env.hasOwnProperty(name)) {
      process.env[name] = value;
    }
  }
};