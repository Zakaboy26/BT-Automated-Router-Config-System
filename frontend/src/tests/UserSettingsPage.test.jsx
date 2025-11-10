import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserSettingsPage from '../pages/UserSettingsPage';

// Mock components used inside the page
jest.mock('../components/Navigation/Sidebar', () => () => <div data-testid="sidebar">Sidebar</div>);
jest.mock('../components/UserSettings/ChangePasswordModal', () => () => <div data-testid="password-modal">ChangePasswordModal</div>);

describe('UserSettingsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Stub fetch to return mock user data
        global.fetch = jest.fn((url, options) => {
            if (url.includes('/api/user/settings')) {
                if (options && options.method === 'PUT') {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({})
                    });
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@example.com',
                        phoneNumber: '1234567890',
                        businessType: 'Small Business',
                        vatNumber: 'VAT123456',
                        billingAddress: '123 Test Street',
                        twoFactorAuth: true,
                        orderUpdates: true,
                        billingNotifications: false,
                        marketingEmails: false
                    })
                });
            }

            return Promise.reject('Unhandled fetch');
        });
    });

    test('renders and fetches user data', async () => {
        render(<UserSettingsPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
            expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
        });
    });

    test('submits form successfully', async () => {
        render(<UserSettingsPage />);

        await waitFor(() => screen.getByDisplayValue('John'));

        fireEvent.change(screen.getByLabelText(/First Name/i), {
            target: { value: 'Jane', name: 'firstName' },
        });

        fireEvent.click(screen.getByText('Apply Changes'));

        await waitFor(() => {
            expect(screen.getByText(/Changes applied successfully!/i)).toBeInTheDocument();
        });
    });

    test('opens change password modal', async () => {
        render(<UserSettingsPage />);

        await waitFor(() => screen.getByDisplayValue('John'));

        fireEvent.click(screen.getByText('Change Password'));
        expect(screen.getByTestId('password-modal')).toBeInTheDocument();
    });
});
