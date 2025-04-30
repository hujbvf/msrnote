import { css } from "lit";

export const tabStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 680px;
    height: 100%;
    margin: 0 auto;
  }

  h2,
  h2 span {
    color: var(--shadow-color);
    margin-bottom: 10px;
  }
  h2:not(:first-child) {
    margin-top: 20px;
  }

  .title_area,
  .toc_area,
  .search_area,
  .content_area {
    display: block;
    padding: 0 var(--smaller-padding);
  }

  .title_area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto;
    margin: var(--smaller-padding) 0;
  }

  .content_area {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 0 var(--smaller-padding);
    margin: var(--smaller-padding) 0;
    overflow-y: auto;
  }
`;
