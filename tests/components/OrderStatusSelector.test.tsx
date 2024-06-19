import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import OrderStatusSelector from '@/components/OrderStatusSelector';

import { render } from 'tests/utils/custom-render';

describe('OrderStatusSelector Component', () => {
  const onChange = vi.fn();
  const renderComponent = () => {
    render(<OrderStatusSelector onChange={onChange} />);

    return {
      trigger: screen.getByRole('combobox'),
      getOptions: () => screen.findAllByRole('option'),
      getOption: (label: RegExp) =>
        screen.findByRole('option', { name: label }),
      user: userEvent.setup(),
      onChange,
    };
  };

  it('should render New as the default value', () => {
    const { trigger } = renderComponent();

    expect(trigger).toHaveTextContent(/new/i);
  });

  it('should render statuses', async () => {
    const { trigger, getOptions, user } = renderComponent();

    await user.click(trigger);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const labels = options.map(option => option.textContent);
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
  });

  it.each([
    { label: /processed/i, value: 'processed' },
    { label: /fulfilled/i, value: 'fulfilled' },
  ])(
    'should call onChange with $value when $label option is selected',
    async ({ label, value }) => {
      const { trigger, user, getOption } = renderComponent();

      await user.click(trigger);

      const option = await getOption(label);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    },
  );

  it("should call onChange with 'new' when the New option is selected", async () => {
    const { trigger, user, getOption } = renderComponent();

    await user.click(trigger);

    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(trigger);

    const newOption = await getOption(/new/i);
    await user.click(newOption);

    expect(onChange).toHaveBeenCalledWith('new');
  });
});
