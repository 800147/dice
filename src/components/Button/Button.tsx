import type { FunctionComponent, MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import "./Button.css";

interface ButtonProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  size?: "medium" | "large";
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  id?: string;
}

export const Button: FunctionComponent<ButtonProps> = ({
  className,
  onClick,
  children,
  size = "medium",
  type = "button",
  disabled,
  id,
}) => (
  <button
    className={clsx("Button", `Button_size_${size}`, className)}
    onClick={onClick}
    type={type}
    disabled={disabled}
    id={id}
  >
    {children}
  </button>
);
