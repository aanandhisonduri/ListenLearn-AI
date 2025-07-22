import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: '#D8BFD8' }}
    >
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
        
        </Link>
        <div className="d-flex">
          <Link href="/" className="btn btn-outline-light me-2">
            Home
          </Link>
          {/* <Link href="/login" className="btn btn-outline-light me-2">
            Login
          </Link> */}
          <Link href="/dashboard" className="btn btn-outline-light">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
