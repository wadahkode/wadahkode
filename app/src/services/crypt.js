// File: P-Crypt.js >> Use SECRET value once.
 
// import { Crypt, Compare } from 'password-crypt';
const { Crypt, Compare } = require('password-crypt');
 
// ************ .ENV/Const ************ //
const PASSWORD_CRYPT_SECRET = process.env.PASSWORD_CRYPT_SECRET || 'anyPasswordCryptSecret';
 
// **************** Utils/Services **************** //
const hash = async pwd => await Crypt(PASSWORD_CRYPT_SECRET, pwd);
const verif = async (newPwd, hashedPwd) => await Compare(PASSWORD_CRYPT_SECRET, newPwd, hashedPwd);
 
// **************** Export **************** //
//module.exports.hash = hash;
//module.exports.verif = verif;
export { hash, verif };