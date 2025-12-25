import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FunctionComponent,
} from "react";
import { DiceView } from "../../components/DiceView/DiceView";
import { DiceCounter } from "../../components/DiceCounter/DiceCounter";
import { dVariants, type DVariant } from "../../helpers/dVariants";
import { Button } from "../../components/Button/Button";
import "./DiceField.css";

export const DiceField: FunctionComponent = () => {
  const indexRef = useRef(0);
  const [dices, setDices] = useState<
    { key: string; d: DVariant; state: { value: number } }[]
  >([]);
  const [dicesEl, setDicesEl] = useState<HTMLDivElement | null>(null);
  const [dicesWidth, setDicesWidth] = useState(0);
  const [removed, setRemoved] = useState<{
    d: DVariant;
    state: { value: number };
    position: number;
    key: string;
  } | null>(null);

  useEffect(() => {
    if (!dicesEl) {
      return () => {};
    }

    const check = () => {
      setDicesWidth(dicesEl.clientWidth);
    };

    window.addEventListener("resize", check);

    check();

    return () => {
      window.removeEventListener("resize", check);
    };
  }, [dicesEl]);

  const dicesStyle = useMemo<CSSProperties>(
    () =>
      ({
        "--dices-in-a-row": Math.floor(dicesWidth / 112),
        "--left-indent": `${(dicesWidth % 112) / 2}px`,
        "--dices-count": dices.length,
      }) as CSSProperties,
    [dicesWidth, dices],
  );

  const changeCount = useCallback(
    (d: DVariant, delta: number) => {
      if (delta > 0) {
        setDices((oldDices) => {
          if (oldDices[0]?.state.value) {
            return [
              { key: `id_${++indexRef.current}`, d, state: { value: 0 } },
            ];
          }

          return [
            ...oldDices,
            { key: `id_${++indexRef.current}`, d, state: { value: 0 } },
          ];
        });

        return;
      }

      setDices((oldDices) => {
        if (oldDices[0]?.state.value) {
          return [];
        }

        const last = (
          oldDices as unknown as { findLastIndex: typeof oldDices.findIndex }
        ).findLastIndex(({ d: elD }) => elD === d);

        if (last === -1) {
          return oldDices;
        }

        setRemoved({
          d: oldDices[last].d,
          state: oldDices[last].state,
          key: oldDices[last].key,
          position: last,
        });

        return oldDices.filter((_, i) => i !== last);
      });
    },
    [setDices, indexRef],
  );

  const roll = useCallback(() => {
    setDices((oldDices) => {
      // https://stackoverflow.com/a/78575449
      const randoms = crypto.getRandomValues(new Uint32Array(oldDices.length));

      return oldDices.map((dice, i) => ({
        ...dice,
        state: { value: Math.floor((randoms[i] / 4294967296) * dice.d) + 1 },
      }));
    });
  }, [setDices]);

  const counts = useMemo<Record<DVariant, number>>(() => {
    if (dices[0]?.state.value) {
      return {} as Record<DVariant, number>;
    }

    const result = {} as Record<DVariant, number>;
    dices.forEach(({ d }) => {
      result[d] = (result[d] ?? 0) + 1;
    });

    return result;
  }, [dices]);

  return (
    <div className="DiceField">
      <div className="DiceField-FieldWrapper">
        <div className="DiceField-Field">
          <div className="DiceField-Dices" ref={setDicesEl} style={dicesStyle}>
            {!dices.length && (
              <span className="DiceField-NoDicesText">
                add some dices using controls below
              </span>
            )}
            {dices.map(({ d, key, state }, i) => (
              <DiceView
                className="DiceField-Dice"
                d={d}
                key={key}
                state={state}
                position={i}
              />
            ))}
            {removed && (
              <DiceView
                className="DiceField-Dice DiceField-Dice_removed"
                noAnimation
                d={removed.d}
                state={removed.state}
                position={removed.position}
                key={`r_${removed.key}`}
              />
            )}
          </div>
        </div>
        <a className="DiceField-AboutLink" href="./about">
          about
        </a>
      </div>
      <div className="DiceField-Counters">
        {dVariants.map((dVariant) => (
          <DiceCounter
            d={dVariant}
            changeCount={changeCount}
            key={dVariant}
            count={counts[dVariant] ?? 0}
          />
        ))}
      </div>
      <Button
        className="DiceField-RollButton"
        onClick={roll}
        size="large"
        disabled={!dices.length}
      >
        roll the dices
      </Button>
    </div>
  );
};
