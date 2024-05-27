
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [key, setKey] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:5000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        setKey(response.data.key);
        setDownloadLink(response.data.encrypted_file);
    };

    const handleDownload = async () => {
        const response = await axios.post('http://localhost:5000/download', {
            encrypted_file: downloadLink,
            key: key
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'decrypted_file');
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload & Encrypt</button>
            {key && (
                <div>
                    <p>Encryption Key: {key}</p>
                    <button onClick={handleDownload}>Download & Decrypt</button>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
                    