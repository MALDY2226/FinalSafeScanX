import React, { useState, useRef } from 'react';
import { Upload, Link } from 'lucide-react';

interface ScanFormProps {
  onScan: (input: string, isFile: boolean) => void;
}

const ScanForm: React.FC<ScanFormProps> = ({ onScan }) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onScan(url, false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 32 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert('File size must be 32 MB or less.');
      e.target.value = '';
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= 32 * 1024 * 1024) {
      setFile(droppedFile);
    } else {
      alert('File size must be 32 MB or less.');
    }
  };

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onScan(file.name, true);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleUrlSubmit} className="mb-4">
        <div className="flex items-center border-b border-blue-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="url"
            placeholder="Enter URL to scan"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            <Link className="mr-2" /> Scan URL
          </button>
        </div>
      </form>

      <div
        className="border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto mb-2" />
        <p>Drag & drop a file here or click to select</p>
        <p className="text-sm text-gray-500">(Max file size: 32 MB)</p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {file && (
        <form onSubmit={handleFileSubmit} className="mt-4">
          <p className="mb-2">Selected file: {file.name}</p>
          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Scan File
          </button>
        </form>
      )}
    </div>
  );
};

export default ScanForm;