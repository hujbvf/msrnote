import { css } from "lit";

export const appStyles = css`
  :host {
    display: flex;
    width: 100%;
    height: 100%;
  }

  left-screen,
  right-screen {
    width: 100%;
    max-width: 0;
    height: 100%;
  }

  left-screen[left_active],
  right-screen[right_active] {
    max-width: 300px;
  }

  left-screen {
    border-right: 1.5px solid var(--middle-color);
  }

  right-screen {
    border-left: 1.5px solid var(--middle-color);
  }

  center-screen {
    flex: 1;
    width: 100%;
    height: 100%;
  }
`;
