import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FunctionComponent,
} from "react";
import { OneDieView } from "../../components/OneDieView/OneDieView";
import { DiceCounter } from "../../components/DiceCounter/DiceCounter";
import { dVariants, type DVariant } from "../../helpers/dVariants";
import { Button } from "../../components/Button/Button";
import "./DiceField.css";
import clsx from "clsx";

export const DiceField: FunctionComponent = () => {
  const indexRef = useRef(0);
  const [dice, setDice] = useState<
    { key: string; d: DVariant; state: { value: number } }[]
  >([]);
  const [fieldEl, setFieldEl] = useState<HTMLLabelElement | null>(null);
  const [diceEl, setDiceEl] = useState<HTMLDivElement | null>(null);
  const [diceWidth, setDiceWidth] = useState(0);
  const [emptyClicks, setEmptyClicks] = useState(0);
  const [removed, setRemoved] = useState<{
    d: DVariant;
    state: { value: number };
    position: number;
    key: string;
  } | null>(null);

  useEffect(() => {
    if (!diceEl) {
      return () => {};
    }

    const check = () => {
      setDiceWidth(diceEl.clientWidth);
    };

    window.addEventListener("resize", check);

    check();

    return () => {
      window.removeEventListener("resize", check);
    };
  }, [diceEl]);

  const diceStyle = useMemo<CSSProperties>(
    () =>
      ({
        "--dice-in-a-row": Math.floor(diceWidth / 112),
        "--left-indent": `${(diceWidth % 112) / 2}px`,
        "--dice-count": dice.length,
      }) as CSSProperties,
    [diceWidth, dice],
  );

  const changeCount = useCallback(
    (d: DVariant, delta: number) => {
      if (delta > 0) {
        setDice((oldDice) => {
          if (oldDice[0]?.state.value) {
            return [
              { key: `id_${++indexRef.current}`, d, state: { value: 0 } },
            ];
          }

          return [
            ...oldDice,
            { key: `id_${++indexRef.current}`, d, state: { value: 0 } },
          ];
        });

        return;
      }

      setDice((oldDice) => {
        if (oldDice[0]?.state.value) {
          return [];
        }

        const last = (
          oldDice as unknown as { findLastIndex: typeof oldDice.findIndex }
        ).findLastIndex(({ d: elD }) => elD === d);

        if (last === -1) {
          return oldDice;
        }

        setRemoved({
          d: oldDice[last].d,
          state: oldDice[last].state,
          key: oldDice[last].key,
          position: last,
        });

        return oldDice.filter((_, i) => i !== last);
      });
    },
    [setDice, indexRef],
  );

  const roll = useCallback(() => {
    if (!dice.length) {
      setEmptyClicks((c) => c + 1);

      return;
    }

    setEmptyClicks(0);
    setDice((oldDice) => {
      // https://stackoverflow.com/a/78575449
      const randoms = crypto.getRandomValues(new Uint32Array(oldDice.length));

      return oldDice.map((die, i) => ({
        ...die,
        state: { value: Math.floor((randoms[i] / 4294967296) * die.d) + 1 },
      }));
    });
  }, [setDice, dice.length]);

  const counts = useMemo<Record<DVariant, number>>(() => {
    if (dice[0]?.state.value) {
      return {} as Record<DVariant, number>;
    }

    const result = {} as Record<DVariant, number>;
    dice.forEach(({ d }) => {
      result[d] = (result[d] ?? 0) + 1;
    });

    return result;
  }, [dice]);

  useEffect(() => {
    if (!fieldEl) {
      return;
    }

    const diceInARow = Math.floor(diceWidth / 112);

    const rows = Math.ceil(dice.length / diceInARow);

    fieldEl.scrollTo({
      top: rows * 112 - fieldEl.clientHeight,
      behavior: "smooth",
    });
  }, [dice.length]);

  return (
    <div className="DiceField">
      <div className="DiceField-FieldWrapper">
        <label
          className="DiceField-Field"
          htmlFor="rollButton"
          ref={setFieldEl}
        >
          <div className="DiceField-Dice" ref={setDiceEl} style={diceStyle}>
            {!dice.length && (
              <span
                className={clsx(
                  "DiceField-NoDiceText",
                  emptyClicks && "DiceField-NoDiceText_animated",
                )}
                key={emptyClicks}
              >
                add some dice using controls below
              </span>
            )}
            {dice.map(({ d, key, state }, i) => (
              <OneDieView
                className="DiceField-OneDie"
                d={d}
                key={key}
                state={state}
                position={i}
              />
            ))}
            {removed && (
              <OneDieView
                className="DiceField-OneDie DiceField-OneDie_removed"
                noAnimation
                d={removed.d}
                state={removed.state}
                position={removed.position}
                key={`r_${removed.key}`}
              />
            )}
          </div>
        </label>
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
        id="rollButton"
      >
        roll the dice
      </Button>
    </div>
  );
};
