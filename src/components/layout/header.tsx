import { ModeToggle } from "../theme-toggle";
import { SignIn } from "../auth/sign-in";

export function Header() {
  return (
    <header className="sticky flex items-center justify-between py-4 px-6">
      <div>
        <h1>wasso</h1>
      </div>
      <nav>
        <div className="flex items-center space-x-4">
          <a href="/create" className="hover:underline">
            create
          </a>
          <a href="/about" className="hover:underline">
            about
          </a>
          <a href="/contact" className="hover:underline">
            contact
          </a>
        </div>
      </nav>
      <div className="flex items-center space-x-4">
        <SignIn />
        <ModeToggle />
      </div>
    </header>
  );
}
