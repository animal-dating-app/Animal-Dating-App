import styled from 'styled-components';
import backgroundImage from '../../assets/images/header-krista-mangulsone.jpg';

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // This centers the title and subtitle
  font-size: 25px;
  padding: 60px;
  background: linear-gradient(
              rgba(0, 0, 0, 0.5),
              rgba(0, 0, 0, 0.5)
            ),
            url(${backgroundImage}) no-repeat center center / cover;  
  color: #DFC8B3;
`;

export const LogoSloganWrapper = styled.div`
  align-self: flex-start; 
  text-align: left;
  display: flex;
  flex-direction: column;
`;

export const HeaderTitle = styled.h1`
  color: #FFFFFF; 
  margin: 0;
  padding: 0;
  text-align: center; 
`;

export const HeaderButton = styled.h1`
  padding: 20px 20px;
  background-color: #4CAF50; 
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
  border-radius: 5px; 
  font-size: 20px; 
  margin: 10px;

  &:hover {
    background-color: #45a049; 
  }
`;

export const HeaderSubtitle = styled.p`
  margin: 20px auto; 
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5); 
  font-style: italic; 
  color: #333; 
  max-width: 80%; 
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
  border-radius: 5px; 

  @media (max-width: 768px) {
    max-width: 95%; 
  }
`;


export const Logo = styled.img`
  height: auto;       
  width: auto;        
  max-width: 50%;    
  max-height: 100px;  
  margin-bottom: 10px;
`;


export const Slogan = styled.p`
  margin: 0;
  font-size: 0.5em;
  font-weight: bold;
  color: #FFFFFF;
`;
