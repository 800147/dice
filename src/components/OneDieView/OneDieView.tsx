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
import "./OneDieView.css";

interface OneDieViewProps {
  d: DVariant;
  state: {
    value?: number;
  };
  position?: number;
  noAnimation?: boolean;
  className?: string;
}

interface OneDieViewState {
  d: DVariant;
  value?: number;
  oldValue?: number;
}

export const OneDieView: FunctionComponent<OneDieViewProps> = ({
  d: dProp,
  state: stateProp,
  position,
  noAnimation,
  className,
}) => {
  const [state, setState] = useState<OneDieViewState | undefined>(undefined);
  const [imageWrapper, setImageWrapper] = useState<HTMLDivElement | null>(null);

  const style = useMemo<CSSProperties>(() => {
    const { d, value, oldValue } = state ?? { d: dProp, value: 0 };

    return {
      "--OneDieView-D": d,
      "--OneDieView-Value": value,
      "--OneDieView-OldValue": oldValue ?? 0,
      "--OneDieView-Position": position,
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

    imageWrapper.classList.remove("OneDieView-ImageWrapper_animated");
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    imageWrapper.clientWidth;
    imageWrapper.classList.add("OneDieView-ImageWrapper_animated");
  }, [state, imageWrapper]);

  return (
    <div
      className={clsx(
        "OneDieView",
        noAnimation && "OneDieView_noAnimation",
        className,
      )}
      style={style}
    >
      <div
        className={clsx(
          "OneDieView-ImageWrapper",
          state?.value && "OneDieView-ImageWrapper_animated",
        )}
        ref={setImageWrapper}
      >
        <img
          className="OneDieView-Image"
          width="50"
          height="50"
          src={diceTiles}
        />
      </div>
    </div>
  );
};
