import type { FunctionComponent } from "react";
import clsx from "clsx";
import type { DVariant } from "../../helpers/dVariants";
import { DiceView } from "../DiceView/DiceView";
import "./DiceCounter.css";

interface DiceCounterProps {
  className?: string;
  d: DVariant;
  count: number;
  changeCount: (d: DVariant, delta: number) => void;
}

export const DiceCounter: FunctionComponent<DiceCounterProps> = ({
  className,
  d,
  count,
  changeCount,
}) => {
  return (
    <div className={clsx("DiceCounter", className)}>
      <button
        type="button"
        className="DiceCounter-PlusButton"
        onClick={() => changeCount(d, +1)}
      >
        +
      </button>
      <DiceView className="DiceCounter-DiceView" d={d} state={{ value: 0 }} />
      <div className="DiceCounter-Counter">{count ? `×${count}` : " "}</div>
      <button
        type="button"
        className="DiceCounter-MinusButton"
        onClick={() => changeCount(d, -1)}
      >
        &minus;
      </button>
    </div>
  );
};
