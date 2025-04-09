import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("chat-button")
export class ChatButton extends LitElement {
  // チャットのユーザー名
  @property({ type: String })
  user = "匿名";
  // チャットの更新日
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
        width: 50px;
        height: auto;
        margin-right: 10px;
        border-radius: 50%;
        box-shadow: 2px 2px 5px var(--middle-color);
      }

      .disc {
        width: 100%;
        height: auto;
        text-align: left;
      }

      .user,
      .date {
        color: var(--shadow-color);
        font-size: var(--small-font);
      }
    `,
  ];

  render() {
    return html`
      <button>
        <img src="/imgs/avatar.png" alt="チャット" loading="lazy" />
        <span class="disc">
          <div class="user">${this.user}</div>
          <div class="content"><slot /></div>
          <div class="date">${this.date}</div>
        </span>
      </button>
    `;
  }
}
