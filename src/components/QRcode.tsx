import { BlobServiceClient } from '@azure/storage-blob';
import QRCode from 'qrcode';

const connectionString: string = '<your_connection_string>';
const sourceContainerName: string = 'product-images';
const targetContainerName: string = 'qr-codes';

async function generateQRCodeImage(url: string): Promise<string | undefined> {
  try {
    const qrCodeImage = await QRCode.toDataURL(url);
    return qrCodeImage;
  } catch (error) {
    console.error(`Failed to generate QR code for ${url}`, error);
  }
}

async function processProductImages(): Promise<void> {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const sourceContainerClient = blobServiceClient.getContainerClient(sourceContainerName);
  const targetContainerClient = blobServiceClient.getContainerClient(targetContainerName);

  for await (const blob of sourceContainerClient.listBlobsFlat()) {
    const imageUrl = sourceContainerClient.getBlobClient(blob.name).url;
    const qrCodeImage = await generateQRCodeImage(imageUrl);

    if (qrCodeImage) {
      const qrCodeName = `${blob.name.split('.')[0]}-qr.png`;
      const qrCodeBlobClient = targetContainerClient.getBlockBlobClient(qrCodeName);
      const qrCodeImageBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');

      await qrCodeBlobClient.uploadData(qrCodeImageBuffer, {
        blobHTTPHeaders: { blobContentType: 'image/png' },
      });

      console.log(`Generated QR code for ${blob.name}: ${qrCodeName}`);
    }
  }
}

processProductImages();
