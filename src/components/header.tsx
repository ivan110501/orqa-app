import { navigationData } from "../data/nav";
import Navigation from "./navigation";
import logoImg from "../assets/logo.png";

const Header = () => {
  return (
    <div className="header__wrapper">
      <header className="header">
        <img className="header__logo" src={logoImg} alt="Hamburger logo" />
        <Navigation links={navigationData} />
      </header>
    </div>
  );
};
export default Header;
