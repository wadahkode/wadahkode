let databases = {};

exports.clear = function(){
  databases = {};
};

exports.get = function(query, callback){
  databases.connect.query(query, (err, result) => callback(err, result));
};

exports.initialize = function(connection){
  databases.connect = connection;
};