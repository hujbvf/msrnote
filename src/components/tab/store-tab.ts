import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/toc-input.ts";

@customElement("store-tab")
export class StoreTab extends LitElement {
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
        text-decoration: none;
      }
      .buy_button:hover {
        background: var(--middle-color);
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

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">ストア</span>
      </div>

      <!--目次-->
      <div class="toc_area">
        <toc-input></toc-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <section>
          <h2>フリープラン</h2>
          <p>￥0/月</p>
          <a class="buy_button">フリープラン購入</a>
          <li>ノートローカル保存: 無制限</li>
          <li>ノートクラウド保存: ×</li>
          <li>編集可能ノートの作成: ○</li>
          <li>編集不可ノートの作成: ×</li>
          <li>ノートの公開・限定公開: ×</li>
        </section>
        <section>
          <h2>スタンダードプラン</h2>
          <p>￥350/月</p>
          <a
            class="buy_button"
            href="https://buy.stripe.com/test_9AQaIzgAi7MW7yocMN"
            target="_blank"
            rel="noopener noreferrer"
            >スタンダードプラン購入</a
          >
          <li>ノートローカル保存: 無制限</li>
          <li>ノートクラウド保存: 15GB</li>
          <li>編集可能ノートの作成: ○</li>
          <li>編集不可ノートの作成: ○</li>
          <li>ノートの公開・限定公開: ○</li>
        </section>
        <section>
          <h2>プロプラン</h2>
          <p>￥950/月</p>
          <a
            class="buy_button"
            href="https://buy.stripe.com/test_eVa4kb1Fo6IS3i83ce"
            target="_blank"
            rel="noopener noreferrer"
            >プロプラン購入</a
          >
          <li>ノートローカル保存: 無制限</li>
          <li>ノートクラウド保存: 50GB</li>
          <li>編集可能ノートの作成: ○</li>
          <li>編集不可ノートの作成: ○</li>
          <li>ノートの公開・限定公開: ○</li>
        </section>

        <a
          href="billing.stripe.com/p/login/test_8wM9DM5wIg5Y2hGdQQ"
          target="_blank"
          rel="noopener noreferrer"
          >カスタマーポータル</a
        >
      </div>

      <!--決済に関する設定-->
      <div class="payment_area">
        <!--支払い設定-->
        <button>
          <span class="icon">account_balance_wallet</span>
          <span class="name">財布</span>
        </button>
        <!--購入商品設定-->
        <button>
          <span class="icon">shopping_cart</span>
          <span class="name">カート</span>
        </button>
      </div>
    `;
  }
}
