import React, { useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface Props {}

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
    console.log("File submitted:", selectedFile);
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
