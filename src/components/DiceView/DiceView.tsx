import clsx from "clsx";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FunctionComponent,
} from "react";
import diceTiles from "/dice-tiles.svg";
import "./DiceView.css";

export type DVariant = 2 | 4 | 6 | 20;

interface DiceViewProps {
  d: DVariant;
  state: {
    value?: number;
  };
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
    } as CSSProperties;
  }, [state, dProp]);

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
    <div className={clsx("DiceView", className)} style={style}>
      <div
        className={clsx(
          "DiceView-ImageWrapper",
          state?.value && "DiceView-ImageWrapper_animated",
        )}
        ref={setImageWrapper}
      >
        <img className="DiceView-Image" src={diceTiles} />
      </div>
    </div>
  );
};
