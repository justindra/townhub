import { ApiGatewayWrapper } from '@townhub-libs/core';
import { generateThumbnail } from '@townhub-libs/files';

/**
 * Get a thumbnail for a file
 */
export const main = ApiGatewayWrapper<
  Buffer,
  { fileId: string; filename: string; width: string; height: string }
>(async ({ pathParameters: { fileId, filename, width, height } }) => {
  const { resizedImage, contentType } = await generateThumbnail(
    fileId,
    filename,
    parseInt(width),
    parseInt(height)
  );

  return {
    statusCode: 200,
    headers: { 'Content-Type': contentType },
    body: resizedImage.toString('base64'),
    isBase64Encoded: true,
  } as any;
}, true);
