import SQLiteSvelte from "./SQLite.svelte";

let autoComplete = true;

export const settings = {
    tableLimit: 9999, // Limit for how many rows will be shown per table
    getAutoComplete: () => autoComplete,
    loadDatabaseFile: async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const array = new Uint8Array(arrayBuffer);
            const SQL = await SQLiteSvelte.getSQL();
            const db = new SQL.Database(array);
            SQLiteSvelte.setDatabase(db);
            await settings.reloadTables();
            settings.showPopup("Loaded database successfuly!");
        } catch (err) {
            settings.showPopup("Couldn't load database file.", true);
            console.error(err);
        }
    },
};
