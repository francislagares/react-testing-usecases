import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import TermsAndConditions from '@/components/TermsAndConditions';

import { render } from 'tests/utils/custom-render';

describe('TermsAndConditions Component', () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button'),
    };
  };

  it('should render with correct text and initial state', () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent('Terms & Conditions');
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it('should enable the button when the checkox is checked', async () => {
    const { checkbox, button } = renderComponent();

    const user = userEvent.setup();
    await user.click(checkbox);

    expect(button).toBeEnabled();
  });
});
