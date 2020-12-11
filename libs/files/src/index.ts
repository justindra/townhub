import { S3 } from 'aws-sdk';
import sharp from 'sharp';

const s3 = new S3();

export const generateThumbnail = async (
  bucket: string,
  fileId: string,
  filename: string,
  width: number,
  height: number
) => {
  const object = await s3
    .getObject({
      Bucket: bucket,
      Key: `${fileId}/${filename}`,
    })
    .promise();

  const image = object.Body as Buffer;

  const resizedImage = await sharp(image)
    .resize(width, height, { fit: 'inside' })
    .toBuffer();

  const uploaded = await s3
    .putObject({
      Bucket: bucket,
      Key: `${fileId}/${width}/${height}/${filename}`,
      Body: resizedImage,
    })
    .promise();

  console.log('done', uploaded);

  return { resizedImage, contentType: object.ContentType };
};
