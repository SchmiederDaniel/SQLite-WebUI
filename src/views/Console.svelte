<script>
    // @ts-nocheck
    import ArrowIcon from "../assets/icons/ArrowIcon.svelte";
    import RunIcon from "../assets/icons/RunIcon.svelte";
    import InputField from "./InputField.svelte";
    import { onMount } from "svelte";
    import { settings } from "../logic/Settings.svelte";
    import Codemirror from "./CodeMirror.svelte";
    import TableView from "./TableView.svelte";
    import UndoIcon from "../assets/icons/UndoIcon.svelte";
    import RedoIcon from "../assets/icons/RedoIcon.svelte";
    import SQLiteSvelte from "../logic/SQLite.svelte";

    const logs = $state([]);
    let undoList = [];
    let currentIndex;

    async function clear() {
        logs.splice(0, logs.length);
        await settings.reloadTables();
    }

    settings.addLog = async (log) => {
        logs.push(log);
        if(!log.isError) {
            const dbArray = await SQLiteSvelte.copyDatabase();
            undoList.splice(currentIndex + 1, undoList.length);
            currentIndex = undoList.length;
            undoList.push(arrayToHex(dbArray));
        }
        await settings.reloadTables();
    };

    settings.saveLogs = () => {
        localStorage.setItem("undoList", JSON.stringify(undoList));
        localStorage.setItem("currenIndex", JSON.stringify(currentIndex));
        localStorage.setItem("logs", JSON.stringify(logs));
    };

    settings.clearLogs = () => {
        clear();
        undoList = [];
        currentIndex = 0;
        settings.saveLogs();
    };

    settings.loadLogs = async () => {
        clear();
        const text = localStorage.getItem("logs");
        if (text && text != "undefined") {
            for (const obj of JSON.parse(text)) {
                logs.push(obj);
            }
        }

        const indexJson = localStorage.getItem("currenIndex");
        if (indexJson) {
            currentIndex = JSON.parse(indexJson);
        } else {
            currentIndex = 0;
        }

        const json = localStorage.getItem("undoList");
        if (json) {
            undoList = JSON.parse(json);
            await reloadDatabase();
        }
    };

    async function reloadDatabase() {
        if (undoList.length > 0) {
            const last = undoList[currentIndex];
            const array = hexToArray(last);
            await setDatabaseByArray(array);
        }
    }

    async function undoButtonClick() {
        currentIndex = Math.max(currentIndex - 1, 0);
        await reloadDatabase();
    }

    async function redoButtonClick() {
        currentIndex = Math.min(currentIndex + 1, undoList.length - 1);
        await reloadDatabase();
    }

    function arrayToHex(decimalArray) {
        const hexArray = [];
        for (const integer of decimalArray) {
            let hex = integer.toString(16);
            if (hex.length === 1) {
                hex = `0${hex}`;
            }
            hexArray.push(hex);
        }
        return hexArray.join("");
    }

    function hexToArray(hexString) {
        if (hexString.length == 0) {
            return new Uint8Array(0);
        }
        const hexArray = hexString.match(/.{1,2}/g);
        const decimalArray = new Uint8Array(hexArray.length);
        for (let i = 0; i < hexArray.length; i++) {
            const c = hexArray[i];
            decimalArray[i] = Number.parseInt(c, 16);
        }
        return decimalArray;
    }

    function runButtonClick() {
        settings.executeSQL();
    }

    function logClick(index) {
        settings.setText(logs[index].input);
    }

    async function setDatabaseByArray(array) {
        const SQL = await SQLiteSvelte.getSQL();
        const db = new SQL.Database(array);
        SQLiteSvelte.setDatabase(db);
        await settings.reloadTables();
    }

    onMount(() => {
        settings.loadLogs();
    });
</script>

<main>
    <div class="globalPadding">
        <div class="bar">
            <div>Console:</div>
            <div style="flex-grow: 1;"></div>
            <button aria-label="Revert changes." onclick={undoButtonClick}
                >Undo<UndoIcon /></button
            >
            <button aria-label="Redo changes." onclick={redoButtonClick}
                >Redo<RedoIcon /></button
            >
        </div>
        <!--<CodeMirror bind:value lang={sql()} on:ready={(event) => onReady()} />-->
        <div class="input-border shadow">
            <div class="arrow"><ArrowIcon /></div>
            <InputField />
            <button
                class="execute"
                onclick={runButtonClick}
                aria-label="Execute SQL code"
                ><RunIcon />
            </button>
        </div>
        History:
    </div>
    <div class="logs-scroll inner-shadow">
        <div class="logs globalPadding">
            {#each logs as log, i}
                <button class="content shadow" onclick={() => logClick(i)}>
                    <Codemirror text={"" + log.input} />
                    {#if log.isError}
                        <div class="error output">{log.output}</div>
                    {:else if log.output.length > 0}
                        <div class="output">
                            {JSON.stringify(log.output)}
                        </div>
                        <TableView table={log.output[0]} />
                    {/if}
                </button>
            {/each}
        </div>
    </div>
</main>

<style>
    .bar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .output {
        padding: 4px;
    }
    .error {
        color: red;
    }

    main {
        width: 100%;
        height: 100%;
        max-height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .logs-scroll {
        overflow-y: auto;
        max-height: 100%;
        flex-grow: 1;
    }

    .logs {
        overflow: visible;
        display: flex;
        flex-direction: column-reverse;
    }

    .logs > button {
        padding: 4px 8px 4px 8px;
        background-color: #242424;
        border-radius: var(--border-radius);
        align-items: stretch;
        margin: 6px 0 6px 0;
    }

    .arrow {
        padding: 0px 0px 0px 2px;
        display: flex;
        align-items: center;
    }

    .execute {
        padding-top: 0;
        padding-bottom: 0;
        margin: 0;
        align-items: center;
        display: flex;
        padding: 0.6em;
    }

    .input-border {
        background-color: #242424;
        border-radius: var(--border-radius);
        display: inline-flex;
        width: 100%;
        align-items: stretch;
        margin: 8px 0 8px 0;
    }

    .content {
        display: flex;
        flex-direction: column;
        text-align: left;
    }
</style>
