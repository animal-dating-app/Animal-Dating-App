import React from 'react';
import { HeaderContainer, LogoSloganWrapper, Slogan, HeaderTitle, HeaderSubtitle, Logo, HeaderButton } from './HeaderElements';
import logoImage from '../../assets/images/logo.jpg';
import { Link } from 'react-router-dom'; 

const Header = () => {
    return (
        <HeaderContainer>
            <LogoSloganWrapper>
            <Slogan>Dating App for Animal Adoption</Slogan>
            <Logo src={logoImage} alt="Logo" />
            </LogoSloganWrapper>
                <HeaderTitle>Discover a Friend, Change a Life. </HeaderTitle>
            <Link to="/pets" style={{ textDecoration: 'none' }}> 
                <HeaderButton>Adopt Now!</HeaderButton>
            </Link>
            <HeaderSubtitle>Embarking on a journey of adoption is a choice filled with love and hope. Each animal awaiting a home is not just a pet, but a potential friend ready to fill your life with joy, loyalty, and unconditional love.</HeaderSubtitle>
        </HeaderContainer>
    );
};

export default Header;
