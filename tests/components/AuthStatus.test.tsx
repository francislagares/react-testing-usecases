import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AuthStatus from '@/components/AuthStatus';

import { mockAuthState } from 'tests/mocks/auth-state';
import { render } from 'tests/utils/custom-render';

describe('AuthStatus Component', () => {
  it('should render the loading message while fetching the auth status', () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render the login button if the user is not authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log out/i }),
    ).not.toBeInTheDocument();
  });

  it('should render the user name if authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { id: 1, name: 'Francis' },
    });

    render(<AuthStatus />);

    expect(screen.getByText(/francis/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /log out/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log in/i }),
    ).not.toBeInTheDocument();
  });
});
