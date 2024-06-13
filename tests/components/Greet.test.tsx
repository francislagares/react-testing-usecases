import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Greet from '@/components/Greet';

import { render } from 'tests/utils/custom-render';

describe('Greet Component', () => {
  it('should render Hello with the provided name', () => {
    render(<Greet name='Francis' />);

    const heading = screen.getByRole('heading');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/francis/i);
  });

  it('should render login button when name is not provided', () => {
    render(<Greet />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
