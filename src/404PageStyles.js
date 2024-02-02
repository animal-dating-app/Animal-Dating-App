import styled from "styled-components";

export const ErrorPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #f2f2f2;
`;

export const ErrorCode = styled.h1`
    font-size: 10rem;
    color: #404040;
`;

export const ErrorMessage = styled.h2`
    font-size: 2rem;
    color: #606060;
    margin: 0;
`;

export const HomeButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    background-color: #809bce;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #667ba9;
    }
`;
