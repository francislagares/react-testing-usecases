import { http, HttpResponse } from 'msw';

import { mswServer } from 'tests/mocks/server';

export const simulateError = (endpoint: string) => {
  mswServer.use(http.get(endpoint, () => HttpResponse.error()));
};
