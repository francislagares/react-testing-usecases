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
    const { waitForFormToLoad } = renderForm();

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it('should render categories', async () => {
    const { getCategoriesComboBox, waitForFormToLoad } = renderForm();

    const { categoryInput } = await waitForFormToLoad();

    const combobox = getCategoriesComboBox();

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

    const { waitForFormToLoad } = renderForm(product);

    const inputs = await waitForFormToLoad();

    expect(inputs.nameInput).toHaveValue(product.name);
    expect(inputs.priceInput).toHaveValue(product.price.toString());
    expect(inputs.categoryInput).toHaveTextContent(category.name);
  });

  it('should focus on the name field', async () => {
    const { waitForFormToLoad } = renderForm();

    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  it.each([
    {
      scenario: 'missing',
      errorMessage: /required/i,
    },
    {
      scenario: 'longer than 255 characters',
      name: 'a'.repeat(256),
      errorMessage: /255/i,
    },
  ])(
    'should display error if name is $scenario',
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad } = renderForm();

      const form = await waitForFormToLoad();
      const user = userEvent.setup();

      if (name !== undefined) {
        await user.type(form.nameInput, name);
      }
      await user.type(form.priceInput, '10');
      await user.click(form.categoryInput);

      const options = screen.getAllByRole('option');
      await user.click(options[0]!);

      await user.click(form.submitButton);

      const error = screen.getByRole('alert');
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    },
  );
});

const renderForm = (product?: Product) => {
  const onChange = vi.fn();
  render(<ProductForm product={product} onSubmit={onChange} />);

  const waitForFormToLoad = async () => {
    await screen.findByRole('form');

    return {
      nameInput: screen.getByPlaceholderText(/name/i),
      priceInput: screen.getByPlaceholderText(/price/i),
      categoryInput: screen.getByRole('combobox', { name: /category/i }),
      submitButton: screen.getByRole('button'),
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
    getCategoriesComboBox,
    waitForFormToLoad,
    selectCategory,
  };
};
