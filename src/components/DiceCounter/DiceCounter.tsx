import { useId, type FunctionComponent } from "react";
import clsx from "clsx";
import type { DVariant } from "../../helpers/dVariants";
import { Button } from "../Button/Button";
import { OneDieView } from "../OneDieView/OneDieView";
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
  const buttonId = useId();

  return (
    <div className={clsx("DiceCounter", className)}>
      <Button
        type="button"
        className="DiceCounter-PlusButton"
        onClick={() => changeCount(d, +1)}
        id={buttonId}
      >
        +
      </Button>
      <label className="DiceCounter-OneDieViewBox" htmlFor={buttonId}>
        <OneDieView
          className="DiceCounter-OneDieView"
          d={d}
          state={{ value: 0 }}
          noAnimation
        />
        {count ? (
          <div className="DiceCounter-Counter">{`×${count}`}</div>
        ) : null}
      </label>
      <Button
        type="button"
        className="DiceCounter-MinusButton"
        onClick={() => changeCount(d, -1)}
      >
        &minus;
      </Button>
    </div>
  );
};
