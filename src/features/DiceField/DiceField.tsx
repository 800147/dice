import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
  startTransition,
  ViewTransition,
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

  const changeCount = useCallback(
    (d: DVariant, delta: number) => {
      if (delta > 0) {
        startTransition(() =>
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
          }),
        );

        return;
      }

      startTransition(() =>
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

          return oldDices.filter((_, i) => i !== last);
        }),
      );
    },
    [setDices, indexRef],
  );

  const roll = useCallback(() => {
    setDices((oldDices) =>
      oldDices.map((dice) => ({
        ...dice,
        state: { value: Math.floor(Math.random() * dice.d) + 1 },
      })),
    );
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
      <div className="DiceField-Field">
        <ViewTransition>
          <div className="DiceField-Dices">
            {!dices.length && (
              <span className="DiceField-NoDicesText">
                add some dices using controls below
              </span>
            )}
            {dices.map(({ d, key, state }, i) => (
              <DiceView
                className="DiceField-Dice"
                d={d}
                viewTransitionName={key}
                key={key}
                state={state}
                position={i}
              />
            ))}
          </div>
        </ViewTransition>
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
