import React, { useState } from 'react';
import { CloudUpload, Trash2 } from 'lucide-react';
import { Container, Card, Button, Form } from 'react-bootstrap';

const StepFour = ({ data, setData }) => {
  const [files, setFiles] = useState([]);

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Only update the image array in parent
    setData(prevData => ({
      ...prevData,
      image: [...prevData.image, ...newFiles.map(f => f.file)]
    }));

    newFiles.forEach(f => simulateUpload(f));
  };

  const simulateUpload = (fileObj) => {
    const interval = setInterval(() => {
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f === fileObj
            ? { ...f, progress: Math.min(f.progress + 5, 100) }
            : f
        )
      );
    }, 100);
    setTimeout(() => clearInterval(interval), 2200);
  };

  const removeFile = (fileObj) => {
    setFiles(prev => prev.filter(f => f !== fileObj));
    setData(prevData => ({
      ...prevData,
      image: prevData.image.filter(f => f !== fileObj.file)
    }));
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center py-4">
      <div className="text-center mb-4">
        <h1 className="mb-2">Upload Images</h1>
        <p className="text-muted">Upload images to preview them below.</p>
      </div>

      <Card className="p-3 shadow-lg rounded-4 w-100">
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
