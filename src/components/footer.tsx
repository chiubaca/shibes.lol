import * as React from "react";
import { Link } from "@tanstack/react-router";

export const Footer: React.FC = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <nav>
        <h6 className="footer-title lowercase">footer stuff lol</h6>
        <Link
          to="/terms"
          target="_blank"
          className="link link-hover"
        >
          terms
        </Link>
        <Link
          to="/privacy"
          target="_blank"
          className="link link-hover"
        >
          privacy
        </Link>
        <a
          href="https://twitter.com/ShibaEveryHour"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          @ShibaEveryHour
        </a>
        <a
          href="https://twitter.com/chiubaca"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          @chiubaca
        </a>
        <a
          href="https://ko-fi.com/chiubaca"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          support me | kofi
        </a>
      </nav>
    </footer>
  );
};