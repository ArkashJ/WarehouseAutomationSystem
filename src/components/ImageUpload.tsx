import React, { useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from 'axios';
import { QueueServiceClient } from "@azure/storage-queue";

interface Props {}

const account : String = import.meta.env.VITE_ACCOUNT_NAME;
const accountKey : String = import.meta.env.VITE_AZ_KEY;
const containerName = "uploadimg";

const sasToken = import.meta.env.VITE_SAS_TOKEN;

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net?${sasToken}`
);

const DataEntry: React.FC<Props> = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
  
    try {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobClient = containerClient.getBlockBlobClient(selectedFile.name);
  
      const queueServiceClient = new QueueServiceClient(
        `https://${account}.queue.core.windows.net?${sasToken}`
      );
      const queueClient = queueServiceClient.getQueueClient("images");
  
      const options = {
        blockSize: 4 * 1024 * 1024, // 4MB block size
        concurrency: 20, // Max number of parallel uploads
        onProgress: (ev: any) => console.log("Progress:", ev.loadedBytes),
        blobHTTPHeaders: {
          blobContentType: selectedFile.type,
        },
        metadata: {
          fileName: selectedFile.name,
        },
      };
  
      await blobClient.uploadBrowserData(selectedFile, options);
  
      console.log("File uploaded to Blob Storage:", selectedFile.name);
  
      const imageUrl = blobClient.url;
      await queueClient.sendMessage(imageUrl);
  
    } catch (error) {
      console.error("Error uploading file to Blob Storage:", error);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Data Entry
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload Product Image
          </Button>
        </label>
        {selectedFile && (
          <Typography variant="subtitle1" component="p">
            {selectedFile.name}
          </Typography>
        )}
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!selectedFile}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DataEntry;
