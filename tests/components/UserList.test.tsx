import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import UserList from '@/components/UserList';

import { render } from 'tests/utils/custom-render';

describe('UserList Component', () => {
  it('should render no users when the users array is empty', () => {
    render(<UserList users={[]} />);

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  it('should render a list users', () => {
    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Francis' },
    ];

    render(<UserList users={users} />);

    users.forEach(user => {
      const link = screen.getByRole('link', { name: user.name });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`);
    });
  });
});
