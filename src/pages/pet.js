import {useLocation} from 'react-router-dom';
import  { AnimalCard }  from "../components/Cards";

const Pet = () => {

    const location = useLocation();

    const animal = location.state.pet;

    return (
        <div class="container">
            <div class=" col-sm-5 mx-auto">
                <AnimalCard animal={animal} />
            </div>
        </div>
    );
};

export default Pet;