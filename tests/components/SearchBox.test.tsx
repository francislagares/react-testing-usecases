import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import SearchBox from '@/components/SearchBox';

import { render } from 'tests/utils/custom-render';

describe('SearchBox Component', () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onChange,
    };
  };

  it('should render search input field', () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
  });

  it('should call onChange when Enter is pressed', async () => {
    const { onChange, input, user } = renderSearchBox();

    const searchTerm = 'SearchTerm';
    await user.type(input, searchTerm + '{enter}');

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it('should not call onChange if input field is empty', async () => {
    const { onChange, user, input } = renderSearchBox();

    await user.type(input, '{enter}');

    expect(onChange).not.toHaveBeenCalled();
  });
});
