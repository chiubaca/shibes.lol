import * as React from "react";
import { Link } from "@tanstack/react-router";
import type { OAuthUser } from "../types";

interface NavigationProps {
  user: OAuthUser | null;
}

const greetings = ["sup", "howdy", "gday", "yo"];

export const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <>
      <nav className="navbar bg-base-100 shadow-sm fixed top-0 z-10">
        <div className="flex-1 rainbow font-extrabold text-2xl">shibes.lol</div>
        <div className="flex-none gap-2">
          {user ? (
            <div className="flex flex-row items-center gap-2 lowercase">
              <p>
                {user.role === "banned" && (
                  <span className="text-red-500"> (Banned ❌) </span>
                )}
                {user.role === "admin" && (
                  <span className="text-yellow-500"> (👑) </span>
                )}{" "}
                {greeting}, {user.userName}
              </p>
              <div className="dropdown dropdown-end flex flex-col">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full flex flex-row">
                    <img alt="your avatar" src={user.avatarUrl} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/logout">Sign out</Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link className="btn btn-info" to="/login/google">
              sign in
            </Link>
          )}
        </div>
      </nav>
      <style>{`
        .rainbow {
          color: black;
          background: linear-gradient(
            181deg,
            red,
            orange,
            yellow,
            green,
            blue,
            purple
          );
          background-clip: text;
          -webkit-background-clip: text;
        }
  
        .rainbow:hover {
          color: transparent;
          transition: 200ms ease;
        }
      `}</style>
    </>
  );
};