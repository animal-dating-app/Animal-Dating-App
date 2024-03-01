import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, push } from 'firebase/database';
import { storage as firebaseStorage  } from '../../firebaseConfig';




// This component allows users to upload an image to Firebase Storage and store the download URL in Firebase Realtime Database
// The onImageUpload callback is called with the download URL of the uploaded image
//  - This component is used in the AnimalForm component to allow users to upload an image of an animal
//  - The onImageUpload callback is used to store the download URL of the uploaded image in the animal object
//  - The download URL is then stored in the Firebase Realtime Database along with the other animal details
//  - The ImageUploader component is used in the AnimalForm component to allow users to upload an image of an animal
// Need add a function that willl delete previous input so the next "add animal" does not show previous image field
const ImageUploader = ({onImageUpload}) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Display a preview of the selected image
    const objectURL = URL.createObjectURL(selectedFile);
    setImageUrl(objectURL);
  };

  const uploadImage = async () => {
    if (file) {
      const storageRef = ref(firebaseStorage, `images/${file.name}`);

      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Store the download URL in Firebase Realtime Database
        const db = getDatabase();
        const imagesRef = dbRef(db, 'images');
        push(imagesRef, { url: downloadURL });
        onImageUpload(downloadURL);

        console.log('Image uploaded to Firebase Storage:', imageUrl);
        console.log('URL stored in the database:', downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      alert('Please select a file before uploading.');
    }
  };


  //  Fixed Problem with reload form when type input before upload image 
  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button type='button' onClick={uploadImage}>Upload Image</button>
    </div>
  );
};

export default ImageUploader;
