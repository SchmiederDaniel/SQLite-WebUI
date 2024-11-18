let autoComplete = true;
const logs = $state([]);
async function clear() {
    logs.splice(0, logs.length);
    await settings.reloadTables();
}

export const settings = {
    addLog: async (log) => {
        logs.push(log);
        await settings.reloadTables();
    },
    getLogs: () => logs,
    getAutoComplete: () => autoComplete,
    saveLogs: () => {
        localStorage.setItem("logs", JSON.stringify(logs));
    },
    clearLogs: () => {
        clear();
        settings.saveLogs();
    },
    loadLogs: () => {
        clear();
        const text = localStorage.getItem("logs");
        if (text && text != "undefined") {
            for (const obj of JSON.parse(text)) {
                logs.push(obj);
            }
        }
    },
};
