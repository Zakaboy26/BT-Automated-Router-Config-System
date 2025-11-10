import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import * as orderService from '../services/orderService';
import useAuth from '../components/Auth/useAuth';

jest.mock('react-router-dom');

// Mock MUI components or layout if needed
jest.mock('@mui/material', () => {
    const original = jest.requireActual('@mui/material');
    return {
        ...original,
        CircularProgress: () => <div data-testid="spinner" />,
    };
});

// Mock components used inside the page
jest.mock('../components/Navigation/Sidebar', () => () => <div data-testid="sidebar">Sidebar</div>);
jest.mock('../components/OrderHistory/OrderExport', () => () => <div data-testid="export">OrderExport</div>);
jest.mock('../components/OrderHistory/RouterDetailsModal', () => () => <div data-testid="modal">RouterDetailsModal</div>);

// Mock useAuth
jest.mock('../components/Auth/useAuth');

// Mock service call
jest.mock('../services/orderService');

describe('OrderHistoryPage', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            userRole: 'USER',
            activeTab: 'orders',
            setActiveTab: jest.fn(),
            loading: false,
            setLoading: jest.fn(),
        });

        jest.clearAllMocks();
    });

    test('renders correctly when no orders exist', async () => {
        orderService.fetchOrderHistory.mockResolvedValue([]);
        render(<OrderHistoryPage />);

        expect(screen.getByText('Order History')).toBeInTheDocument();
        expect(screen.getByText(/View your previous orders/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/No orders found/i)).toBeInTheDocument();
        });

        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('export')).toBeInTheDocument();
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    test('renders table when orders exist', async () => {
        orderService.fetchOrderHistory.mockResolvedValue([
            {
                routerOrderID: 1,
                referenceNumber: 'REF123',
                customer: { customerName: 'Test Customer' },
                siteName: 'Test Site',
                router: { routerName: 'Router X' },
                priorityLevel: 'High',
                status: 'Completed'
            }
        ]);

        render(<OrderHistoryPage />);

        await waitFor(() => {
            expect(screen.getByText('REF123')).toBeInTheDocument();
            expect(screen.getByText('Test Customer')).toBeInTheDocument();
            expect(screen.getByText('Test Site')).toBeInTheDocument();
            expect(screen.getByText('Router X')).toBeInTheDocument();
            expect(screen.getByText('High')).toBeInTheDocument();
            expect(screen.getByText('Completed')).toBeInTheDocument();
        });
    });

    test('shows error message on fetch failure', async () => {
        console.error = jest.fn(); // Silence expected error logs
        orderService.fetchOrderHistory.mockRejectedValue(new Error('API failure'));

        render(<OrderHistoryPage />);

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error loading orders:', expect.any(Error));
        });
    });

    test('opens modal when View Details is clicked', async () => {
        const mockOrder = {
            routerOrderID: 2,
            referenceNumber: 'REF456',
            customer: { customerName: 'Client Name' },
            siteName: 'Client Site',
            router: { routerName: 'Router Y' },
            priorityLevel: 'Medium',
            status: 'Pending'
        };

        orderService.fetchOrderHistory.mockResolvedValue([mockOrder]);
        orderService.fetchOrderDetails.mockResolvedValue(mockOrder);

        render(<OrderHistoryPage />);

        await waitFor(() => {
            expect(screen.getByText('REF456')).toBeInTheDocument();
        });

        const viewDetailsButton = screen.getByText('View Details');
        fireEvent.click(viewDetailsButton);

        await waitFor(() => {
            expect(screen.getByTestId('modal')).toBeInTheDocument();
        });
    });
});
