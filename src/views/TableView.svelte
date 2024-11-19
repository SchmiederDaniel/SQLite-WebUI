<script>
    const { table, shadow = false } = $props();
    //console.log(table);
</script>

<main class="globalPadding">
    <div class={(shadow ? "shadow" : "") + " border"}>
        {#if table.name}
            <div class="tableName">{table.name}</div>
        {/if}
        <div class="table-contianer">
            <table>
                <thead>
                    <tr>
                        {#each table.columns as name, i}
                            <th>
                                {#if table.pks && table.pks[i]}
                                    <div class="key">{table.pks[i]}</div>
                                {/if}
                                {#if table.types && table.types[i]}
                                    <div class="type">{table.types[i]}:</div>
                                {/if}
                                <div class="name">{name}</div>
                            </th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each table.values as row}
                        <tr>
                            {#each row as obj}
                                <td>
                                    {#if obj === null}
                                        -
                                    {:else}
                                        {JSON.stringify(obj)}
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</main>

<style>
    :root {
        --border-color: rgb(113, 113, 113);
    }

    table tr:last-child td:first-child {
        border-bottom-left-radius: var(--border-radius);
    }

    table tr:last-child td:last-child {
        border-bottom-right-radius: var(--border-radius);
    }

    table tr:first-child th:first-child {
        border-top-left-radius: var(--border-radius);
    }

    table tr:first-child th:last-child {
        border-top-right-radius: var(--border-radius);
    }

    .type,
    .key {
        color: rgb(160, 160, 160);
    }

    .name {
        font-weight: bold;
        color: white;
    }

    .tableName {
        padding: 0.2em 0.5em 0.2em 0.5em;
        text-align: center;
        font-size: 1.1em;
        font-weight: bold;
    }
    .border {
        border-radius: var(--border-radius);
        width: fit-content;
        background-color: var(--background-color);
    }

    main {
        width: fit-content;
        height: fit-content;
    }

    .table-contianer {
        overflow: auto;
        max-width: 100%;
        max-height: 100%;
    }

    table {
        border-spacing: 0;
        height: min-content;
        border: solid var(--border-color) 1px;
        /*
        border-collapse: collapse;
        */
        border-radius: var(--border-radius);
    }

    tbody tr {
        border-top: solid 1px var(--border-color);
    }

    th {
        text-align-last: center;
        background-color: var(--component-color);
    }

    td,
    th {
        text-align: center;
        padding: 0.3em 0.5em 0.3em 0.5em;
    }

    td:nth-child(even) {
        background-color: color-mix(in srgb, var(--background-color) 80%, white);
    }
</style>
