import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("toc-input")
export class TocInput extends LitElement {
  static styles = [
    globalStyles,
    css`
      .toc {
        display: flex;
        align-items: center;
        width: 100%;
        height: auto;
        background: var(--middle-color);
        border-radius: 5px;
      }

      select {
        width: 100%;
        height: auto;
        margin: 0 5px;
      }

      label {
        padding-left: 5px;
        margin: 0 5px;
        border-left: solid 2px var(--base-color);
      }
    `,
  ];

  render() {
    return html`
      <div class="toc">
        <select id="toc" id="toc">
          <option selected>目次</option>
          <option value="top">トップ</option>
        </select>
        <label for="toc" class="icon">toc</label>
      </div>
    `;
  }
}
