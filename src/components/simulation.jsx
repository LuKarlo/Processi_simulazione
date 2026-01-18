
let wt = 0;

export default function SimulationProcess({ data, algorithm, quantum = 1 }) {

    const fcfs = () => {
        if (!data || data.length === 0) return [];

        let processes = data
            .map(p => ({ ...p }))
            .sort((a, b) => Number(a.start) - Number(b.start));

        let timeline_process = [];

        for (let i = 0; i < processes.length; i++) {
            let e = processes[i];

            const startVal = Number(e.start);
            const lengthVal = Number(e.length);

            if (timeline_process.length === 0) {
                // Primo processo della lista
                e.end = startVal + lengthVal;
                timeline_process.push(e);
            } else {
                const last = timeline_process[timeline_process.length - 1];

                if (last.end > startVal) {
                    e.actualStart = last.end;
                    e.end = last.end + lengthVal;
                } else {
                    e.actualStart = startVal;
                    e.end = startVal + lengthVal;
                }
                timeline_process.push(e);
            }
        }

        return timeline_process;
    };

    const sjf = () => {
        if (!data || data.length === 0) return [];

        let pending = data.map(p => ({ ...p, length: Number(p.length), start: Number(p.start) }));
        let timeline_process = [];
        let currentTime = Math.min(...pending.map(p => p.start));

        while (pending.length > 0) {
            // Filtra i processi già arrivati al tempo corrente
            let available = pending.filter(p => p.start <= currentTime);

            if (available.length === 0) {
                currentTime++; // Idle CPU
                continue;
            }

            // Sceglie quello con la durata (length) minore
            available.sort((a, b) => a.length - b.length);
            let next = available[0];

            next.actualStart = currentTime;
            next.end = currentTime + next.length;

            timeline_process.push(next);
            currentTime = next.end;

            // Rimuovi dai pendenti
            pending = pending.filter(p => p.name !== next.name);
        }
        return timeline_process;
    };

    const priorityAlgo = () => {
        if (!data || data.length === 0) return [];

        let pending = data.map(p => ({ ...p, priority: Number(p.priority), start: Number(p.start) }));
        let timeline_process = [];
        let currentTime = Math.min(...pending.map(p => p.start));

        while (pending.length > 0) {
            let available = pending.filter(p => p.start <= currentTime);

            if (available.length === 0) {
                currentTime++;
                continue;
            }

            // Sceglie la priorità minore (es: 0 è più importante di 10)
            available.sort((a, b) => a.priority - b.priority);
            let next = available[0];

            next.actualStart = currentTime;
            next.end = currentTime + Number(next.length);

            timeline_process.push(next);
            currentTime = next.end;

            pending = pending.filter(p => p.name !== next.name);
        }
        return timeline_process;
    };

    const rr = () => {
        if (!data || data.length === 0) return [];

        let q = Number(quantum) || 2;
        // Teniamo traccia del tempo rimanente per ogni processo
        let queue = [];
        let pending = data
            .map(p => ({ ...p, remaining: Number(p.length), start: Number(p.start) }))
            .sort((a, b) => a.start - b.start);

        let timeline_process = [];
        let currentTime = pending[0].start;

        // Inizializza la coda con i primi processi arrivati
        const updateQueue = () => {
            pending.filter(p => p.start <= currentTime && !queue.find(q => q.name === p.name))
                .forEach(p => {
                    queue.push(p);
                    pending = pending.filter(rem => rem.name !== p.name);
                });
        };

        updateQueue();

        while (queue.length > 0 || pending.length > 0) {
            if (queue.length === 0) {
                currentTime++;
                updateQueue();
                continue;
            }

            let currentProcess = queue.shift();
            let executionTime = Math.min(currentProcess.remaining, q);

            // Crea un "pezzo" di processo per la timeline
            timeline_process.push({
                ...currentProcess,
                actualStart: currentTime,
                end: currentTime + executionTime
            });

            currentTime += executionTime;
            currentProcess.remaining -= executionTime;

            // Prima di rimettere il processo in coda, aggiungi i nuovi arrivati
            updateQueue();

            if (currentProcess.remaining > 0) {
                queue.push(currentProcess);
            }
        }
        return timeline_process;
    };

    const algo = () => {
        if (algorithm == "fcfs") {
            return fcfs();
        }
        if (algorithm == "sjf") {
            return sjf();
        }
        if (algorithm == "priority") {
            return priorityAlgo();
        }
        if (algorithm == "rr") {
            return rr();
        }
    }


    const result = algo();

    return (
        <div className="simulation_container">
            {createLayout(result, data)}
            <div className="waitingTime">
                Waiting time medio: {wt / data.length}
            </div>
        </div>
    );
}



const createLayout = (timeline, data) => {
    const firstStartTime = Math.min(...data.map(e => Number(e.start)));

    const totalTime = timeline[timeline.length - 1].end;

    // Il tempo visualizzato partirà da firstStartTime invece che da 0
    const displayDuration = totalTime - firstStartTime;

    const renderTimeline = () => {
        // Reset wt locale per il calcolo corretto
        wt = 0;

        let completeTimestamp = Array.from({ length: displayDuration }, () => ({
            running: "",
            arrived: "",
            finished: ""
        }));

        // 3. Riempiamo l'array sottraendo l'offset (firstStartTime)
        timeline.forEach((e) => {
            const start = e.actualStart !== undefined ? e.actualStart : Number(e.start);
            const end = e.end;

            // Calcolo Waiting Time (Esempio semplificato: Start Reale - Arrivo)
            wt += (start - Number(e.start));

            // Riempiamo i cicli sottraendo l'offset
            for (let t = start; t < end; t++) {
                const shiftedIndex = t - firstStartTime;
                if (completeTimestamp[shiftedIndex]) {
                    completeTimestamp[shiftedIndex].running = e.name;
                }
            }

            // Eventi (Arrivo e Fine)
            const arrivalIndex = Number(e.start) - firstStartTime;
            if (completeTimestamp[arrivalIndex]) {
                completeTimestamp[arrivalIndex].arrived = e.name;
            }

            const finishIndex = end - 1 - firstStartTime;
            if (completeTimestamp[finishIndex]) {
                completeTimestamp[finishIndex].finished = e.name;
            }
        });


        const processColors = {};
        timeline.forEach((p, index) => {
            if (!processColors[p.name]) {
                // Usiamo l'indice o il nome per generare un colore deterministico
                // Invece di Math.random(), usiamo una formula basata sull'indice 
                // per evitare che i colori cambino continuamente
                const hue = (index * 137.5) % 360; // Angolo aureo per colori ben distribuiti
                processColors[p.name] = `hsl(${hue}, 75%, 60%)`;

            }
        });




        // 4. Trasformiamo i dati in JSX (Tabella o Div)
        return (
            <>
                {completeTimestamp.map((e, index) => {
                    const bg = e.running ? processColors[e.running] : "#333";
                    // IL CICLO REALE CORRENTE
                    const currentCycle = index + firstStartTime; 

                    return (
                        <div className="cicle" style={{ height: `${60 * data.length}px` }} key={index}>
                            <div
                                style={{ background: bg, top: `${60 * data.findIndex(obj => obj.name === e.running)}px` }}
                                className={e.running ? "" : "hide"}
                            ></div>
                            <span className="tooltip">
                                <ul>
                                    {/* QUI: Usa currentCycle invece di displayDuration */}
                                    <li><strong>Ciclo: {currentCycle}</strong></li>
                                    {e.running ? <li>Running: {e.running}</li> : <li>CPU IDLE</li>}
                                    {e.arrived && <li>Arrivato: {e.arrived}</li>}
                                    {e.finished && <li>Terminato: {e.finished}</li>}
                                </ul>
                            </span>
                        </div>
                    )
                })}

                <table className="bgtable" style={{ height: `${60 * data.length + 2}px` }}>
                    <tbody>
                        {data.map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {completeTimestamp.map((_, i) => (
                                    <td key={i}>
                                        {/* QUI: Mostra il numero solo nell'ultima riga e usa firstStartTime */}
                                        {(rowIndex + 1) === data.length ? (
                                            <span className="numberCicle">{i + firstStartTime}</span>
                                        ) : ""}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };

    return (
        <div className="simulation">
            {renderTimeline()}
        </div>
    );
};

