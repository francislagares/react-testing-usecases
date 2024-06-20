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
      const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderForm();

      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    },
  );

  it.each([
    {
      scenario: 'missing',
      errorMessage: /required/i,
    },
    {
      scenario: '0',
      price: 0,
      errorMessage: /1/i,
    },
    {
      scenario: 'negative',
      price: -1,
      errorMessage: /1/i,
    },
    {
      scenario: 'greater than 1000',
      price: 1001,
      errorMessage: /1000/i,
    },
    {
      scenario: 'not a number',
      price: 'a',
      errorMessage: /required/i,
    },
  ])(
    'should display error if price is $scenario',
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderForm();

      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    },
  );
});

const renderForm = (product?: Product) => {
  const onChange = vi.fn();
  render(<ProductForm product={product} onSubmit={onChange} />);

  return {
    getCategoriesComboBox: () => screen.getByRole('combobox'),
    expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
      const error = screen.getByRole('alert');
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    },

    waitForFormToLoad: async () => {
      await screen.findByRole('form');

      const nameInput = screen.getByPlaceholderText(/name/i);
      const priceInput = screen.getByPlaceholderText(/price/i);
      const categoryInput = screen.getByRole('combobox', {
        name: /category/i,
      });
      const submitButton = screen.getByRole('button');

      type FormData = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [K in keyof Product]: any;
      };

      const validData: FormData = {
        id: 1,
        name: 'a',
        price: 1,
        categoryId: 1,
      };

      const fill = async (product: FormData) => {
        const user = userEvent.setup();

        if (product.name !== undefined)
          await user.type(nameInput, product.name);

        if (product.price !== undefined)
          await user.type(priceInput, product.price.toString());

        await user.tab();
        await user.click(categoryInput);
        const options = screen.getAllByRole('option');
        await user.click(options[0]!);
        await user.click(submitButton);
      };

      return {
        nameInput,
        priceInput,
        categoryInput,
        submitButton,
        fill,
        validData,
      };
    },
  };
};
