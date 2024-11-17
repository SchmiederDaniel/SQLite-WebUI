<script>
    import { onMount } from "svelte";
    import { EditorState } from "@codemirror/state";
    import { EditorView } from "codemirror";
    import { sql, SQLite } from "@codemirror/lang-sql";
    import {
        autocompletion,
        completionKeymap,
        closeBrackets,
        closeBracketsKeymap,
    } from "@codemirror/autocomplete"; // Fold-related extension
    import {
        defaultHighlightStyle,
        syntaxHighlighting,
    } from "@codemirror/language";
    import {
        defaultKeymap,
        history,
        historyKeymap,
    } from "@codemirror/commands";
    import { keymap, highlightSpecialChars } from "@codemirror/view";
    import { lintKeymap } from "@codemirror/lint";
    const { executeSQL } = $props();

    let editorDiv;
    let view;

    export function getText() {
        return view.state.doc.toString();
    }

    /**
     * @param {string} text
     */
    export function setText(text) {
        view.dispatch({
            changes: {
                from: 0,
                to: view.state.doc.length,
                insert: text,
            },
        });
    }

    function enterPress(event) {
        executeSQL();
        return event;
    }

    function setSettings(autocomplete) {
        let basicSetup = [
            highlightSpecialChars(),
            history(),
            closeBrackets(),
            autocompletion(),
            /*EditorView.updateListener.of((v) => {
                if (v.docChanged) {
                    // Document changed
                }
            }),*/
            /*EditorView.domEventHandlers({
                keydown: (event) => {
                    if (event.key == "Shift") shift = true;
                },
                keyup: (event) => {
                    if (event.key == "Shift") shift = false;
                },
            }),*/
            keymap.of([
                { key: "Shift-Enter", run: (event) => enterPress(event) },
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...historyKeymap,
                ...completionKeymap,
                ...lintKeymap,
            ]),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        ];
        if (autocomplete) {
            basicSetup.push(
                sql({
                    dialect: SQLite,
                    upperCaseKeywords: true,
                }),
            );
        }
        let state = EditorState.create({
            extensions: basicSetup,
        });

        // Create a new EditorView
        view = new EditorView({
            state,
            parent: editorDiv, // Attach to the div referenced by editorDiv
        });
    }
    onMount(() => {
        setSettings(true);
        // Cleanup function to destroy the editor when the component is unmounted
        return () => {
            view.destroy();
        };
    });
</script>

<main style="width: inherit;">
    <!-- svelte-ignore a11y_autofocus -->
    <div class="input-box" autofocus bind:this={editorDiv}></div>
</main>

<style>
    .input-box {
        padding: 2px;
        border: none;
        width: auto;
        width: 100%;
        background-color: var(--input-color);
    }

    .input-box:focus {
        outline: none;
        background-color: color-mix(in srgb, var(--input-color) 75%, black);
    }
</style>
