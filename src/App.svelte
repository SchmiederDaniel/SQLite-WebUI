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
      const offsetX = dragBar.clientWidth / 2 + 8 * 2; // 8px is padding on both sides of the site
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

<main style="height: 100%;">
  <div class="split-horizontal">
    <TitleBar />
    <div class="split-vertical" bind:clientWidth={width}>
      <div bind:this={left} class="left padding side inner-shadow">
        <Tables />
      </div>
      <div
        bind:this={dragBar}
        class="dragBar"
        onpointerdown={(event) => dragbarDown(event)}
      ></div>
      <div class="padding side right inner-shadow">
        <Console />
      </div>
    </div>
  </div>
</main>

<style>
  .split-horizontal {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .split-vertical {
    display: flex;
    flex-grow: 1;
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
    .dragBar {
      height: 100%;
      width: 10px;
      min-width: 10px;

      border-left: 1px solid #646cff;
      border-right: 1px solid #646cff;
      cursor: col-resize;
    }

    .dragBar:hover {
      background-color: rgb(50, 60, 160);
    }
  }

  .side {
    min-width: auto;
  }

  .left {
    flex-basis: 50%;
  }

  .dragBar {
    background-color: rgba(160, 160, 200, 0.08);
    transition: background-color 0.25s;
  }

  .right {
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
