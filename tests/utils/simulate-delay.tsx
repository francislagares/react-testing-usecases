import { delay, http, HttpResponse } from 'msw';

import { mswServer } from 'tests/mocks/server';

export const simulateDelay = (endpoint: string) => {
  mswServer.use(
    http.get(endpoint, async () => {
      await delay();

      return HttpResponse.json([]);
    }),
  );
};
