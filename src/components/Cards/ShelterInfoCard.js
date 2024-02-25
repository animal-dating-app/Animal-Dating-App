
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

function ShelterInfoCard({ shelterId }) {
    const [shelter, setShelter] = useState({});

    useEffect(() => {
		const loadShelter = async () => {
			const q = query(
				collection(db, "shelters"),
				where("shelterId", "==", shelterId),
				limit(1)
			);
			const shelterSnapshot = await getDocs(q);
			if (!shelterSnapshot.empty) {
				setShelter(shelterSnapshot.docs[0].data());
			}
		};

		loadShelter();
	}, [shelterId]);

    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className={shelter.address ? "col-md-8" : "col-md-12"}>
                    <div className="card-body text-start" style={{padding: "2rem", paddingBottom: "3rem"}}>
                        <h4 className="card-title">About {shelter.name}</h4>
                        <p className="card-text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec
                            purus feugiat, molestie ipsum et, consequat nibh. Etiam non elit dui.
                            Nulla nec purus feugiat, molestie ipsum et, consequat nibh. Etiam non
                            elit dui.
                        </p>
                        <h4 className="card-title">Contact Information</h4>
                        <p className="card-text">
                            {shelter.address && <>
                                <strong>Address:</strong>&nbsp;<a href={`https://www.google.com/maps/search/?api=1&query=${shelter.address}`} target="_blank" rel="noreferrer">{shelter.address}</a>
                                <br />
                            </>
                            }
                            {shelter.phone && <>
                                <strong>Phone Number:</strong>&nbsp;<a href={`tel:${shelter.phone}`}>{shelter.phone}</a>
                                <br />
                            </>
                            }
                            {shelter.email && <>
                                <strong>Email:</strong>&nbsp;<a href={`mailto:${shelter.email}`}>{shelter.email}</a>
                                    <br />
                                </>
                            }
                            {shelter.website && <>
                                <strong>Website:</strong>&nbsp;<a href={shelter.website} target="_blank" rel="noreferrer">{shelter.website}</a> 
                                <br />
                            </>
                            }
                        </p>
                        {/* <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p> */}
                    </div>
                </div>
                {shelter.address && (
                <div className="col-md-4">
                    {/* Google Maps */}
                    <div id="map" style={{width: "100%", height: "100%"}}>
                        <iframe
                            title="Google Maps"
                            width="100%"
                            height="100%"
                            style={{border: "0"}}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${shelter.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                    
                    </div>

                </div>
                )}
            </div>
        </div>
    );
}

export default ShelterInfoCard;