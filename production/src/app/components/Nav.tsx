import { Link, useLocation } from 'react-router';

export function Nav() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/links', label: 'Links' },
  ];

  return (
    <nav className="flex justify-center gap-8 md:gap-16 py-7 px-6">
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 'normal', position: 'relative', letterSpacing: '0.01em' }}
          className="text-black no-underline"
        >
          {/* Hidden bold copy reserves width so layout never shifts */}
          <span style={{ fontWeight: 800, visibility: 'hidden', display: 'block', height: 0, overflow: 'hidden' }} aria-hidden>
            {label}
          </span>
          <span style={{ fontWeight: pathname === to ? 800 : 400, position: 'absolute', top: 0, left: 0 }}>
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
