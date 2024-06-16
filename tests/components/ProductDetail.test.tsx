import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import ProductDetail from '@/components/ProductDetail';

import { products } from 'tests/mocks/data';
import { mswServer } from 'tests/mocks/server';
import { render } from 'tests/utils/custom-render';

describe('ProductDetail Component', () => {
  it('should render the product detail', async () => {
    render(<ProductDetail productId={1} />);

    expect(
      await screen.findByText(new RegExp(products[0]!.name)),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(products[0]!.price.toString())),
    ).toBeInTheDocument();
  });

  it('should render message if no product is found', async () => {
    mswServer.use(http.get('/products/1', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error for invalid product', async () => {
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid/i);

    expect(message).toBeInTheDocument();
  });
});
