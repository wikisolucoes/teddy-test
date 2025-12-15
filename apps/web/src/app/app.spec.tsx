import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render loading or login when not authenticated', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Verifica se o app renderiza (loading ou login)
    const loadingText = screen.getByText(/Carregando.../i);
    expect(loadingText).toBeTruthy();
  });
});
