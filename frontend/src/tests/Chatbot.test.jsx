import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatBot from '../components/ChatBot/ChatBot';
import geminiService from '../services/geminiService';

// Mock the scrollIntoView function
Element.prototype.scrollIntoView = jest.fn();

// Mock console.error to prevent error messages in test output
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock the Gemini service
jest.mock('../services/geminiService', () => ({
    generateResponse: jest.fn()
}));

describe('ChatBot Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        geminiService.generateResponse.mockResolvedValue('I am an AI assistant. How can I help you?');
    });

    test('sends message and receives response', async () => {
        //Given: ChatBot is initialized and mock response is set up
        const mockResponse = "Here's how you can submit a router request...";
        geminiService.generateResponse.mockResolvedValueOnce(mockResponse);
        render(<ChatBot />);

        //When: User opens chat and sends a message
        fireEvent.click(screen.getByRole('button', { name: 'Chat with Support' }));
        const input = await screen.findByPlaceholderText('Type your message...');
        fireEvent.change(input, { target: { value: 'How do I submit a router request?' } });
        fireEvent.click(screen.getByTestId('SendIcon').closest('button'));

        //Then: Response should be displayed
        await waitFor(() => {
            expect(screen.getByText(mockResponse)).toBeInTheDocument();
        });
    });

    test('handles quick response selection', async () => {
        //Given: ChatBot is initialized and mock response is set up
        const mockResponse = "To track your order, please...";
        geminiService.generateResponse.mockResolvedValueOnce(mockResponse);
        render(<ChatBot />);

        //When: User opens chat and clicks quick response
        fireEvent.click(screen.getByRole('button', { name: 'Chat with Support' }));
        const quickResponse = await screen.findByRole('button', {
            name: /how do i track my order\?/i
        });
        fireEvent.click(quickResponse);

        //Then: Response should be displayed
        await waitFor(() => {
            expect(screen.getByText(mockResponse)).toBeInTheDocument();
        });
    });

    test('handles API errors gracefully', async () => {
        //Given: ChatBot is initialized and API error is mocked
        geminiService.generateResponse.mockRejectedValueOnce(new Error('API Error'));
        render(<ChatBot />);

        //When: User opens chat and sends a message
        fireEvent.click(screen.getByRole('button', { name: 'Chat with Support' }));
        const input = await screen.findByPlaceholderText('Type your message...');
        fireEvent.change(input, { target: { value: 'Test message' } });
        fireEvent.click(screen.getByTestId('SendIcon').closest('button'));

        //Then: Error should be logged
        await waitFor(() => {
            expect(console.error).toHaveBeenCalled();
        });
    });
});
