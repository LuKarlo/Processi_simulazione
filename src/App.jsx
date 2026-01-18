import { useState } from 'react';
import TableData from './components/tableContent';
import SimulationProcess from './components/simulation';
import './App.css';

const baseObj = {"name": "", "start": 0, "length": 1, "priority": 0};

function App() {
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [QuantoTime, setQuantoTime] = useState(1);
  const [rows, setRows] = useState(Array(3).fill(baseObj));
  const [sim, setSim] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    setSim(true);
  } 


  return (
    <>
      <div className="header containers">
        <h2>
          Seleziona l'algoritmo da usare nella simulazione
        </h2>
        <form action="">
          <div className="algoRadio">
            <input 
              onClick={() => {setAlgorithm("fcfs"); setSim(false)}} 
              type="radio" 
              id="fcfs" 
              name="algorithm" 
              value="fcfs"
              defaultChecked
              />
            <label htmlFor="fcfs">First-Come, First-Served (FCFS)</label>
          </div>
          <div className="algoRadio">
            <input onClick={() => {setAlgorithm("sjf"); setSim(false)}} type="radio" id="sjf" name="algorithm" value="sjf" />
            <label htmlFor="sjf">Shortest Job First (SJF)</label>
          </div>
          <div className="algoRadio">
            <input onClick={() => {setAlgorithm("rr"); setSim(false)}} type="radio" id="rr" name="algorithm" value="rr" />
            <label htmlFor="rr">Round Robin (RR)</label>
          </div>
          <div className="algoRadio">
            <input onClick={() => {setAlgorithm("priority"); setSim(false)}} type="radio" id="priority" name="algorithm" value="priority" />
            <label htmlFor="priority">Priority Scheduling</label>
          </div>
        </form>
      </div>

      <div className="dataEntry containers">
        <h2>Inserisci i dati dei processi</h2>
        <form action="" onSubmit={formSubmit}>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Nome del processo</th>
                <th>Ciclo di arrivo</th>
                <th>Durata processo</th>
                <th className={algorithm == "priority"? "" : "hide"}>Priorità</th>
                <th className={algorithm == "rr"? "" : "hide"}>Quanto di tempo = <input type="number" name="QuantoTime" onChange={(e) => {setQuantoTime(e.target.value > 0 ? e.target.value : 1)}} /></th>
              </tr>
            </thead>

            <tbody>
              <TableData algorithm={algorithm} rows={rows} setRows={setRows} />
            </tbody>
          </table>
          <input type="submit" value="Inizia la simulazione" />
        </form>
        {sim ? <SimulationProcess data={rows} algorithm={algorithm} quantum={QuantoTime} /> : <></>}
      </div>
    </>
  )
}

export default App
