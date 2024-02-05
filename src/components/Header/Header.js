import React from 'react';
import { HeaderContainer, HeaderTitle, HeaderSubtitle, HeaderButton } from './HeaderElements';
import { Link } from 'react-router-dom'; 

const Header = () => {
    return (
        <HeaderContainer>
                <HeaderTitle>Discover a Friend, Change a Life. </HeaderTitle>
            <Link to="/pets" style={{ textDecoration: 'none' }}> 
                <HeaderButton>Adopt Now!</HeaderButton>
            </Link>
            <HeaderSubtitle>Embarking on a journey of adoption is a choice filled with love and hope. Each animal awaiting a home is not just a pet, but a potential friend ready to fill your life with joy, loyalty, and unconditional love.</HeaderSubtitle>
        </HeaderContainer>
    );
};

export default Header;
