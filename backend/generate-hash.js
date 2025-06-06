// backend/generate-hash.js
const bcrypt = require('bcrypt');

const password = process.argv[2] || 'tuContraseñaSecreta'; // Puedes pasar la contraseña como argumento
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generando hash:', err);
  } else {
    console.log(`Contraseña en texto plano: ${password}`);
    console.log(`Hash generado: ${hash}`);
  }
});
