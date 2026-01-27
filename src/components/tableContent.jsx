const baseObj = { "name": "", "start": 0, "length": 1, "priority": 0 };

export default function TableData({ algorithm, rows, setRows }) {

    // 1. Funzione Aggiungi: Crea l'oggetto con il nome già assegnato
    const addRow = () => {
        const nextIndex = rows.length;
        const newRow = { 
            ...baseObj, 
            name: `P${nextIndex}` // Assegna "P0", "P1", ecc. al momento della creazione
        };
        setRows([...rows, newRow]);
    }

    const delRow = () => {
        if (rows.length > 0) {
            setRows(rows.slice(0, -1));
        }
    }

    const editValueRows = (index, key, value) => {
        let newValue = value;

        // Validazioni e correzione typo "length"
        if (key === "start" && value < 0) newValue = 0;
        if (key === "length" && value < 1) newValue = 1;

        const copyRows = [...rows];
        copyRows[index] = { ...copyRows[index], [key]: newValue };
        setRows(copyRows);
    }

    return (
        <>
            {rows.map((row, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        <input 
                            type="text" 
                            name={`processName${index}`} 
                            // Legge il valore "P0", "P1" direttamente dallo stato
                            value={row.name} 
                            onChange={(e) => editValueRows(index, "name", e.target.value)} 
                        />
                    </td>
                    <td>
                        <input 
                            min={0}
                            type="number" 
                            name={`arrivalCycle${index}`} 
                            onChange={(e) => editValueRows(index, "start", parseInt(e.target.value) || 0)} 
                            value={row.start}
                        />
                    </td>
                    <td>
                        <input 
                            min={1}
                            type="number" 
                            name={`processDuration${index}`} 
                            onChange={(e) => editValueRows(index, "length", parseInt(e.target.value) || 1)}
                            value={row.length}
                        />
                    </td>
                    <td className={algorithm === "priority" ? "" : "hide"}>
                        <input 
                            type="number" 
                            name={`priority${index}`} 
                            onChange={(e) => editValueRows(index, "priority", parseInt(e.target.value) || 0)} 
                            value={row.priority}
                        />
                    </td>
                </tr>
            ))}

            <tr>
                <td className='btn_row' colSpan={algorithm === "priority" || algorithm === "rr" ? 6 : 5}>
                    <button type="button" onClick={addRow}>+ Aggiungi</button>
                    <button type="button" onClick={delRow}>- Rimuovi</button>
                </td>
            </tr>
        </>
    );
}