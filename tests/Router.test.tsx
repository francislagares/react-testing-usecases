import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { db } from './mocks/db';
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

  it('should render the product details page for /products/:id', async () => {
    const product = db.product.create();

    navigateTo('/products/' + product.id);

    expect(
      await screen.findByRole('heading', { name: product.name }),
    ).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it('should render not found page for invalid routes', () => {
    navigateTo('/invalid-route');

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('should render the admin home page for /admin', () => {
    navigateTo('/admin');

    expect(screen.getByRole('heading', { name: /admin/i })).toBeInTheDocument();
  });
});
