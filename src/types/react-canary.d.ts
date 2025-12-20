import type { FunctionComponent } from "react";

import "react";

declare module "react" {
  export const ViewTransition: FunctionComponent<{ children: ReactNode }>;
}
