import React, {useState} from 'react';
import Select from 'react-select';
import { AnimalGalleryCard } from ".";
import ImageUploader from './Imageupload';

const AnimalForm = ({ formRef, handleAnimalChange, animal}) => {
    const [imageURL, setImageURL] = useState('');


const handleImageUpload = (url) => {
    setImageURL(url);
    // This callback will update the 'pictureUri' property in the 'animal' state
    handleAnimalChange({ target: { name: 'pictureUri', value: url } });
  };

    const animalTypes = [
        { value: 'Dog', label: 'Dog' },
        { value: 'Cat', label: 'Cat' },
        { value: 'Rabbit', label: 'Rabbit' },
        { value: 'Hamster', label: 'Hamster' },
        { value: 'Bird', label: 'Bird' },
        { value: 'Fish', label: 'Fish' },
        { value: 'Turtle', label: 'Turtle' },
        { value: 'Snake', label: 'Snake' },
        { value: 'Lizard', label: 'Lizard' },
        { value: 'Other', label: 'Other' }
    ];

    const animalAges = () => {
        let baby = animal.type === "Cat" ? "Kitten" : animal.type === "Dog" ? "Puppy" : "Baby";
        return [
            { value: baby, label: baby },
            { value: "Young", label: "Young" },
            { value: "Adult", label: "Adult" },
            { value: "Senior", label: "Senior" }
        ];
    }

    const animalGenders = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" }
    ];

    const animalStatus = [
        { value: "Available", label: "Available" },
        { value: "Pending", label: "Pending" },
        { value: "Unavailable", label: "Not Available" },
        { value: "Adopted", label: "Adopted" }
    ];

    const animalDisposition = [
        { value: "Good with other animals", label: "Good with other animals" },
        { value: "Good with children", label: "Good with children" },
        { value: "Animal must be leashed at all times", label: "Animal must be leashed at all times" },
        { value: "House trained", label: "House trained" },
        { value: "Special needs", label: "Special needs" }
    ];

    const handleSelectChange = (name, value) => {
        // If animal type changes, re-evaluate the age string
        if (name === 'type') {
            const ageMap = { Dog: 'Puppy', Cat: 'Kitten' };
            if (['Kitten', 'Puppy', 'Baby'].includes(animal.age)) {
                animal.age = ageMap[value] || 'Baby';
            }
        
            handleAnimalChange({ target: { name: 'age', value: animal.age } });
        }

        handleAnimalChange({target: { name, value }});
    }
    

    // Styles copied from bootstrap form-control class to make react-select look like a bootstrap input
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            color: 'var(--bs-body-color)',
            backgroundColor: 'var(--bs-body-bg)',
            backgroundClip: 'padding-box',
            border: state.isFocused ? 'var(--bs-border-width) solid #86b7fe' : 'var(--bs-border-width) solid var(--bs-border-color)',
            borderRadius: 'var(--bs-border-radius)',
            transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
            boxShadow: state.isFocused ? '0 0 0 .25rem rgba(13, 110, 253, .25)' : '',
            '&:hover': {},
        }),
    }

    return (
        <div className="row">
            <div className="col-lg-6 mb-4 text-start">
                <form ref={formRef}>
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control mb-2" placeholder="Name" name="name" value={animal.name} onChange={handleAnimalChange} required />
                    
                    <label htmlFor="type" className="form-label text-start">Type</label>
                    <Select className="mb-2" name="type" value={animalTypes.filter(type => type.value === animal.type)} styles={selectStyles}
                        onChange={(e) => handleSelectChange('type', e.value)} required options={animalTypes} placeholder="Select Type" />  
                    
                    <label htmlFor="breed" className="form-label">Breed</label>
                    <input type="text" className="form-control mb-2" placeholder="Breed" name="breed" value={animal.breed} onChange={handleAnimalChange} />

                    <label htmlFor="age" className="form-label text-start">Age</label>
                    <Select className="mb-2" name="age" value={animalAges().filter(age => age.value === animal.age)} styles={selectStyles}
                        onChange={(e) => handleSelectChange('age', e.value)} required options={animalAges()}  placeholder="Select Age" />

                    <label htmlFor="gender" className="form-label text-start">Gender</label>
                    <Select className="mb-2" name="gender" value={animalGenders.filter(gender => gender.value === animal.gender)} styles={selectStyles}
                        onChange={(e) => handleSelectChange('gender', e.value)} required options={animalGenders}  placeholder="Select Gender" />

                    <label htmlFor="disposition" className="form-label text-start">Disposition</label>
                    <Select className="mb-2" name="disposition" onChange={(vals) => handleSelectChange('disposition', vals.map(val => val.value))}
                        options={animalDisposition} styles={selectStyles} isMulti placeholder="Select Disposition"
                        value={animal.disposition ? [...animalDisposition.filter(disposition => animal.disposition.includes(disposition.value))] : []} />
                    
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control mb-2" placeholder="Description" name="description" value={animal.description} onChange={handleAnimalChange}></textarea>

                    {/* <label htmlFor="pictureUri" className="form-label text-start">Image URL</label>
      <input type="url" className="form-control mb-2" placeholder="Image URL" name="pictureUri" value={imageURL} onChange={(e) => handleAnimalChange(e)} /> */}

      {/* The image currently have bug. The  ImageUploader will save the image URL from firebase database and then paste into the animal.pictureUri, 
      the problem it currently facing is, only when user click on upload, it will then get the URL from frirebase database then paste into Image URL above. 
      The image HUGE BUG is it only show preview of the actual image when user click on the IMAGE URL and then type something 
      Note: - Need to be able to load image right away when upload
            - Need to delete previous input so the next "add animal" does not show previous image field*/}

      {/* Include the ImageUploader component and pass the callback */}
      <ImageUploader onImageUpload={handleImageUpload} name="pictureUri" value={imageURL} onChange={(e) => handleAnimalChange(e)}/>
      
                    <label htmlFor="status" className="form-label">Status</label>
                    <Select className="mb-2" name="status" onChange={(e) => handleSelectChange('status', e.value)} required options={animalStatus} styles={selectStyles}
                        value={animalStatus.filter(status => status.value === animal.status)} />

                </form>
            </div>
            <div className="col-lg-6 mt-lg-0 mt-4">
                <div>
                    <AnimalGalleryCard animal={animal} selectable={false} callToAction="" />
                </div>
            </div>
        </div>
    );
};

export default AnimalForm;