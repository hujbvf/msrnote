import { css } from "lit";

export const sideStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .header,
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto;
    padding: var(--smaller-padding);
  }

  .body {
    flex: 1;
    width: 100%;
    height: 100%;
  }

  .footer button:hover .icon,
  .footer button.selected .icon {
    font-variation-settings:
      "FILL" 1,
      "wght" 400,
      "GRAD" 1,
      "opsz" 24;
  }
  .footer button .name {
    font-size: var(--small-font);
  }
`;
