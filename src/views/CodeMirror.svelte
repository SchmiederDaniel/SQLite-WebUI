<script>
    import { onMount } from "svelte";
    import { EditorState } from "@codemirror/state";
    import { EditorView } from "codemirror";
    import { sql, SQLite } from "@codemirror/lang-sql";
    import {
        defaultHighlightStyle,
        syntaxHighlighting,
    } from "@codemirror/language";
    import { highlightSpecialChars } from "@codemirror/view";
    const { text } = $props();
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

    function setSettings(autocomplete) {
        let basicSetup = [
            EditorState.readOnly.of(false),
            highlightSpecialChars(),
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
        setText(text);
        // Cleanup function to destroy the editor when the component is unmounted
        return () => {
            view.destroy();
        };
    });
</script>

<main>
    <!-- svelte-ignore a11y_autofocus -->
    <div class="input-box" autofocus bind:this={editorDiv}></div>
</main>
