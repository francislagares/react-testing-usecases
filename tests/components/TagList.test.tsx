import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TagList from '@/components/TagList';

import { render } from 'tests/utils/custom-render';

describe('TagList Component', () => {
  it('should render tags', async () => {
    render(<TagList />);

    const listItems = await screen.findAllByRole('list');
    expect(listItems.length).toBeGreaterThan(0);
  });
});
