import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import styles from '../build/styles/app.css';
import SvgSymbols from './SvgSymbols.jsx';

export const meta = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

/** @type {import('remix').LinksFunction} */
export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

// Required for actions sent to base route
export { action } from './routes/create.jsx';

const navLinks = [
  {
    to: '/',
    text: 'Home',
  },
  {
    to: '/create',
    text: 'Create',
  },
  {
    to: '/person',
    text: 'Owners',
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="max-w-2xl m-auto">
        <header role="banner" className="relative z-10">
          <nav role="navigation">
            <ul className="flex gap-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to}>{link.text}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main role="main" className="pb-4">
          <Outlet />
        </main>
        <SvgSymbols />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
