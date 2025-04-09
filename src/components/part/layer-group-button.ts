import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("layer-group-button")
export class LayerGroupButton extends LitElement {
  // レイヤーの名前
  @property({ type: String })
  name = "";
  // レイヤーの数
  @property({ type: String })
  num = "";

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

      .num {
        color: var(--shadow-color);
        font-size: var(--small-font);
      }
    `,
  ];

  render() {
    return html`
      <button>
        <img
          src="/imgs/layer-group.png"
          alt="レイヤーグループ"
          loading="lazy"
        />
        <span class="disc">
          <div class="name">${this.name}</div>
          <div class="num">${this.num}項目</div>
        </span>
      </button>
    `;
  }
}
