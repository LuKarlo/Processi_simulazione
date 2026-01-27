import { useState } from 'react';
import TableData from './components/tableContent';
import SimulationProcess from './components/simulation';
import './App.css';

const baseObj = { "name": "", "start": 0, "length": 1, "priority": 0 };

function App() {
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [QuantoTime, setQuantoTime] = useState(1);
  const [sim, setSim] = useState(false);

  // Inizializza 3 righe con nomi P0, P1, P2 già pronti
  const [rows, setRows] = useState(() => 
    Array.from({ length: 3 }, (_, i) => ({
      ...baseObj,
      name: `P${i}`
    }))
  );

  const formSubmit = (e) => {
    e.preventDefault();
    setSim(true);
  }

  return (
    <>
      <div className="header containers">
        <h2>Seleziona l'algoritmo da usare nella simulazione</h2>
        <form>
          <div className="algoRadio">
            <input 
              onChange={() => {setAlgorithm("fcfs"); setSim(false)}} 
              type="radio" id="fcfs" name="algorithm" value="fcfs" 
              checked={algorithm === "fcfs"}
            />
            <label htmlFor="fcfs">First-Come, First-Served (FCFS)</label>
          </div>
          <div className="algoRadio">
            <input onChange={() => {setAlgorithm("sjf"); setSim(false)}} type="radio" id="sjf" name="algorithm" value="sjf" checked={algorithm === "sjf"} />
            <label htmlFor="sjf">Shortest Job First (SJF)</label>
          </div>
          <div className="algoRadio">
            <input onChange={() => {setAlgorithm("rr"); setSim(false)}} type="radio" id="rr" name="algorithm" value="rr" checked={algorithm === "rr"} />
            <label htmlFor="rr">Round Robin (RR)</label>
          </div>
          <div className="algoRadio">
            <input onChange={() => {setAlgorithm("priority"); setSim(false)}} type="radio" id="priority" name="algorithm" value="priority" checked={algorithm === "priority"} />
            <label htmlFor="priority">Priority Scheduling</label>
          </div>
        </form>
      </div>

      <div className="dataEntry containers">
        <h2>Inserisci i dati dei processi</h2>
        <form onSubmit={formSubmit}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome del processo</th>
                <th>Ciclo di arrivo</th>
                <th>Durata processo</th>
                <th className={algorithm === "priority" ? "" : "hide"}>Priorità</th>
                {algorithm === "rr" && (
                  <th>Quanto di tempo = 
                    <input 
                      type="number" 
                      min="1"
                      value={QuantoTime} 
                      onChange={(e) => setQuantoTime(Number(e.target.value) || 1)} 
                    />
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              <TableData algorithm={algorithm} rows={rows} setRows={setRows} />
            </tbody>
          </table>
          <input type="submit" value="Inizia la simulazione" />
        </form>
        {sim ? <SimulationProcess data={rows} algorithm={algorithm} quantum={QuantoTime} /> : null}
      </div>
    </>
  )
}

export default App;