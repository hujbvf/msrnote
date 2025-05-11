import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/toc-input.ts";

import { planContext, type PlanData } from "../context/plan-context.ts";

@customElement("store-tab")
export class StoreTab extends LitElement {
  // プランの状態
  @consume({ context: planContext, subscribe: true })
  planData?: PlanData;

  static styles = [
    globalStyles,
    tabStyles,
    css`
      section {
        display: block;
        margin-bottom: var(--base-padding);
      }

      li {
        list-style-type: none;
      }
      li::before {
        content: "-";
        padding: 0 var(--base-padding);
      }

      .buy_button {
        display: block;
        width: 100%;
        height: auto;
        padding: 8px;
        margin: 5px 0;
        text-align: center;
        border: solid 2px var(--middle-color);
        border-radius: 5px;
      }
      .buy_button:hover {
        background: var(--middle-color);
      }
      .buy_button:disabled {
        background: var(--shadow-color);
        color: var(--light-color);
        border: solid 2px var(--shadow-color);
      }

      .payment_area {
        display: flex;
        width: 100%;
        height: auto;
        border-top: 2px solid var(--middle-color);
      }
      .payment_area button {
        width: 100%;
        height: auto;
        padding: 5px 0;
      }
      .payment_area button:not(:last-child) {
        border-right: 2px solid var(--middle-color);
      }
      .payment_area button .name {
        vertical-align: middle;
      }
    `,
  ];

  // チェックアウトセッションを作成
  private async _createCheckoutSession(event: Event) {
    const target = event.target as HTMLButtonElement;
    const priceId = target.id;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: priceId }),
    });

    const result = await response.json();

    // 送信完了
    const url = result.url;
    // リダイレクト
    if (url) window.location.href = url;

    // プランの状態を更新
    const plan = result.plan;
    if (plan)
      this.dispatchEvent(
        new CustomEvent("plan_change", {
          bubbles: true,
          composed: true,
          detail: { plan: plan },
        }),
      );
  }

  // カスタマーポータルを開く
  private async _createPortalSession() {
    const response = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    // 送信完了
    const url = result.url;
    // リダイレクト
    if (url) window.location.href = url;
  }

  private _moveToToc(event: CustomEvent) {
    const id = event.detail;

    // idの要素を取得
    let element;
    if (id === "top") {
      element = this.shadowRoot?.querySelector(".content_area")
        ?.firstElementChild as HTMLElement;
      console.log(element.outerHTML);
    } else {
      element = this.shadowRoot?.getElementById(id) as HTMLElement;
    }

    if (element) {
      // スクロール
      element.scrollIntoView({
        behavior: "smooth", // スムーズにスクロール
        block: "start", // 上部に合わせる
        inline: "nearest", // 左右は無視
      });
    }
  }

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">ストア</span>
      </div>

      <!--目次-->
      <div class="toc_area">
        <toc-input
          @toc-select=${this._moveToToc}
          .items=${[
            { name: "フリープラン", value: "free" },
            { name: "スタンダードプラン", value: "standard" },
            { name: "プロプラン", value: "pro" },
          ]}
        ></toc-input>
      </div>

      <!--内容-->
      <div class="content_area" id="top">
        <section id="free">
          <h2>フリープラン</h2>
          <p>￥0 / 月</p>
          ${this.planData === "free"
            ? html`<button class="buy_button" disabled>現在のプラン</button>`
            : html`
                <button
                  class="buy_button"
                  id="price_1RLIin03X1TtY8CFon4AaIwB"
                  @click=${this._createCheckoutSession}
                >
                  フリープラン購入
                </button>
              `}
          <li>ノートローカル保存: 無制限</li>
          <li>ノートクラウド保存: ×</li>
          <li>編集可能ノートの作成: ○</li>
          <li>編集不可ノートの作成: ×</li>
          <li>ノートの公開・限定公開: ×</li>
        </section>
        <section id="standard">
          <h2>スタンダードプラン</h2>
          <p>￥350 / 月</p>
          ${this.planData === "standard"
            ? html`<button class="buy_button" disabled>現在のプラン</button>`
            : html`
                <button
                  class="buy_button"
                  id="price_1RLIin03X1TtY8CFgCHgZI3j"
                  @click=${this._createCheckoutSession}
                >
                  スタンダードプラン購入
                </button>
              `}
          <li>ノートローカル保存: 無制限</li>
          <li>ノートクラウド保存: 15GB</li>
          <li>編集可能ノートの作成: ○</li>
          <li>編集不可ノートの作成: ○</li>
          <li>ノートの公開・限定公開: ○</li>
        </section>
        <section>
          <h2 id="pro">プロプラン</h2>
          <p>￥950 / 月</p>
          ${this.planData === "pro"
            ? html`<button class="buy_button" disabled>現在のプラン</button>`
            : html`
                <button
                  class="buy_button"
                  id="price_1RLIin03X1TtY8CFNT7halsD"
                  @click=${this._createCheckoutSession}
                >
                  プロプラン購入
                </button>
              `}
          <li>ノートローカル保存: 無制限</li>
          <li>ノートクラウド保存: 50GB</li>
          <li>編集可能ノートの作成: ○</li>
          <li>編集不可ノートの作成: ○</li>
          <li>ノートの公開・限定公開: ○</li>
        </section>
      </div>

      <!--決済に関する設定-->
      <div class="payment_area">
        <!--支払い設定-->
        <button @click=${this._createPortalSession}>
          <span class="icon">account_balance_wallet</span>
          <span class="name">財布</span>
        </button>
      </div>
    `;
  }
}
