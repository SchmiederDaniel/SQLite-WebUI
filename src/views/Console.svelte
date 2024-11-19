<script>
    import ArrowIcon from "../assets/icons/ArrowIcon.svelte";
    import RunIcon from "../assets/icons/RunIcon.svelte";
    import InputField from "./InputField.svelte";
    import { onMount } from "svelte";
    import { settings } from "../logic/Settings.svelte";
    import Codemirror from "./CodeMirror.svelte";
    import TableView from "./TableView.svelte";

    function runButtonClick() {
        settings.executeSQL();
    }

    onMount(() => {
        settings.loadLogs();
    });
</script>

<main>
    <div class="globalPadding">
        <div>Console:</div>
        <!--<CodeMirror bind:value lang={sql()} on:ready={(event) => onReady()} />-->
        <div class="input-border shadow">
            <div class="arrow"><ArrowIcon /></div>
            <InputField />
            <button
                class="execute"
                on:click={runButtonClick}
                aria-label="Execute SQL code"
                ><RunIcon />
            </button>
        </div>
        History:
    </div>
    <div class="logs-scroll inner-shadow">
        <div class="logs globalPadding">
            {#each settings.getLogs() as element}
                <div class="content shadow">
                    <Codemirror text={"" + element.input} />
                    {#if element.isError}
                        <div class="error output">{element.output}</div>
                    {:else if element.output.length > 0}
                        <div class="output">
                            {JSON.stringify(element.output)}
                        </div>
                        <TableView table={element.output[0]} />
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</main>

<style>
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

    .logs > div {
        padding: 4px 8px 4px 8px;
        background-color: #242424;
        border-radius: var(--border-radius);
        align-items: stretch;
        margin: 3px 0 9px 0;
    }

    .arrow {
        padding: 0px 0px 0px 2px;
        display: flex;
        align-items: center;
    }

    .execute {
        padding-top: 0;
        padding-bottom: 0;
        align-items: center;
        display: flex;
    }

    .input-border {
        background-color: #242424;
        border-radius: var(--border-radius);
        display: inline-flex;
        width: 100%;
        align-items: stretch;
        margin: 8px 0 8px 0;
    }
</style>
