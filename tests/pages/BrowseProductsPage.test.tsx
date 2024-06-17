import { Theme } from '@radix-ui/themes';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import BrowseProducts from '@/pages/BrowseProductsPage';

import { CartProvider } from '@/providers/CartProvider';

import { Category, Product } from '@/entities';
import { db } from 'tests/mocks/db';
import { render } from 'tests/utils/custom-render';
import { simulateDelay } from 'tests/utils/simulate-delay';
import { simulateError } from 'tests/utils/simulate-error';

describe('BrowseProductsPage Component', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
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

    return {
      getProductsSkeleton: () =>
        screen.queryByRole('progressbar', { name: /products/i }),
      getCategoriesSkeleton: () =>
        screen.queryByRole('progressbar', { name: /categories/i }),
      getCategoriesCombobox: () => screen.queryByRole('combobox'),
    };
  };

  it('should show a loading skeleton when fetching categories', () => {
    simulateDelay('/categories');

    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole('progressbar', { name: /categories/i }),
    );
  });

  it('should show a loading skeleton when fetching products', () => {
    simulateDelay('/products');

    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it('should not render error if categories cannot be fetched', async () => {
    simulateError('/categories');

    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it('should render an error if products cannot be fetched', async () => {
    simulateError('/products');

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render categories', async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

    categories.forEach(category => {
      expect(
        screen.getByRole('option', { name: category.name }),
      ).toBeInTheDocument();
    });
  });

  it('should render products', async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('should filter products by category', async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    const user = userEvent.setup();
    await user.click(combobox!);

    const selectedCategory = categories[0];
    const option = screen.getByRole('option', { name: selectedCategory?.name });
    await user.click(option);

    const products = db.product.findMany({
      where: {
        categoryId: {
          equals: selectedCategory?.id,
        },
      },
    });

    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('should should render all products if All category is selected', async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    const user = userEvent.setup();
    await user.click(combobox!);

    const option = screen.getByRole('option', { name: /all/i });
    await user.click(option);

    const products = db.product.getAll();

    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
