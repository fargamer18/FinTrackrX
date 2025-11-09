import crypto from 'crypto';

// Base32 encoding for secrets (RFC 4648, without padding)
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function randomBase32(length = 32) {
  const bytes = crypto.randomBytes(length);
  return toBase32(bytes);
}

export function toBase32(buffer: Buffer) {
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }
  return output;
}

export function fromBase32(str: string) {
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  const clean = str.replace(/=+$/,'').toUpperCase();
  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

export function totp(secretBase32: string, time = Date.now(), step = 30, digits = 6) {
  const counter = Math.floor(time / 1000 / step);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(Math.floor(counter / Math.pow(2, 32)), 0);
  buffer.writeUInt32BE(counter & 0xffffffff, 4);
  const key = fromBase32(secretBase32);
  const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24) |
               ((hmac[offset + 1] & 0xff) << 16) |
               ((hmac[offset + 2] & 0xff) << 8) |
               (hmac[offset + 3] & 0xff);
  const otp = (code % Math.pow(10, digits)).toString().padStart(digits, '0');
  return otp;
}

export function verifyTotp(token: string, secretBase32: string, window = 1, step = 30, digits = 6) {
  const now = Date.now();
  for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
    const code = totp(secretBase32, now + errorWindow * step * 1000, step, digits);
    if (code === token) return true;
  }
  return false;
}

export function otpauthURL({ issuer, label, secret }: { issuer: string; label: string; secret: string; }) {
  const params = new URLSearchParams({ secret, issuer, algorithm: 'SHA1', digits: '6', period: '30' });
  return `otpauth://totp/${encodeURIComponent(`${issuer}:${label}`)}?${params.toString()}`;
}
