import type { ReactNode } from "react";

import { BuildingIcon } from "@/components/icons/building-icon";
import { HouseIcon } from "@/components/icons/house-icon";
import type { Caps } from "@/constants/auth";

export const ROLE_ICONS: Record<Caps, ReactNode> = {
  landlord: <HouseIcon />,
  tenant: <BuildingIcon />,
};
