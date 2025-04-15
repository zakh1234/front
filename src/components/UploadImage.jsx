import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image || !title) {
      setMessage('Please enter a title and choose an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:3000/api/upload-image', formData);
      setMessage('Image uploaded successfully!');
      setTitle('');
      setImage(null);
      setPreview(null);
    } catch (error) {
      setMessage('Error uploading image.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Upload an Image</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Enter image title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {preview && (
          <div>
            <p className="mt-2 text-sm font-semibold">Preview:</p>
            <img src={preview} alt="Preview" className="w-48 mt-2 rounded-lg shadow" />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Upload
        </button>

        {message && <p className="text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default UploadImage;