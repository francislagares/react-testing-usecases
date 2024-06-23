import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import routes from '@/routes';

import { render } from './custom-render';

export const navigateTo = (path: string) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [path],
  });

  render(<RouterProvider router={router} />);
};
