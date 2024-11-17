import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url"

let SQL;
let db;
initializeSQL();

async function initializeSQL() {
    SQL = await initSqlJs({
        // Loading wasm file
        locateFile: (file) => wasmUrl
    });
    db = new SQL.Database();
}

export default {
    executeSQL: async (text) => {
        try {
            return { output: db.exec(text) };
        } catch (error) {
            return { error: error.message };
        }
    }
}
