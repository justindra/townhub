import { S3 } from 'aws-sdk';
import sharp from 'sharp';

const s3 = new S3();

const FILES_BUCKET_NAME = process.env.FILES_BUCKET_NAME ?? '';

/**
 * Generate a new thumnail for a particular file in the Files Bucket
 * @param fileId The id of the file to generate thumbnail for
 * @param filename The name of the file
 * @param width The width of the thumbnail
 * @param height The height of the thumbnail
 */
export const generateThumbnail = async (
  fileId: string,
  filename: string,
  width: number,
  height: number
) => {
  // Get the original file from S3
  const currentObject = await s3
    .getObject({
      Bucket: FILES_BUCKET_NAME,
      Key: `${fileId}/${filename}`,
    })
    .promise();

  const currentImage = currentObject.Body as Buffer;

  // Resize that image
  const resizedImage = await sharp(currentImage)
    .resize(width, height, { fit: 'inside' })
    .toBuffer();

  // Save the thumbnail back into S3
  await s3
    .putObject({
      Bucket: FILES_BUCKET_NAME,
      Key: `${fileId}/${width}/${height}/${filename}`,
      Body: resizedImage,
      ContentType: currentObject.ContentType,
    })
    .promise();

  // Return the results
  return { resizedImage, contentType: currentObject.ContentType };
};
