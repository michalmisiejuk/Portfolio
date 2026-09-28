import { Link, useLocation } from 'react-router';
import { useState } from 'react';

export function Nav() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'About Me' },
    { to: '/projects', label: 'Projects' },
    { to: '/links', label: 'Links' },
  ];

  return (
    <nav className="flex justify-center gap-8 md:gap-16 py-6 px-6">
      {links.map(({ to, label }) => (
        <NavLink key={to} to={to} label={label} active={pathname === to} />
      ))}
    </nav>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        lineHeight: 'normal',
        position: 'relative',
        display: 'inline-block',
        opacity: active ? 1 : hovered ? 0.65 : 0.4,
        transition: 'opacity 0.18s ease',
      }}
      className="text-black no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontWeight: 800, visibility: 'hidden', display: 'block' }} aria-hidden>
        {label}
      </span>
      <span style={{ fontWeight: active ? 800 : 400, position: 'absolute', top: 0, left: 0 }}>
        {label}
      </span>
    </Link>
  );
}
