import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import ProductDetail from '@/components/ProductDetail';

import { db } from 'tests/mocks/db';
import { mswServer } from 'tests/mocks/server';
import { render } from 'tests/utils/custom-render';

describe('ProductDetail Component', () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it('should render product details', async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />);

    expect(
      await screen.findByText(new RegExp(product!.name)),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString())),
    ).toBeInTheDocument();
  });

  it('should render message if no product is found', async () => {
    mswServer.use(http.get('/products/1', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error if data fetching fails', async () => {
    mswServer.use(http.get('/products/1', () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', async () => {
    mswServer.use(
      http.get('/products/1', async () => {
        await delay();

        return HttpResponse.json([]);
      }),
    );

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove the loading indicator after data is fetched', async () => {
    render(<ProductDetail productId={1} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('should remove the loading indicator if data fetching fails', async () => {
    mswServer.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
