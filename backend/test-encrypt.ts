import { encryptMessage, decryptMessage } from './src/utils/encryptMessage';

const original = "Привет, это тест шифрования! 🔐";
const encrypted = encryptMessage(original);
const decrypted = decryptMessage(encrypted);

console.log('Original:', original);
console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
console.log('Match:', original === decrypted ? 'SUCCESS!' : 'FAILED!');