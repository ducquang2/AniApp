import CryptoJS from 'crypto-js';
import type { SourceEntry } from './types';

const ALLANIME_KEY = CryptoJS.SHA256('Xot36i3lK3:v1');

// Decrypts the AES-256-CTR "tobeparsed" blob returned by allanime's persisted-query path.
// Layout: byte 0 = magic (skipped), bytes [1..13) = IV, bytes [13..N-16) = ciphertext,
// last 16 bytes discarded. CTR IV = 12-byte IV || 0x00000002 counter.
function decryptTobeparsed(blobBase64: string): string {
  const blob = CryptoJS.enc.Base64.parse(blobBase64);
  const blobHex = CryptoJS.enc.Hex.stringify(blob);
  const totalBytes = blobHex.length / 2;

  if (totalBytes < 29) {
    throw new Error(`tobeparsed blob too small: ${totalBytes} bytes`);
  }

  const ivHex = blobHex.slice(2, 26);
  const ctrIv = CryptoJS.enc.Hex.parse(ivHex + '00000002');

  const ctHex = blobHex.slice(26, blobHex.length - 32);
  const ct = CryptoJS.enc.Hex.parse(ctHex);

  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({ ciphertext: ct }),
    ALLANIME_KEY,
    {
      iv: ctrIv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    },
  );

  return CryptoJS.enc.Utf8.stringify(decrypted);
}

type DecryptedEpisode = {
  episode?: { sourceUrls?: SourceEntry[] };
};

export function extractSourcesFromBlob(blobBase64: string): SourceEntry[] {
  const plain = decryptTobeparsed(blobBase64);
  const parsed = JSON.parse(plain) as DecryptedEpisode;
  return parsed.episode?.sourceUrls ?? [];
}
