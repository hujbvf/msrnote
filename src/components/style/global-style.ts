import { css } from "lit";

export const globalStyles = css`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    color: var(--dark-color);
    font-size: var(--base-font);
    font-weight: 400;
    overflow: hidden;
  }

  button,
  input,
  textarea,
  select {
    border: none;
    background: none;
    outline: none;
  }

  iframe {
    border: none;
  }

  [contenteditable="true"] {
    outline: none;
  }

  .icon {
    font-family: "Material Symbols Outlined";
    font-size: var(--big-font);
    font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
    vertical-align: middle;
  }
`;
