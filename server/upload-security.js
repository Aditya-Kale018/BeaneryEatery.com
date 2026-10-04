import fs from 'node:fs';

const HEADER_BYTES = 64;

function ascii(buffer, start, end) {
  return buffer.subarray(start, end).toString('ascii');
}

/** Detect the supported image type from file signatures, not browser claims. */
export function detectImageMime(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return '';

  if (
    buffer[0] === 0x89 &&
    ascii(buffer, 1, 4) === 'PNG' &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) return 'image/png';

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';

  if (ascii(buffer, 0, 4) === 'RIFF' && ascii(buffer, 8, 12) === 'WEBP') return 'image/webp';

  if (ascii(buffer, 4, 8) === 'ftyp') {
    const brands = ascii(buffer, 8, Math.min(buffer.length, HEADER_BYTES));
    if (brands.includes('avif') || brands.includes('avis')) return 'image/avif';
  }

  return '';
}

async function uploadHeader(file) {
  if (Buffer.isBuffer(file?.buffer)) return file.buffer.subarray(0, HEADER_BYTES);
  if (!file?.path) return Buffer.alloc(0);

  const handle = await fs.promises.open(file.path, 'r');
  try {
    const buffer = Buffer.alloc(HEADER_BYTES);
    const { bytesRead } = await handle.read(buffer, 0, HEADER_BYTES, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

export async function uploadedFileMatchesMime(file) {
  return detectImageMime(await uploadHeader(file)) === file?.mimetype;
}

export async function removeLocalUpload(file) {
  if (file?.path) await fs.promises.rm(file.path, { force: true });
}
