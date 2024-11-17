let autoComplete = true;
let logs = $state([]);

export const settings = {
	getAutoComplete: () => autoComplete,
    clearAll: () => {
        logs = [];
        // TODO: clear tables
    },
    getLogs: () => logs,
    clearLogs: () => {
        logs = [];
    },
    addLog: (log) => logs.push(log),
    saveLogs: () => {
        localStorage.setItem("logs", JSON.stringify(logs));
    },
    loadLogs: () => {
        logs = [];
        const text = localStorage.getItem("logs");
        if (text && text != "undefined") {
            for (const obj of JSON.parse(text)) {
                logs.push(obj);
            }
        }
    }
};
