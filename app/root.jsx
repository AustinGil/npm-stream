import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import bedorcss from 'bedrocss/bedrocss.min.css';
import styles from './styles/main.css';

export const meta = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

/** @type {import('remix').LinksFunction} */
export const links = () => {
  return [
    { rel: 'stylesheet', href: bedorcss },
    { rel: 'stylesheet', href: styles },
  ];
};

// Required for actions sent to base route
export { action } from './routes/index.jsx';

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <nav>
            <ul className="flex">
              <li>
                <NavLink to="/">Neighborhood Pet Manager</NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
