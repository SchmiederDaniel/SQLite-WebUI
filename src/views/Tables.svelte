<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { settings } from "../logic/Settings.svelte";
    import TableView from "./TableView.svelte";
    import sql from "../logic/SQLite.svelte";
    import SaveIcon from "../assets/icons/SaveIcon.svelte";
    import LoadIcon from "../assets/icons/LoadIcon.svelte";
    import SQLiteSvelte from "../logic/SQLite.svelte";

    let tables;
    let overview;
    let fileBrowser;

    settings.reloadTables = async () => {
        let newTable = [];
        overview = null;
        const nameResult = (
            await sql.executeSQL(
                "SELECT name FROM sqlite_master WHERE type='table';",
            )
        ).output;
        if (nameResult.length > 0) {
            const tableNames = nameResult[0].values.map((e) => e[0]);
            overview = {
                columns: ["Tables"],
                values: tableNames.map((e) => [e]),
            };
            for (const tableName of tableNames) {
                let tableInfo = await sql.executeSQL(
                    `PRAGMA table_info(${tableName});`,
                );
                tableInfo = tableInfo.output[0];

                let result = await sql.executeSQL(
                    `SELECT * FROM ${tableName} LIMIT ${settings.tableLimit};`,
                );
                if (result.error) {
                    console.log(
                        `Error at creating TableViews: ${JSON.stringify(result.error)}`,
                    );
                }
                result = result.output[0];

                const names = tableInfo.values.map((e) => e[1]);
                const types = tableInfo.values.map((e) => e[2]);
                const pks = tableInfo.values.map((e) => e[5]);
                if (!result) {
                    result = {
                        // @ts-ignore... bad linter there is no typescript
                        values: [names.map((e) => null)],
                    };
                }
                result.pks = pks.map((e) => (e == 1 ? "PK" : null));
                result.types = types;
                result.columns = names;
                /*result.columns = names.map(
                    (e, i) => `${pks[i] == 1 ? "PK " : ""}${types[i]}: ${e}`,
                );*/
                result.name = tableName;
                newTable.push(result);
            }
        }
        tables = newTable;
    };

    async function saveButtonClick() {
        let data = await SQLiteSvelte.getDatabase();
        data = data.export();
        saveToFile(data, "database.db");
        settings.showPopup("Saved file successfully!")
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
        const file = fileBrowser.files[0];
        await settings.loadDatabaseFile(file);
    }

    onMount(() => {
        settings.reloadTables();
    });
</script>

<main>
    <div class="globalPadding bar">
        <div style="text-align: center;">Tables:</div>
        <div style="flex-grow: 1;"></div>
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
        <button on:click={() => fileBrowser.click()}>Load<LoadIcon /></button>
    </div>
    <div class="scrollDiv inner-shadow">
        <div class="tables">
            {#if overview}
                <TableView table={overview} shadow={true} />
            {/if}
            {#each tables as table}
                <TableView {table} shadow={true} />
            {/each}
        </div>
    </div>
</main>

<style>
    .bar {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
    }

    .scrollDiv {
        flex-grow: 1;
        max-height: 100%;
        overflow-y: auto;
    }
    main {
        width: 100%;
        height: 100%;
        max-height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .tables {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
    }
</style>
