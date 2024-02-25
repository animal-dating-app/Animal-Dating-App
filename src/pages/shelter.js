import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { AnimalGalleryCard } from "../components/Cards";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ShelterInfoCard from "../components/Cards/ShelterInfoCard";

const Shelter = () => {
	const [animals, setAnimals] = useState([]);
	const [shelter, setShelter] = useState({});
	const navigate = useNavigate();

	// If id not in the URL, redirect to 404
	let { id } = useParams();
	if (!id) navigate("/404");

	useEffect(() => {
		const loadShelter = async () => {
			const q = query(
				collection(db, "shelters"),
				where("shelterId", "==", id),
				limit(1)
			);
			const shelterSnapshot = await getDocs(q);
			if (shelterSnapshot.empty) {
				navigate("/404");
			} else {
				setShelter(shelterSnapshot.docs[0].data());
			}
		};

		loadShelter();
	}, [id, navigate]);

	useEffect(() => {
		const getAnimals = async () => {
			const q = query(
				collection(db, "animals"),
				where("shelterId", "==", id),
				where("status", "in", ["Available", "Pending", "Adopted"])
			);
			const animalSnapshot = await getDocs(q);
			const animalList = animalSnapshot.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});
			setAnimals(animalList);
		};

		getAnimals();
	}, [id]);

	return (
		<div className="container mb-4">
			<div className="container pt-2">
				<h2 className="text-start pb-3">{shelter.name}</h2>
				<ShelterInfoCard shelterId={id} />
				{ animals.filter(animal => animal.featured && (animal.status === "Available" || animal.status === "Pending")).length > 0 && (
					<>
						<h3 className="text-start pb-2">Featured Animals</h3>
						<div className="row pb-4">
							{animals
								.filter((animal) => animal.featured && (animal.status === "Available" || animal.status === "Pending"))
								.map((animal) => (
									<div
										className="col-6 col-md-4 col-lg-3 d-flex align-items-stretch my-2"
										key={animal.id}
									>
										<AnimalGalleryCard
											animal={animal}
											callToAction=""
											onClickAnimal={() =>
												navigate("/pet", { state: { pet: animal } })
											}
										/>
									</div>
								))}
						</div>
					</>
				)}

				<h3 className="text-start pb-2">
					{ animals.filter(animal => animal.featured).length > 0 ? "All Animals" : "Animals" }
				</h3>
				{animals.length === 0 && (
					<p className="text-start">
						This shelter has no animals available for adoption. Check back
						later!
					</p>
				)}
				<div className="row pb-4">
					{animals.filter((animal) => animal.status === "Available" || animal.status === "Pending").map((animal) => (
						<div
							className="col-6 col-md-4 col-lg-3 d-flex align-items-stretch my-2"
							key={animal.id}
						>
							<AnimalGalleryCard
								animal={animal}
								callToAction=""
								onClickAnimal={() =>
									navigate("/pet", { state: { pet: animal } })
								}
							/>
						</div>
					))}
				</div>

				{ animals.filter(animal => animal.status === "Adopted").length > 0 && (
					<>
						<h3 className="text-start pb-2">Recently Adopted</h3>
						<div className="row pb-4">
							{animals
								.filter((animal) => animal.status === "Adopted")
								.map((animal) => (
									<div
										className="col-6 col-md-4 col-lg-3 d-flex align-items-stretch my-2"
										key={animal.id}
									>
										<AnimalGalleryCard
											animal={animal}
											callToAction=""
										/>
									</div>
								))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Shelter;
