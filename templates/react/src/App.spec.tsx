import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('제목을 볼 수 있다.', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'This is <%= packageName %>.' })
    ).toBeInTheDocument();
  });
});
