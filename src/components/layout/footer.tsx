import Link from "next/link";
import { ModeToggle } from "../theme-toggle";

export function Footer() {
  return (
    <footer className="bg-background/90 border-t-2 border-t-accent p-10">
      <div className="container flex flex-col md:flex-row items-start justify-between space-x-10">
        <div className="mt-8">
          <h1 className="text-3xl font-bold">
            For
            <br /> Designers
          </h1>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <ul className="list-none space-y-2">
            <li>
              <Link href="/create" className="hover:font-semibold transition-all">
                Home
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:font-semibold transition-all">
                About
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:font-semibold transition-all">
                Features
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Socials</h3>
          <ul className="list-none space-y-2">
            <li>
              <a href="https://instagram.com/sbek22" className="hover:font-semibold transition-all">
                Insta.
              </a>
            </li>
            <li>
              <a href="https://github.com/mugid" className="hover:font-semibold transition-all">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/sbek22" className="hover:font-semibold transition-all">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://twitter.com/sbek22_" className="hover:font-semibold transition-all">
                Twitter
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Contacts</h3>
          <p>
            Almaty, Kazakhstan <br /> Email: bekslambek22@gmail.com
          </p>
        </div>
      </div>
      <div className="container flex sm:flex-row flex-co items-start sm:items-center justify-between mt-8">
        <p className="text-foreground/70 italic">
          created by{" "}
          <a
            href="https://github.com/mugid"
            className="hover:text-foreground hover:font-semibold transition-all"
          >
            bek slambek
          </a>
        </p>
        <ModeToggle />
      </div>
    </footer>
  );
}
