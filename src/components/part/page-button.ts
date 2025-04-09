import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("page-button")
export class PageButton extends LitElement {
  // ページの名前
  @property({ type: String })
  name = "";
  // ページの更新日
  @property({ type: String })
  date = "";

  static styles = [
    globalStyles,
    css`
      button {
        display: flex;
        align-items: center;
        width: 100%;
        height: auto;
        padding: 5px 0;
        position: relative;
        border-radius: 5px;
      }

      img {
        width: 55px;
        height: auto;
      }

      .disc {
        width: 100%;
        height: auto;
        text-align: left;
      }

      .date {
        color: var(--shadow-color);
        font-size: var(--small-font);
      }
    `,
  ];

  render() {
    return html`
      <button>
        <img src="/imgs/page.png" alt="ページ" loading="lazy" />
        <span class="disc">
          <div class="name">${this.name}</div>
          <div class="date">${this.date}</div>
        </span>
      </button>
    `;
  }
}
