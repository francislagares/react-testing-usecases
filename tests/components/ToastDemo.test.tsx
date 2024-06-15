import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { describe, expect, it } from 'vitest';

import ToastDemo from '@/components/ToastDemo';

import { render } from 'tests/utils/custom-render';

describe('ToastDemo Component', () => {
  it('should render a toast', async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>,
    );

    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);

    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  });
});
