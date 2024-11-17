<script>
  import TitleBar from "./views/TitleBar.svelte";
  import Tables from "./views/Tables.svelte";
  import Console from "./views/Console.svelte";

  let left;
  let dragBar;
  let isMouseDown = false;
  const dragbarDown = (e) => {
    isMouseDown = true;
    document.body.addEventListener("pointermove", dragMove);
    document.body.addEventListener("pointerup", dragEnd);
    e.preventDefault();
  };
  function dragMove(event) {
    if (isMouseDown) {
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
    <div class="split-vertical">
      <div
        bind:this={left}
        style="flex-basis: 50%;"
        class="padding side inner-shadow"
      >
        <Tables />
      </div>
      <div
        bind:this={dragBar}
        class="dragBar"
        on:pointerdown={(event) => dragbarDown(event)}
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

  .dragBar {
    border-left: 1px solid #646cff;
    border-right: 1px solid #646cff;
    height: 100%;
    width: 10px;
    min-width: 6px;
    cursor: col-resize;
    background-color: rgba(160, 160, 200, 0.08);
    transition: background-color 0.25s;
  }

  .dragBar:hover {
    background-color: rgb(50, 60, 160);
  }

  .side {
    min-width: 150px;
  }

  .right {
    flex-grow: 1;
  }
</style>
