import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("search-input")
export class SearchInput extends LitElement {
  @property({ type: String })
  placeholder = "";

  static styles = [
    globalStyles,
    css`
      :host {
        padding: 0 var(--smaller-padding);
      }

      .search {
        display: flex;
        align-items: center;
        width: 100%;
        height: auto;
        padding: 0;
        background: var(--middle-color);
        border-radius: 5px;
      }

      input {
        width: 100%;
        height: auto;
        margin: 0 5px;
      }

      button {
        padding-left: 5px;
        margin: 0 5px;
        border-left: solid 2px var(--base-color);
      }
    `,
  ];

  render() {
    return html`
      <div class="search">
        <input type="text" placeholder=${this.placeholder} />
        <button>
          <span class="icon">search</span>
        </button>
      </div>
    `;
  }
}
