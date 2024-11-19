<script>
  import TitleBar from "./views/TitleBar.svelte";
  import Tables from "./views/Tables.svelte";
  import Console from "./views/Console.svelte";

  let left;
  let dragBar;
  let isMouseDown = false;
  let width = $state();
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
</script>

<main>
  <div class="split-horizontal">
    <TitleBar />
    <div class="split-vertical" bind:clientWidth={width}>
      <div bind:this={left} class="left side inner-shadow">
        <Tables />
      </div>
      <div
        bind:this={dragBar}
        class="dragBar"
        on:pointerdown={(event) => dragbarDown(event)}
      ></div>
      <div class="side right inner-shadow">
        <Console />
      </div>
    </div>
  </div>
</main>

<style>
  .split-vertical {
    display: flex;
    height: 100%;
  }

  @media (max-width: 600px) {
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
      height: 100%;
    }

    .dragBar {
      height: 100%;
      width: 14px;
      min-width: 14px;

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
      flex-basis: 50%;
    }
  }

  .side {
    background-color: color-mix(
      in srgb,
      var(--background-color) 60%,
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
