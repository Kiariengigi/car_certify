import React, { useState } from 'react';
import { CloudUpload, Trash2 } from 'lucide-react';
import { Container, Row, Col, Card, Button, ProgressBar, Form } from 'react-bootstrap';

const StepFour = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Handle file selection
  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => simulateUpload(f));
  };

  // Simulate upload progress
  const simulateUpload = (fileObj) => {
    const interval = setInterval(() => {
      setFiles((prevFiles) =>
        prevFiles.map((f) => {
          if (f === fileObj) {
            const newProgress = f.progress + 5;
            return { ...f, progress: newProgress >= 100 ? 100 : newProgress };
          }
          return f;
        })
      );
    }, 100);
    setTimeout(() => clearInterval(interval), 2200); // Stop after 2.2s
  };

  // Remove a file
  const removeFile = (fileObj) => {
    setFiles((prev) => prev.filter((f) => f !== fileObj));
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center py-4">
      <div className="text-center mb-4">
        <h1 className="mb-2">Upload Images</h1>
        <p className="text-muted">Upload images to preview them below.</p>
      </div>

      <Card className="p-3 shadow-lg rounded-4 w-100" style={{ Width: '100%' }}>
        {/* Drop Zone */}
        <Form.Group className="text-center mb-4">
          <Form.Label
            className="d-block p-4 mb-0 bg-light rounded-4 border-2"
            style={{ cursor: 'pointer' }}
          >
            <div className="mb-2 d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" style={{ width: '48px', height: '48px', margin: '0 auto' }}>
              <CloudUpload size={24} />
            </div>
            <p className="mb-1">Click to browse</p>
            <small className="text-muted">Max file size up to 5 MB</small>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              style={{ display: 'none' }}
            />
          </Form.Label>
        </Form.Group>

        {/* Uploaded Files */}
        <div className="mb-3">
          {files.map((f, index) => (
            <Card key={index} className="mb-2 p-2 d-flex align-items-center justify-content-between shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={f.preview}
                  alt={f.file.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <h6 className="mb-0">{f.file.name}</h6>
                  <small className="text-muted">{(f.file.size / 1024 / 1024).toFixed(2)} MB</small>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end">
                <Button variant="link" className="p-0 text-danger mb-1" onClick={() => removeFile(f)}>
                  <Trash2 size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </Container>
  );
};

export default StepFour;
