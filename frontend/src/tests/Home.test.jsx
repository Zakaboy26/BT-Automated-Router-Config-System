import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from '../components/Home/Home';

// Enable fetch mocks
beforeEach(() => {
    fetch.resetMocks();
});

// Mock useAuth
jest.mock('../components/Auth/useAuth', () => ({
    __esModule: true,
    default: () => ({
        userRole: 'ADMIN',
        loading: false,
        navigate: jest.fn(),
        activeTab: 'home',
        setActiveTab: jest.fn(),
        isAllowed: (allowedRoles) => allowedRoles.includes('ADMIN')
    })
}));

describe('Home Component', () => {
    test('renders admin features for admin role', async () => {
        //Given: API is mocked to return user data
        fetch.mockResponseOnce(JSON.stringify({ firstName: 'John' }));

        //When: Home component is rendered with admin role
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        //Then: Greeting should be displayed
        await waitFor(() => {
            expect(screen.getByText(/good/i)).toBeInTheDocument();
        });

        const allMains = screen.getAllByRole('main');
        const main = allMains[allMains.length - 1];

        //Then: Admin features should be visible
        expect(within(main).getByText('Routers')).toBeInTheDocument();
        expect(within(main).getByText('Customers')).toBeInTheDocument();
        expect(within(main).getByText('Users')).toBeInTheDocument();
        expect(within(main).getByText('Router Management')).toBeInTheDocument();
    });

    test('renders user features for user role', async () => {
        //Given: API is mocked to return user data and useAuth is set to USER role
        fetch.mockResponseOnce(JSON.stringify({ firstName: 'John' }));
        jest.spyOn(require('../components/Auth/useAuth'), 'default')
            .mockImplementation(() => ({
                userRole: 'USER',
                loading: false,
                navigate: jest.fn(),
                activeTab: 'home',
                setActiveTab: jest.fn(),
                isAllowed: (allowedRoles) => allowedRoles.includes('USER')
            }));

        //When: Home component is rendered with user role
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        //Then: Greeting should be displayed
        await waitFor(() => {
            expect(screen.getByText(/good/i)).toBeInTheDocument();
        });

        const allMains = screen.getAllByRole('main');
        const main = allMains[allMains.length - 1];

        //Then: User features should be visible
        expect(within(main).getByText('Router Request Form')).toBeInTheDocument();
        expect(within(main).getByText('Order History')).toBeInTheDocument();
        expect(within(main).getByText('Help Guide')).toBeInTheDocument();

        //Then: Admin cards should show access restricted
        const adminCards = within(main).getAllByText('Access restricted');
        adminCards.forEach(card => {
            const parentCard = card.closest('.MuiCard-root');
            const title = within(parentCard).getByRole('heading', { level: 6 });
            expect(['Users', 'Router Management', 'Routers', 'Customers', 'News & Updates', 'View User Reports']).toContain(title.textContent);
        });
    });
});
