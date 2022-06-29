import React from 'react';
import { NavLink } from '@remix-run/react';
import { Svg } from '../components/index.js';

const navLinks = [
  {
    to: '/',
    text: (
      <span className="flex items-center gap-2 flex-wrap justify-center text-2xl">
        <Svg icon="paw-print" className="text-4xl" />
        <p>Neighborhood Pet Manager</p>
      </span>
    ),
  },
];

/**
 * @type {React.FC<{
 * title: string,
 * }>}
 */
export default ({ title = '', className, ...props }) => {
  if (title && typeof title === 'string') {
    title = <h1 className="mb-4">{title}</h1>;
  }
  return (
    <>
      <header role="banner" className="text-light bg-secondary">
        <nav
          role="navigation"
          className="flex items-center justify-center sm:justify-between flex-wrap gap-4 max-w-2xl m-auto p-4 text-center"
        >
          <ul className="flex gap-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.text}</NavLink>
              </li>
            ))}
          </ul>

          <NavLink
            to="/create"
            className="rounded-full p-1 text-white bg-primary"
          >
            <Svg label="Add new pet" icon="plus" className="text-3xl" />
          </NavLink>
        </nav>
      </header>
      <main
        role="main"
        className={['max-w-2xl m-auto mb-8 p-4', className]
          .filter(Boolean)
          .join(' ')}
      >
        {title}
        {props.children}
      </main>
    </>
  );
};
