import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

let s3 = null;

export function isR2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

function getClient() {
  if (!s3 && isR2Configured()) {
    s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3;
}

export async function uploadToR2(filename, buffer, mimetype) {
  const client = getClient();
  if (!client) return null;

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
    })
  );

  const publicBase = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
  return publicBase ? `${publicBase}/${filename}` : `/uploads/${filename}`;
}

export async function deleteFromR2(filename) {
  const client = getClient();
  if (!client) return;

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
      })
    );
  } catch (err) {
    console.error(`Failed to delete ${filename} from R2:`, err.message);
  }
}
