import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { Product } from '@/entities';
import { db } from 'tests/mocks/db';
import { navigateTo } from 'tests/utils/router-navigation';

describe('ProductDetailPage', () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it('should render product details', async () => {
    navigateTo('/products/' + product.id);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(
      screen.getByRole('heading', { name: product.name }),
    ).toBeInTheDocument();

    expect(screen.getByText('$' + product.price)).toBeInTheDocument();
  });
});
