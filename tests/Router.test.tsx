import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { navigateTo } from './utils/router-navigation';

describe('Router Provider', () => {
  it('should render home page for /', () => {
    navigateTo('/');

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  it('should render products page for /products', () => {
    navigateTo('/products');

    expect(
      screen.getByRole('heading', { name: /products/i }),
    ).toBeInTheDocument();
  });
});
