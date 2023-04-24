import React, { useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from 'axios';

interface Props {}

const account = "imageuploadstored";
const accountKey = "sckxjS+pu93LuPHZSZ2XeQXRJ7yQzAkaEa3ebU3Fma/k9f/dmEx1HqoA4YUAxJF3Tz57/e0iVeO/+AStmAjeYQ==";
const containerName = "uploadimg";

const sasToken = "?sv=2021-12-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-04-24T08:53:14Z&st=2023-04-24T00:53:14Z&spr=https&sig=%2FkZsSMWcH9luT7xGV1meb4HqD7RyPD4Zuj5JSiSza2U%3D";

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

    // Implement the logic to send the file to the backend here
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(selectedFile.name);
    
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
        try {
          const imageUrl = blobClient.url;
          const functionUrl = 'https://functioninventory.azurewebsites.net/api/image_to_text';
        
          const response = await axios.post(functionUrl, { imageUrl }, { headers: { 'Content-Type': 'application/json' } });
        
          if (response.status === 200) {
            console.log('Azure Function successfully processed the image:', selectedFile.name);
          } else {
            console.error('Error processing image with Azure Function:', response.status);
          }
        } catch (error) {
          console.error('Error calling Azure Function:', error);
        }
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
