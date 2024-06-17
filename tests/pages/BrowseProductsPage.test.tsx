import { Theme } from '@radix-ui/themes';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import BrowseProducts from '@/pages/BrowseProductsPage';

import { mswServer } from 'tests/mocks/server';
import { render } from 'tests/utils/custom-render';

describe('BrowseProductsPage Component', () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>,
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
});
