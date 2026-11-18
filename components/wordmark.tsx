import Link from 'next/link';

export function Wordmark() {
  return (
    <Link className="logo" href="/" aria-label="ÓCULOS Eyewear, página inicial">
      <span className="logo-name">ÓCULOS</span>
      <span className="logo-secondary">EYEWEAR</span>
    </Link>
  );
}
