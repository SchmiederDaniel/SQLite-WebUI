import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url"
import { settings } from "./Settings.svelte";

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

settings.clearTables = async () => {
    db = new SQL.Database();
    await settings.reloadTables();
};

export default {
    executeSQL: async (text) => {
        if(!db)
            await initializeSQL();
        try {
            return { output: db.exec(text) };
        } catch (error) {
            return { error: error.message };
        }
    }
}
