import * as React from "react";
import LightLogo from "@/assets/bother_light_logo.png";
import DarkLogo from "@/assets/bother_dark_logo.png";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = () => {
  return (
    <div className="flex items-center flex-shrink-0">
      <header>
        <Link to="/">
        <img className="h-14 w-auto dark:hidden" src={LightLogo} alt="" />
        <img className="h-14 w-auto hidden dark:block" src={DarkLogo} alt="" />
        </Link>
      </header>
      <nav className="flex flex-grow">
        <div className="flex items-center px-8">
          <ul className="flex gap-4 items-center">
            <li>
              <Link to="/tools/padding" className="[&.active]:font-semibold">padding</Link>
            </li>
            <li>
              <Link to="/tools/slicing" className="[&.active]:font-semibold">slicing</Link>
            </li>
          </ul>
        </div>
        <div className="ml-auto flex mr-8 items-center">
          <ul className="flex gap-4 items-center">
            <li>
              <Link to="/about" className="[&.active]:font-semibold">about</Link>
            </li>
            <li>
              <Button variant={"ghost"} size={"icon"} asChild>
                <a href="https://www.github.com/d4mr/bother"><GitHubLogoIcon/></a></Button>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
