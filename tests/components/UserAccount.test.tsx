import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import UserAccount from '@/components/UserAccount';

import { User } from '@/entities';
import { render } from 'tests/utils/custom-render';

describe('UserAccount Component', () => {
  it('should render user name', () => {
    const user: User = { id: 1, name: 'Francis' };

    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it('should render edit button if user is admin', () => {
    const user: User = { id: 1, name: 'Francis', isAdmin: true };

    render(<UserAccount user={user} />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it('should not render edit button if user is not admin', () => {
    const user: User = { id: 1, name: 'Francis', isAdmin: false };

    render(<UserAccount user={user} />);

    const button = screen.queryByRole('button');

    expect(button).not.toBeInTheDocument();
  });
});
