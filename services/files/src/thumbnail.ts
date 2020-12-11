import { ApiGatewayWrapper } from '@townhub-libs/core';
import { generateThumbnail } from '@townhub-libs/files';
import { CloudFrontResponseHandler } from 'aws-lambda';

/**
 * Get a thumbnail for a file
 */
export const main = ApiGatewayWrapper<
  Buffer,
  { fileId: string; filename: string; width: string; height: string }
>(async ({ pathParameters: { fileId, filename, width, height } }) => {
  const { resizedImage, contentType} = await generateThumbnail(
    process.env.FILES_BUCKET_NAME ?? '',
    fileId,
    filename,
    parseInt(width),
    parseInt(height)
  );
  
  return {
    statusCode: 200,
    headers: { 'Content-Type':contentType
    },
      body: resizedImage.toString('base64'),
      isBase64Encoded: true
    } as any
}, true);


export const cfMain: CloudFrontResponseHandler = async (event) => {
  const response = event.Records[0].cf.response;
  const request = event.Records[0].cf.request;
  console.log(response);
  console.log(request.uri);
  
  const statusCode = parseInt(response.status);
//   if (statusCode >= 400 && statusCode <= 599) {

//     response.status = '200';
//     response.statusDescription = 'OK';
//     (response as any).body = 'Body generation example';
// }
  return response;
}