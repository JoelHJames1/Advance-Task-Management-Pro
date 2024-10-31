import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  error: string;
  success: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileChange,
  onUpload,
  error,
  success
}) => {
  return (
    <div>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          onChange={onFileChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onUpload}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};