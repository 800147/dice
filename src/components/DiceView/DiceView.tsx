import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FunctionComponent,
} from "react";
import clsx from "clsx";
import type { DVariant } from "../../helpers/dVariants";
import diceTiles from "/dice-tiles.svg";
import "./DiceView.css";

interface DiceViewProps {
  d: DVariant;
  state: {
    value?: number;
  };
  position?: number;
  noAnimation?: boolean;
  className?: string;
}

interface DiceViewState {
  d: DVariant;
  value?: number;
  oldValue?: number;
}

export const DiceView: FunctionComponent<DiceViewProps> = ({
  d: dProp,
  state: stateProp,
  position,
  noAnimation,
  className,
}) => {
  const [state, setState] = useState<DiceViewState | undefined>(undefined);
  const [imageWrapper, setImageWrapper] = useState<HTMLDivElement | null>(null);

  const style = useMemo<CSSProperties>(() => {
    const { d, value, oldValue } = state ?? { d: dProp, value: 0 };

    return {
      "--DiceView-D": d,
      "--DiceView-Value": value,
      "--DiceView-OldValue": oldValue ?? 0,
      "--DiceView-Position": position,
    } as CSSProperties;
  }, [state, dProp, position]);

  useEffect(() => {
    setState(({ value: oldValue } = { d: dProp, value: 0 }) => ({
      d: dProp,
      value: stateProp?.value,
      oldValue,
    }));
  }, [dProp, stateProp]);

  useLayoutEffect(() => {
    if (!imageWrapper || !state?.value) {
      return;
    }

    imageWrapper.classList.remove("DiceView-ImageWrapper_animated");
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    imageWrapper.clientWidth;
    imageWrapper.classList.add("DiceView-ImageWrapper_animated");
  }, [state, imageWrapper]);

  return (
    <div
      className={clsx(
        "DiceView",
        noAnimation && "DiceView_noAnimation",
        className,
      )}
      style={style}
    >
      <div
        className={clsx(
          "DiceView-ImageWrapper",
          state?.value && "DiceView-ImageWrapper_animated",
        )}
        ref={setImageWrapper}
      >
        <img
          className="DiceView-Image"
          width="50"
          height="50"
          src={diceTiles}
        />
      </div>
    </div>
  );
};
