import type { LucideIcon } from "lucide-react";
import {
  StatChip,
  StatContent,
  StatLabel,
  StatTone,
  StatValue,
  CardContainer,
  IconWatermark,
} from "./styles";

interface StatCardProps {
  label: string;
  value: number | string;
  hint: string;
  icon: LucideIcon;
  tone?: StatTone;
  onClick?: () => void;
}

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone = "indigo",
  onClick,
}: StatCardProps) => (
  <CardContainer
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    $clickable={!!onClick}
  >
    <IconWatermark $tone={tone}>
      <Icon />
    </IconWatermark>
    <StatContent>
      <StatLabel>{label}</StatLabel>
      <StatValue>{value}</StatValue>
      <StatChip $tone={tone}>{hint}</StatChip>
    </StatContent>
  </CardContainer>
);

export default StatCard;
