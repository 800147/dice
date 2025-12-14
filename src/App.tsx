import { useCallback, useMemo, useRef, useState } from "react";
import { DiceView } from "./components/DiceView/DiceView";
import { DiceCounter } from "./components/DiceCounter/DiceCounter";
import { dVariants, type DVariant } from "./helpers/dVariants";
import "./App.css";

function App() {
  const indexRef = useRef(0);
  const [dices, setDices] = useState<
    { key: string; d: DVariant; state: { value: number } }[]
  >([]);

  const changeCount = useCallback(
    (d: DVariant, delta: number) => {
      if (delta > 0) {
        setDices((oldDices) => {
          if (oldDices[0]?.state.value) {
            return [
              { key: String(++indexRef.current), d, state: { value: 0 } },
            ];
          }

          return [
            ...oldDices,
            { key: String(++indexRef.current), d, state: { value: 0 } },
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

        return oldDices.filter((_, i) => i !== last);
      });
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
    <div className="App">
      <div className="App-Dices">
        {dices.map(({ d, key, state }) => (
          <DiceView className="App-Dice" d={d} key={key} state={state} />
        ))}
      </div>
      <div className="App-Counters">
        {dVariants.map((dVariant) => (
          <DiceCounter
            d={dVariant}
            changeCount={changeCount}
            key={dVariant}
            count={counts[dVariant] ?? 0}
          />
        ))}
      </div>
      <div>
        <button type="button" onClick={roll}>
          roll
        </button>
      </div>
    </div>
  );
}

export default App;
