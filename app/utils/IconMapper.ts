import {
  IconDefinition,
  faTruckRampBox,
  faDolly,
  faArrowRight,
  faTruck,
  faBoxOpen,
  faBoxesStacked,
  faPeopleCarryBox,
  faFlagCheckered,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { MoveType } from "../services/stockAuditService";

const iconMap: Record<MoveType, IconDefinition> = {
  delivery: faTruckRampBox,
  goodsIn: faDolly,
  move: faArrowRight,
  transit: faTruck,
  bookIn: faBoxOpen,
  palletMove: faBoxesStacked,
  crossStock: faPeopleCarryBox,
  brokenDown: faFlagCheckered,
  adjustment: faWrench,
} as const;

export default iconMap;
