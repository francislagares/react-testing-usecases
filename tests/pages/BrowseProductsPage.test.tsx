import { Theme } from '@radix-ui/themes';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import BrowseProducts from '@/pages/BrowseProductsPage';

import { CartProvider } from '@/providers/CartProvider';

import { Category, Product } from '@/entities';
import { db } from 'tests/mocks/db';
import { mswServer } from 'tests/mocks/server';
import { render } from 'tests/utils/custom-render';

describe('BrowseProductsPage Component', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(item => {
      categories.push(db.category.create({ name: 'Category ' + item }));
      products.push(db.product.create());
    });
  });

  afterAll(() => {
    const categoryIds = categories.map(c => c.id);
    const productIds = products.map(p => p.id);

    db.category.deleteMany({ where: { id: { in: categoryIds } } });
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>,
    );
  };

  it('should show a loading skeleton when fetching categories', () => {
    mswServer.use(
      http.get('/categories', async () => {
        await delay();

        return HttpResponse.json([]);
      }),
    );

    renderComponent();

    expect(
      screen.getByRole('progressbar', { name: /categories/i }),
    ).toBeInTheDocument();
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole('progressbar', { name: /categories/i }),
    );
  });

  it('should show a loading skeleton when fetching products', () => {
    mswServer.use(
      http.get('/products', async () => {
        await delay();

        return HttpResponse.json([]);
      }),
    );

    renderComponent();

    expect(
      screen.getByRole('progressbar', { name: /products/i }),
    ).toBeInTheDocument();
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole('progressbar', { name: /products/i }),
    );
  });

  it('should not render error if categories cannot be fetched', async () => {
    mswServer.use(http.get('/categories', () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /categories/i }),
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: /category/i }),
    ).not.toBeInTheDocument();
  });

  it('should render an error if products cannot be fetched', async () => {
    mswServer.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render categories', async () => {
    renderComponent();

    const combobox = await screen.findByRole('combobox');
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

    categories.forEach(category => {
      expect(
        screen.getByRole('option', { name: category.name }),
      ).toBeInTheDocument();
    });
  });

  it('should render products', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole('progressbar', { name: /products/i }),
    );

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
