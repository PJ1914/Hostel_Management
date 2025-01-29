const crypto = require('crypto');

const generateSecret = () => {
  const secret = crypto.randomBytes(32).toString('hex');
  console.log('Generated JWT Secret:', secret);
  return secret;
};

console.log('\nCopy this secret to your .env file:\n');
console.log(`JWT_SECRET=${generateSecret()}`); 