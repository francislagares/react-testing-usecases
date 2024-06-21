import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import CategoryList from '@/components/CategoryList';

import { Category } from '@/entities';
import { db } from 'tests/mocks/db';
import { render } from 'tests/utils/custom-render';
import { simulateDelay } from 'tests/utils/simulate-delay';
import { simulateError } from 'tests/utils/simulate-error';

describe('CategoryList Component', () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map(c => c.id);
    db.category.deleteMany({
      where: { id: { in: categoryIds } },
    });
  });

  const renderComponent = () => {
    render(<CategoryList />);
  };

  it('should render a list of categories', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    categories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('should render a loading message when fetching categories', () => {
    simulateDelay('/categories');

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render an error message if fetching categories fails', async () => {
    simulateError('/categories');

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
