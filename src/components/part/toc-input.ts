import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

interface TocInputProps {
  name: string;
  value: string;
}

@customElement("toc-input")
export class TocInput extends LitElement {
  @property({ type: Array })
  items: TocInputProps[] = [];

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
        width: auto;
        height: auto;
        padding: 0 5px;
        border-left: solid 2px var(--base-color);
      }
    `,
  ];

  private _moveToSection(e: Event) {
    const target = e.target as HTMLSelectElement;
    const value = target.value;

    this.dispatchEvent(
      new CustomEvent("toc-select", {
        bubbles: true,
        composed: true,
        detail: value,
      }),
    );
  }

  render() {
    return html`
      <div class="toc">
        <select id="toc" id="toc" @change="${this._moveToSection}">
          <option selected>目次</option>
          <option value="top">トップ</option>
          ${this.items.map(
            (item) => html`<option value="${item.value}">${item.name}</option>`,
          )}
        </select>
        <label for="toc" class="icon">toc</label>
      </div>
    `;
  }
}
