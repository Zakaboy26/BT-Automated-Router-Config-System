// src/__mocks__/react-router-dom.js
import React from 'react';

// Mock <Link> to behave like a regular <a> tag
export const Link = ({ children, to, ...rest }) => (
    <a href={to} {...rest}>
        {children}
    </a>
);

// Mock useNavigate to return a jest function
export const useNavigate = () => jest.fn();

// Optional: mock other useful hooks
export const useParams = () => ({});
export const useLocation = () => ({ pathname: '/' });
