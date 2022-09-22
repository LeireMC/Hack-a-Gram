import "./styles.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import logoHackAGram from "../../assets/images/logo.png";
import MenuIcon from "../MenuIcon";
import HomeIcon from "../HomeIcon";
import SearchBar from "../SearchBar";
import { useTokenContext } from "../../Contexts/TokenContext";
import NotLoggedUserMenu from "../NotLoggedUserMenu";
import LoggedUserMenu from "../LoggedUserMenu";

const Header = ({ setSearchParams, searchParams }) => {
  const { token } = useTokenContext();
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  return (
    <header className="header">
      <Link to="/">
        <img
          className="header-logo "
          src={logoHackAGram}
          alt="Logo Hack a Gram"
        />
      </Link>
      <SearchBar
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
      <button className="header-button">
        <HomeIcon />
      </button>
      <button onClick={toggleMenu} className="header-button">
        <MenuIcon />
      </button>
      {!token && <NotLoggedUserMenu menu={menu} />}
      {token && <LoggedUserMenu menu={menu} />}
    </header>
  );
};

export default Header;
