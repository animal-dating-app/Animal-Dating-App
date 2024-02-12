import React from 'react';
import ImageUploading from 'react-images-uploading';

export function ImageUploader() {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const maxFileSize = 5 * 1024 * 1024; // 5 MB

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const handleImageUpload = (image, imageList, updateImageList, addUpdateIndex) => {
    if (image.file.size > maxFileSize) {
      // Resize the image before uploading
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800; //  maximum width
          const maxHeight = 800; // maximum height
          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);

          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], image.file.name, {
              type: 'image/jpeg', // Adjust the type if needed
              lastModified: Date.now(),
            });
            updateImageList(addUpdateIndex, { file: resizedFile, dataURL: e.target.result });
          }, 'image/jpeg', 0.9); // Adjust quality if needed
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(image.file);
    } else {
      updateImageList(addUpdateIndex, image);
    }
  };

  return (
    <div className="ImageUploader">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        imageResize={{ width: 800, height: 800 }}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // For later styling
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={() => onImageUpload(handleImageUpload)}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

export default ImageUploader;
