<script>
    import TrashIcon from "../assets/icons/TrashIcon.svelte";
    import TemplateIcon from "../assets/icons/TemplateIcon.svelte";
    import SaveIcon from "../assets/icons/SaveIcon.svelte";
    import LoadIcon from "../assets/icons/LoadIcon.svelte";
    import UndoIcon from "../assets/icons/UndoIcon.svelte";
    import RedoIcon from "../assets/icons/RedoIcon.svelte";
    import { settings } from "../logic/Settings.svelte.js";
    import SQLiteSvelte from "../logic/SQLite.svelte";
    import { SQLite } from "@codemirror/lang-sql";

    let fileBrowser;

    function clearButtonClick() {
        settings.clearTables();
        settings.clearLogs();
    }

    async function exampleButtonClick() {
        await settings.executeSQL(
            "CREATE TABLE test (id INTEGER PRIMARY KEY, text VARCHAR(30));",
        );
        await settings.executeSQL(
            "INSERT INTO test (text) VALUES ('Hello World :3');",
        );
        await settings.executeSQL(
            "INSERT INTO test (text) VALUES ('Hey you OwO');",
        );
    }

    async function saveButtonClick() {
        let data = await SQLiteSvelte.getDatabase();
        data = data.export();
        saveToFile(data, "database.db");
    }

    function saveToFile(data, fileName) {
        const a = document.createElement("a");
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    async function fileChanged() {
        const arrayBuffer = await fileBrowser.files[0].arrayBuffer();
        const array = new Uint8Array(arrayBuffer);
        const SQL = await SQLiteSvelte.getSQL();
        const db = new SQL.Database(array);
        console.log(db);
        SQLiteSvelte.setDatabase(db);
        await settings.reloadTables();
    }
</script>

<main>
    <div class="topBar">
        <button aria-label="Deletes database" on:click={clearButtonClick}
            >Clear<TrashIcon /></button
        >
        <button
            aria-label="Loads a example database."
            on:click={exampleButtonClick}>Example<TemplateIcon /></button
        >
        <div class="category">
            <button
                aria-label="Saves database as files."
                on:click={saveButtonClick}
            >
                Save<SaveIcon /></button
            >
            <input
                bind:this={fileBrowser}
                type="file"
                on:change={fileChanged}
                style="display:none;"
            />
            <button class="disabled" on:click={() => fileBrowser.click()}
                >Load<LoadIcon /></button
            >
        </div>
        <div class="category">
            <button aria-label="Revert changes." class="disabled">
                Undo<UndoIcon /></button
            >
            <button aria-label="Redo changes." class="disabled">
                Redo<RedoIcon /></button
            >
        </div>
    </div>
</main>

<style>
    .category {
        background-color: rgba(160, 160, 200, 0.08);
        margin: 0.25em;
        border-radius: 8px;
        border: 1px solid transparent;
        border-color: #ffffff4a;
    }
    .topBar {
        border-bottom: 1px solid transparent;
        border-color: #646cff;
        display: flex;
        padding: 0.25em 2px;
        align-items: center;
        flex-wrap: wrap;
    }

    .topBar button {
        display: inline-flex;
        align-items: center;
        margin: 0.25em;
        max-height: 2.4em;
    }
</style>
