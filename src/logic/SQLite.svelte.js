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
    if (!db) {
        db = new SQL.Database();
    }
}

// TODO: Either use the settings object or use export. But using both is a dirty solution.

export default {
    clearTables: async () => {
        db.close();
        db = new SQL.Database();
        await settings.reloadTables();
    },
    setDatabase: (newDB) => { // TODO: should this be async?
        db.close();
        initializeSQL();
        db = newDB;
    },
    getSQL: async () => {
        await initializeSQL();
        return SQL;
    },
    getDatabase: async () => {
        await initializeSQL();
        return db;
    },
    executeSQL: async (text) => {
        await initializeSQL();
        try {
            return { output: db.exec(text) };
        } catch (error) {
            return { error: error };
        }
    },
    copyDatabase: async () => {
        await initializeSQL();
        const copy = db.export();
        return copy;
    }
}
