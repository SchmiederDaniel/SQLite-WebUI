<script>
    import ArrowIcon from "../assets/ArrowIcon.svelte";
    import RunIcon from "../assets/icons/RunIcon.svelte";
    import InputField from "./InputField.svelte";
    import SQLite from "../logic/SQLite.svelte";
    import { onMount } from "svelte";
    import { settings } from "../logic/Settings.svelte";
    import Codemirror from "./CodeMirror.svelte";

    let inputField;
    async function executeSQL() {
        const text = inputField.getText();
        if (text.trim().length == 0) return;
        const result = await SQLite.executeSQL(text);
        console.log(result);

        settings.getLogs().unshift({
            input: text,
            isError: result.error != undefined,
            output: convertOutput(result),
        });
        setText("");
        settings.saveLogs();
    }

    function convertOutput(result) {
        let output = "";
        if (result.output == undefined) {
            output = result.error;
        } else {
            let array = result.output;
            if (array.length > 0) {
                if (array) output = JSON.stringify(array);
            }
        }
        return output;
    }

    onMount(() => {
        settings.loadLogs();
    });

    function setText(text) {
        inputField.setText(text);
    }
</script>

<main>
    <div>Console:</div>
    <!--<CodeMirror bind:value lang={sql()} on:ready={(event) => onReady()} />-->
    <div class="input-border shadow">
        <div class="arrow"><ArrowIcon /></div>
        <InputField bind:this={inputField} {executeSQL} />
        <button
            class="execute"
            onclick={executeSQL}
            aria-label="Execute SQL code"
            ><RunIcon />
        </button>
    </div>
    <div>History:</div>
    <div class="logs">
        {#each settings.getLogs() as element}
            <div class=" shadow">
                <Codemirror text={element.input.toString()}/>
                {#if element.isError}
                    <div class="error">{element.output}</div>
                {:else if element.output.length > 0}
                    <div class="pass">{element.output}</div>
                {/if}
            </div>
        {/each}
    </div>
</main>

<style>
    .error {
        color: red;
    }

    main {
        height: 100%;
    }

    .logs {
        padding: 8px 0 8px 0;
        overflow: visible;
        overflow: auto;
        max-height: 100%;
    }

    .logs > div {
        padding: 4px 8px 4px 8px;
        background-color: #242424;
        border-radius: 8px;
        border: 1px solid #646cff;
        align-items: stretch;
        margin: 0px 0 16px 0;
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
        border-radius: 8px;
        display: inline-flex;
        border: 1px solid #646cff;
        width: 100%;
        align-items: stretch;
        margin: 8px 0 8px 0;
    }
</style>
