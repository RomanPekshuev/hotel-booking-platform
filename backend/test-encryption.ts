import { encryptMessage, decryptMessage } from './src/utils/encryptMessage';

console.log('\n ДЕМО ШИФРОВАНИЯ ЧАТА\n');

const message = "Привет! Это зашифрованное сообщение.";
const encrypted = encryptMessage(message);
const decrypted = decryptMessage(encrypted);

console.log('Исходное:   ', message);
console.log('Зашифровано:', encrypted);
console.log('Расшифровано:', decrypted);
console.log('Совпадает:   ', message === decrypted ? 'ДА' : 'НЕТ');
console.log();