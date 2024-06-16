import { describe, it } from 'vitest';

import { db } from './mocks/db';

describe('Fetch API', () => {
  it('should fetch API and get Response', async () => {
    const product = db.product.create();

    console.log(product);
  });
});
