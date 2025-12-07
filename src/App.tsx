import { useState, type FunctionComponent } from "react";
import "./App.css";
import { DiceView, type DVariant } from "./components/DiceView/DiceView";

const DRadio: FunctionComponent<{
  value: DVariant;
  d: number;
  setD: (d: DVariant) => void;
  setState: (state: { value: number }) => void;
}> = ({ value, d, setD, setState }) => (
  <label>
    <input
      type="radio"
      name="d"
      value={value}
      onChange={() => {
        setD(value);
        setState({ value: 0 });
      }}
      checked={d === value}
    />
    {`D${value}`}
  </label>
);

function App() {
  const [d, setD] = useState<DVariant>(6);
  const [state, setState] = useState<{ value: number }>(() => ({ value: 0 }));

  return (
    <>
      <p>
        <DRadio value={2} d={d} setD={setD} setState={setState} />
        <br />
        <DRadio value={4} d={d} setD={setD} setState={setState} />
        <br />
        <DRadio value={6} d={d} setD={setD} setState={setState} />
        <br />
        <DRadio value={20} d={d} setD={setD} setState={setState} />
      </p>
      <div>
        <DiceView d={d} state={state} />
      </div>
      <div className="card">
        <button
          onClick={() => setState({ value: Math.floor(Math.random() * d) + 1 })}
        >
          roll the dice
        </button>
      </div>
    </>
  );
}

export default App;
