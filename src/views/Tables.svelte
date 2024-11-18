<script>
    import { onMount } from "svelte";
    import { settings } from "../logic/Settings.svelte";
    import TableView from "./TableView.svelte";
    import sql from "../logic/SQLite.svelte";

    let tables;
    let overview;

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
                const tableInfo = (
                    await sql.executeSQL(`PRAGMA table_info(${tableName});`)
                ).output[0];

                let result = await sql.executeSQL(
                    `SELECT * FROM ${tableName};`,
                );
                if (result.error) {
                    console.log(
                        "Error at creating TableViews: " +
                            JSON.stringify(result.error),
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

    onMount(() => {
        settings.reloadTables();
    });
</script>

<main>
    <div>Tables:</div>
    <div class="tables">
        {#if overview}
            <TableView table={overview} shadow={true} />
        {/if}
        {#each tables as table}
            <TableView {table} shadow={true} />
        {/each}
    </div>
</main>

<style>
    .tables {
        display: flex;
        flex-wrap: wrap;
    }
</style>
