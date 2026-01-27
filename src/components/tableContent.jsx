
const baseObj = {"name": "", "start": 0, "length": 1, "priority": 0};

export default function TableData({ algorithm, rows, setRows }) {
    

    const addRow = () => {
        setRows([...rows, baseObj]);
    }

    const delRow = () => {
        if (rows.length > 0) {
            setRows(rows.slice(0, -1));
        }
    }

    const editValueRows = (index, key, value) => {
        if(key == "start" && value <= 0){
            value = 0
        }
        if(key == "lenght" && value <= 1){
            value = 1
        }
        let copyRows = [...rows];
        copyRows[index] = {...copyRows[index] , [key]: value};
        setRows(copyRows);
    }


    return (
        <>
            {rows.map((_, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        <input 
                            type="text" 
                            name={`processName${index}`} 
                            onChange={(e) => {editValueRows(index, "name", e.target.value)}} 
                            value={`P${index}`} 
                        />
                    </td>
                    <td>
                        <input 
                            min={0}
                            type="number" 
                            name={`arrivalCycle${index}`} 
                            onChange={(e) => {editValueRows(index, "start", e.target.value)}} 
                            value={rows[index].start}
                        />
                    </td>
                    <td>
                        <input 
                            min={1}
                            type="number" 
                            name={`processDuration${index}`} 
                            onChange={(e) => {editValueRows(index, "length", e.target.value)}}
                            value={rows[index].length}
                        />
                    </td>
                    <td className={algorithm === "priority" ? "" : "hide"}>
                        <input 
                            type="number" 
                            name={`priority${index}`} onChange={(e) => {editValueRows(index, "priority", e.target.value)}} 
                            value={rows[index].priority}
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