import { css } from "lit";

export const centerStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto;
    padding: var(--smaller-padding);
  }

  .header button.hidden {
    visibility: hidden;
  }

  .head {
    display: flex;
    width: 100%;
    height: auto;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
  }
  .head::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  .head .tab_changer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 200px;
    height: auto;
    padding: 3px var(--smaller-padding);
    background: var(--middle-color);
  }
  .head .tab_changer.selected {
    background: var(--base-color);
  }

  .head .tab_changer .icon:hover {
    font-variation-settings:
      "FILL" 1,
      "wght" 400,
      "GRAD" 1,
      "opsz" 24;
  }
  .head .tab_changer .name {
    flex: 1;
    width: 100%;
    font-size: var(--base-font);
  }

  .body {
    flex: 1;
    width: 100%;
    height: 100%;
  }
`;
