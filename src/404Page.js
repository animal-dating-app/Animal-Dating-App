import React from "react";
import { ErrorPageContainer, ErrorCode, ErrorMessage, HomeButton } from "./404PageStyles";

const PageNotFound = () => {
    return (
        <ErrorPageContainer>
            <ErrorCode>404</ErrorCode>
            <ErrorMessage>Page Not Found</ErrorMessage>
            <HomeButton onClick={() => window.location.href = '/'}>Go Home</HomeButton>
        </ErrorPageContainer>
    );
};

export default PageNotFound;
