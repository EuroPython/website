import "react";

type CustomProp = { [key in `--${string}`]: string };

declare module "react" {
  export interface CSSProperties extends CustomProp {}
}
