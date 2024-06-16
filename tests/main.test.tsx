import { describe, expect, it } from 'vitest';

describe('Fetch API', () => {
  it('should fetch API and get Response', async () => {
    const response = await fetch('/categories');
    const data = await response.json();

    expect(data).toHaveLength(3);
  });
});
