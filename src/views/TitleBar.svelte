<script>
    // @ts-nocheck
    import TrashIcon from "../assets/icons/TrashIcon.svelte";
    import TemplateIcon from "../assets/icons/TemplateIcon.svelte";
    import { settings } from "../logic/Settings.svelte.js";
    import SQLiteSvelte from "../logic/SQLite.svelte";
    import { SQLite } from "@codemirror/lang-sql";

    function clearButtonClick() {
        SQLiteSvelte.clearTables();
        settings.clearLogs();
        settings.showPopup("Deleted database successfully!")
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
        settings.showPopup("Loaded example successfully!")
    }
</script>

<main>
    <div class="topBar globalPadding">
        <button aria-label="Deletes database" on:click={clearButtonClick}
            >Clear<TrashIcon /></button
        >
        <button
            aria-label="Loads a example database."
            on:click={exampleButtonClick}>Example<TemplateIcon /></button
        >
    </div>
</main>

<style>
    /*
    .category {
        background-color: rgba(160, 160, 200, 0.08);
        margin: 0.25em;
        border-radius: var(--border-radius);
        border: 1px solid transparent;
        border-color: #ffffff4a;
    }
    */
    .topBar {
        /*border-bottom: 1px solid transparent;
        border-color: var(--borderColor);*/
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-top: 0;
        padding-bottom: 0;
    }

    .topBar button {
        display: inline-flex;
        align-items: center;
        margin: 0.25em;
        max-height: 2.4em;
    }
</style>
