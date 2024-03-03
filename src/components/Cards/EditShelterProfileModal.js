import React, { useState, useRef, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import ImageUploader from "./Imageupload";

const EditShelterProfileModal = ({ showModal, setShowModal, shelter, shelterDocId, onShelterUpdate }) => {
	const [unsavedChanges, setUnsavedChanges] = useState(false);
	const [currentShelter, setCurrentShelter] = useState(shelter);

  const handleImageUpload = (url) => {
    // This callback will update the 'pictureUri' property in the 'animal' state
		let newImages = [...currentShelter.headerImages];
		newImages.push(url);
		setCurrentShelter({ ...currentShelter, headerImages: newImages });
  };

	useEffect(() => {
		setCurrentShelter(shelter);
	}, [shelter]);

	const formRef = useRef(null);

	useEffect(() => {
		if (!showModal) {
			setUnsavedChanges(false);
		}
	}, [showModal]);

	const handleModalClose = () => {
		if (unsavedChanges) {
			const confirmLeave = window.confirm(
				"You have unsaved changes. Are you sure you want to close?"
			);
			if (confirmLeave) {
				setShowModal(false);
			}
		} else {
			setShowModal(false);
		}
	};

	const handleShelterChange = (e) => {
		setUnsavedChanges(true);
		setCurrentShelter({ ...currentShelter, [e.target.name]: e.target.value });
	};

    const handleUpdateShelter = () => {
        const updateShelter = async () => {
            if (formRef.current && formRef.current.checkValidity()) {
                let curShelterBody = {
                    ...currentShelter,
                }

                await updateDoc(doc(db, "shelters", shelterDocId), curShelterBody);
                setShowModal(false);
                setUnsavedChanges(false);

                if (onShelterUpdate) {
                    onShelterUpdate(currentShelter);
                }

            } else {
                formRef.current && formRef.current.reportValidity();
            }
        }

        updateShelter();
    };

	const overlayStyle = {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim the background
		backdropFilter: "blur(5px)", // Apply blur effect (not supported in all browsers)
		zIndex: 10, // Ensure it's above other content but below the modal
	};

	return (
		<>
			{showModal && <div style={overlayStyle}></div>}
			<div
				className={`modal ${showModal ? "show" : ""}`}
				style={{ display: showModal ? "block" : "none" }}
				tabIndex="-1"
			>
				<div className="modal-dialog modal-xl modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Edit Shelter Profile</h5>
							<button
								type="button"
								className="btn-close"
								onClick={handleModalClose}
							></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-lg-12 mb-4 text-start">
									<form ref={formRef}>
										<label htmlFor="email" className="form-label">
												Public Email
										</label>

										<input
												type="email"
												className="form-control mb-2"
												placeholder="Email"
												name="email"
												value={currentShelter?.email}
												onChange={handleShelterChange}
												required
										/>

										<label htmlFor="description" className="form-label">
											Description
										</label>
										<textarea
											className="form-control mb-2"
											placeholder="Description"
											name="description"
											value={currentShelter?.description}
											onChange={handleShelterChange}
										></textarea>

										<label htmlFor="images" className="form-label">
											Header Images
										</label>
										{/* Show list of existing images with delete buttons */}
										{ currentShelter.headerImages && currentShelter.headerImages.length > 0 && (
											<table className="table">
												<thead>
													<tr>
														<th>Image</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
													{currentShelter.headerImages.map((image, index) => (
														<tr key={index}>
															<td>
																<img src={image} alt="header" style={{width: "128px"}} />
															</td>
															<td>
																<button type="button" className="btn btn-danger" onClick={() => {
																	let newImages = [...currentShelter.headerImages];
																	newImages.splice(index, 1);
																	setCurrentShelter({ ...currentShelter, headerImages: newImages });
																}}>Delete</button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										)}
										{/* Add new images */}
										<ImageUploader
											onImageUpload={handleImageUpload}
											name="pictureUri"
										/>  
									</form>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={handleModalClose}
							>
								Close
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleUpdateShelter}
							>
								Update Profile
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditShelterProfileModal
