const Connection = require('./connection');
const db = new Connection('pg');

/**
 * MAIN
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.0
 */
let settings = {};

exports.set = function(name, value){
  db.settings(name, value);
};

exports.get = function(table, params, callback){
  db.get(table, params, (err, snapshot) => callback(err, snapshot));
};

exports.push = function(query, callback) {
  db.push(query, (res) => callback(res));
};