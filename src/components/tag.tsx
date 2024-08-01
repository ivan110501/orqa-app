import { ReactNode } from "react";
type TagSizeType = "md" | "sm";
type Props = {
  children: ReactNode;
  size?: TagSizeType;
};

const Tag = ({ children, size = "md" }: Props) => {
  const getSizeClass = () => {
    switch (size) {
      case "md":
        return "md";
      case "sm":
        return "sm";

      default:
        return "md";
    }
  };
  return (
    <>
      <span className={`tag tag--${getSizeClass()}`}>{children}</span>
    </>
  );
};

export default Tag;
