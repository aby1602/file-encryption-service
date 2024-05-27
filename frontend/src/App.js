import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [filename, setFilename] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setKey(response.data.key);
      setFilename(response.data.filename);
      alert('File encrypted successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.post(`http://localhost:5001/download/${filename}`, { key }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      alert('File decrypted successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  return (
    <div className="App">
      <h1>File Encryption Service</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Encrypt</button>
      {key && (
        <>
          <p>Encryption Key: {key}</p>
          <button onClick={handleDownload}>Download and Decrypt</button>
        </>
      )}
      <div className="suggestions">
        <div className="suggestion">
          <h2>Data Encryption</h2>
          <p>Ensure your sensitive data is securely encrypted to prevent unauthorized access. Our service uses strong encryption algorithms to protect your files.</p>
        </div>
        <div class="suggestion">
          <h2>Secure File Sharing</h2>
          <p>Share files securely with end-to-end encryption. Only authorized users with the correct decryption key can access the shared files.</p>
        </div>
        <div className="suggestion">
          <h2>Data Integrity</h2>
          <p>Verify the integrity of your files to ensure they have not been tampered with. Our service provides file hashing and verification mechanisms.</p>
        </div>
        <div className="suggestion">
          <h2>Secure Backup</h2>
          <p>Backup your important files with encryption to ensure they are safe and recoverable in case of data loss or ransomware attacks.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
