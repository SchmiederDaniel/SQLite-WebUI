<script>
  import TitleBar from "./views/TitleBar.svelte";
  import Tables from "./views/Tables.svelte";
  import Console from "./views/Console.svelte";
  import { settings } from "./logic/Settings.svelte";

  let left;
  let dragBar;
  let isMouseDown = false;
  let width = $state();
  let dragOverlay;
  const dragbarDown = (e) => {
    isMouseDown = true;
    document.body.addEventListener("pointermove", dragMove);
    document.body.addEventListener("pointerup", dragEnd);
    e.preventDefault();
  };
  function dragMove(event) {
    if (isMouseDown && width > 600) {
      const offsetX = dragBar.clientWidth / 2; // 8px is padding on both sides of the site
      left.style.flexBasis = event.clientX - offsetX + "px";
    } else {
      dragEnd();
    }
  }
  const dragEnd = () => {
    isMouseDown = false;
    if (dragBar) dragBar.removeEventListener("pointermove", dragMove);
    document.body.removeEventListener("pointerup", dragEnd);
  };

  function drag(event) {
    dragOverlay.classList.remove("hidden");
    event.preventDefault();
  }

  function dragLeave(event) {
    dragOverlay.classList.add("hidden");
    event.preventDefault();
  }

  async function fileDrop(event) {
    event.preventDefault();
    dragOverlay.classList.add("hidden");
    const file = event.dataTransfer.files[0];
    settings.loadDatabaseFile(file);
  }

  let popups = $state([]);

  settings.showPopup = (text, isError = false) => {
    const obj = {
      isError: isError ? "error" : "",
      text: text,
    };
    popups.push(obj);
    setTimeout(() => {
      popups.splice(0);
    }, 5000);
  };
</script>

<main ondragover={drag} ondragenter={drag} ondragleave={dragLeave}>
  <div
    class="drop-area hidden"
    bind:this={dragOverlay}
    ondrop={fileDrop}
    role="none"
  >
    <div>
      <div style="width: 100%; text-align: center;">Drag & drop file here.</div>
    </div>
  </div>
  <div>
    {#each popups as popup}
      <div class="popup shadow {popup.isError}">{popup.text}</div>
    {/each}
  </div>
  <div class="split-horizontal">
    <TitleBar />
    <div class="split-vertical" bind:clientWidth={width}>
      <div bind:this={left} class="left side inner-shadow">
        <Tables />
      </div>
      <div
        bind:this={dragBar}
        class="dragBar"
        onpointerdown={(event) => dragbarDown(event)}
      ></div>
      <div class="side right inner-shadow">
        <Console />
      </div>
    </div>
  </div>
</main>

<style>
  .popup {
    position: absolute;
    bottom: 50px;
    animation: popup-animation 5s forwards;
    background-color: var(--component-color);
    padding: 0.4em 0.6em;
    border: 1px solid rgb(50, 255, 50);
    border-radius: var(--border-radius);
    right: 50%;
    transform: translate(50%, 0);
  }

  .error {
    border-color: red;
  }

  @keyframes popup-animation {
    0% {
      opacity: 0;
      bottom: 50px;
      filter: blur(1px);
      transform: translate(50%, 0) scale(70%);
    }
    15% {
      bottom: 40px;
      opacity: 1;
      filter: blur(0);
      transform: translate(50%, 0) scale(100%);
    }
    85% {
      bottom: 15px;
      opacity: 1;
      filter: blur(0);
      transform: translate(50%, 0) scale(100%);
    }
    100% {
      bottom: 5px;
      opacity: 0;
      filter: blur(1px);
      transform: translate(50%, 0) scale(70%);
    }
  }

  .drop-area {
    display: flex;
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(0, 120, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1;
    opacity: 1;
    transition:
      background-color 0.4s,
      backdrop-filter 0.4s,
      opacity 0.4s;
  }

  .drop-area > div {
    border: 4px dashed white;
    border-radius: 15px;
    font-size: 3em;
    flex-grow: 1;
    margin: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .hidden {
    visibility: hidden;
    background-color: none;
    backdrop-filter: none;
    opacity: 0;
  }

  .split-vertical {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }

  .split-horizontal {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 600px) {
    .side {
      max-height: 60%;
    }

    .dragBar {
      height: 10px;
      min-height: 10px;
      width: auto;
      border-top: 1px solid #646cff;
      border-bottom: 1px solid #646cff;
    }

    .split-vertical {
      flex-direction: column;
      flex-basis: auto !important;
    }
  }

  @media (min-width: 600px) {
    .split-horizontal {
      overflow: hidden;
    }

    .dragBar {
      height: 100%;
      width: var(--dragbar-width);
      min-width: var(--dragbar-width);

      border-left: 1px solid;
      border-right: 1px solid;
      cursor: col-resize;
    }

    .dragBar:hover {
      background-color: rgb(40, 40, 40);
      box-shadow: 0 0 20px black;
      border-color: #646cff;
    }

    .left {
      flex-basis: calc(50% - var(--dragbar-width) / 2);
    }
  }

  .side {
    background-color: color-mix(
      in srgb,
      var(--background-color) 40%,
      rgb(223, 228, 255)
    );
    min-width: auto;
  }

  main {
    width: 100%;
    height: 100%;
  }

  .dragBar {
    background-color: var(--component-color);
    transition:
      background-color 0.25s,
      border-color 0.25s;
    border-color: var(--borderColor);
  }

  .right {
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
