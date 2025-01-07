'use client';

import { createUser } from '../lib/actions';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useActionState } from 'react';

export default function SignUpForm() {
  const [errorState, formAction, isPending] = useActionState(
    createUser,
    { errors: {}, message: '' },
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 text-black">
        <h1>
          Sign up to continue.
        </h1>
        <div className="w-full">
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="username"
          >
            Username
          </label>
          <div>
            <input 
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="username"
          >
            Password
          </label>
          <div>
            <input 
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
        </div>
        <button
          aria-disabled={isPending}
        >
          Sign Up
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {(errorState.errors.username || errorState.errors.password) && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorState.errors.username ? errorState.errors.username : errorState.errors.password }</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}