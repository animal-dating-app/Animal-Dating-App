import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, push } from 'firebase/database';
import { storage as firebaseStorage  } from '../../firebaseConfig';

const ImageUploader = ({onImageUpload}) => {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);

    // Display a preview of the selected image
    const urls = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
    setImageUrls(urls);
  };

  const uploadImage = async () => {
    if (files.length > 0) {
      try {
        // Store the download URL in Firebase Realtime Database
        const db = getDatabase();
        const imagesRef = dbRef(db, 'images');
        const uploadPromises = Array.from(files).map(async file => {
          const storageRef = ref(firebaseStorage, `images/${file.name}`);
          
          // Upload the file to Firebase Storage
          await uploadBytes(storageRef, file);

          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(storageRef);

          push(imagesRef, { url: downloadURL });
          return downloadURL;
        });

        const downloadUrls = await Promise.all(uploadPromises);
        onImageUpload(downloadUrls);

        console.log('Image uploaded to Firebase Storage:', downloadUrls);
        
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      alert('Please select at least one file before uploading.');
    }
  };

  
  //  Fixed Problem with reload form when type input before upload image 
  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" multiple />
      <button type='button' style={buttonStyles} onClick={uploadImage}>Upload Image</button>

      <div>
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Preview ${index}`} style={{maxWidth: '100px', maxHeight: '100px', margin: '5px'}} />
      ))}
      </div>
    </div>
  );
};

const buttonStyles = {
  backgroundColor: 'var(--bs-primary)',  // Use the same primary color as your selectStyles
  color: 'white',
  padding: '10px',
  border: 'none',  // Remove the border to make it consistent with selectStyles
  borderRadius: 'var(--bs-border-radius)',
  cursor: 'pointer',  // Add a pointer cursor for interaction
  transition: 'background-color .15s ease-in-out',  // Smooth transition on hover
  outline: 'none',  // Remove the outline on focus (for accessibility)
  // Add any other styles you want to apply
};

export default ImageUploader;
