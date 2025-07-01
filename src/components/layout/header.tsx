import { ModeToggle } from "../theme-toggle";

export function Header() {
  return (
    <header className="sticky flex items-center justify-between py-4 px-6">
      <div>
        <h1>wasso</h1>
      </div>
      <nav>
        <div className="space-x-4">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </div>
      </nav>
      <div>
        <ModeToggle />
      </div>
    </header>
  );
}
