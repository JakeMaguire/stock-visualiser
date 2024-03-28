import {
  IconDefinition,
  faTruckRampBox,
  faDolly,
  faArrowRight,
  faTruck,
  faBoxOpen,
  faBoxesStacked,
  faPeopleCarryBox,
} from "@fortawesome/free-solid-svg-icons";

const iconMap: Record<string, IconDefinition> = {
  delivery: faTruckRampBox,
  goodsIn: faDolly,
  move: faArrowRight,
  transit: faTruck,
  bookIn: faBoxOpen,
  palletMove: faBoxesStacked,
  crossStock: faPeopleCarryBox,
} as const;

export default iconMap;
