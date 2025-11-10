import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { TextDecoder, TextEncoder } from 'util';

// Enables fetch mocking once for all tests.
fetchMock.enableMocks();

// Default fetch + alert behaviour.
beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify([])); // Fallback response.
    global.alert = jest.fn();
});

/* Basic Polyfills and Mocks. */
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.TransformStream = class { constructor() {} };
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};
