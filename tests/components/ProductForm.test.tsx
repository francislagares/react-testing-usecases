import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import ProductForm from '@/components/ProductForm';

import { Category, Product } from '@/entities';
import { db } from 'tests/mocks/db';
import { render } from 'tests/utils/custom-render';

describe('ProductForm Component', () => {
  let category: Category;
  const categories: Category[] = [];

  beforeAll(() => {
    category = db.category.create();

    [1, 2].forEach(item => {
      const category = db.category.create({ name: 'Category ' + item });
      categories.push(category);
    });
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });

    const categoryIds = categories.map(c => c.id);
    db.category.deleteMany({
      where: { id: { in: categoryIds } },
    });
  });

  it('should render input fields', async () => {
    const { waitForFormToLoad, getInputs } = renderForm();

    await waitForFormToLoad();

    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it('should render categories', async () => {
    const { getCategoriesComboBox, waitForFormToLoad, getInputs } =
      renderForm();

    await waitForFormToLoad();

    const combobox = getCategoriesComboBox();
    const { categoryInput } = getInputs();

    expect(combobox).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    categories.forEach(category => {
      expect(
        screen.getByRole('option', { name: category.name }),
      ).toBeInTheDocument();
    });
  });

  it('should populate form fields when populating a product', async () => {
    const product: Product = {
      id: 1,
      name: 'Bread',
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad, getInputs } = renderForm(product);

    await waitForFormToLoad();

    const inputs = getInputs();

    expect(inputs.nameInput).toHaveValue(product.name);
    expect(inputs.priceInput).toHaveValue(product.price.toString());
    expect(inputs.categoryInput).toHaveTextContent(category.name);
  });
});

const renderForm = (product?: Product) => {
  const onChange = vi.fn();
  render(<ProductForm product={product} onSubmit={onChange} />);

  const waitForFormToLoad = () => screen.findByRole('form');
  const getInputs = () => {
    return {
      nameInput: screen.getByPlaceholderText(/name/i),
      priceInput: screen.getByPlaceholderText(/price/i),
      categoryInput: screen.getByRole('combobox', { name: /category/i }),
    };
  };

  const getCategoriesComboBox = () => screen.getByRole('combobox');

  const selectCategory = async (name: RegExp | string) => {
    const combobox = getCategoriesComboBox();
    const user = userEvent.setup();
    await user.click(combobox);

    const option = screen.getByRole('option', { name });
    await user.click(option);
  };

  return {
    getInputs,
    getCategoriesComboBox,
    waitForFormToLoad,
    selectCategory,
  };
};
