import { LinkType } from "../types/main";

type Props = {
  links: LinkType[];
};
const Navigation = ({ links }: Props) => {
  return (
    <nav className="nav">
      {links.map((link) => {
        return (
          <a key={link.href} className="nav__item" href={link.href}>
            {link.label}
          </a>
        );
      })}
    </nav>
  );
};
export default Navigation;
