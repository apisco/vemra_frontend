import type { ReactNode } from "react";

import { BuildingIcon } from "@/components/icons/building-icon";
import { HouseIcon } from "@/components/icons/house-icon";
import type { AuthRole } from "@/constants/auth";

export const ROLE_ICONS: Record<AuthRole, ReactNode> = {
  landlord: <HouseIcon />,
  tenant: <BuildingIcon />,
};
