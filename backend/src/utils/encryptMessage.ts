import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.CHAT_ENCRYPTION_KEY || 'b546630cc90656611f458c33c518edb702df5c856053b23bd59c1fdad6753eab';

const ALGORITHM = 'aes-256-cbc';

function getKeyBuffer(key: string): Buffer {
  if (key.length === 64 && /^[0-9a-f]+$/i.test(key)) {
    return Buffer.from(key, 'hex');
  }
  return Buffer.from(key.padEnd(32, '0')).subarray(0, 32);
}

const KEY_BUFFER = getKeyBuffer(ENCRYPTION_KEY);

console.log('Key length:', KEY_BUFFER.length);

export function encryptMessage(message: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
  
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptMessage(encrypted: string): string {
  const [ivHex, encryptedText] = encrypted.split(':');
  
  if (!ivHex || !encryptedText) return encrypted;
  
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}