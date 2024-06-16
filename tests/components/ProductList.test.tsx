import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import ProductList from '@/components/ProductList';

import { db } from 'tests/mocks/db';
import { mswServer } from 'tests/mocks/server';
import { render } from 'tests/utils/custom-render';

describe('ProductList Component', () => {
  const productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it('should render a list of products', async () => {
    render(<ProductList />);

    const productItems = await screen.findAllByRole('listitem');

    expect(productItems.length).toBeGreaterThan(0);
  });

  it('should render no products available if no product is found', async () => {
    mswServer.use(http.get('/products', () => HttpResponse.json([])));

    render(<ProductList />);

    const message = await screen.findByText(/no products/i);

    expect(message).toBeInTheDocument();
  });
});
