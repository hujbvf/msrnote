import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit/task";

@customElement("tab-changer")
export class TabChanger extends LitElement {
  // 現在のタブ
  @property({ type: String })
  current_tab = "";

  // タブを変更する
  private _changeTab = new Task(this, {
    task: async ([current_tab]) => {
      let tab: TemplateResult;
      switch (current_tab) {
        case "list": // 一覧タブ
          await import("../tab/list-tab.ts");
          tab = html`<list-tab></list-tab>`;
          break;
        case "set": // 設定タブ
          await import("../tab/set-tab.ts");
          tab = html`<set-tab></set-tab>`;
          break;
        case "doc": // 読み物タブ
          await import("../tab/doc-tab.ts");
          tab = html`<doc-tab></doc-tab>`;
          break;
        case "store": // ストアタブ
          await import("../tab/store-tab.ts");
          tab = html`<store-tab></store-tab>`;
          break;
        case "layer": // レイヤータブ
          await import("../tab/layer-tab.ts");
          tab = html`<layer-tab></layer-tab>`;
          break;
        case "page": // ページタブ
          await import("../tab/page-tab.ts");
          tab = html`<page-tab></page-tab>`;
          break;
        case "tool": // ツールタブ
          await import("../tab/tool-tab.ts");
          tab = html`<tool-tab></tool-tab>`;
          break;
        case "forum": // フォーラムタブ
          await import("../tab/forum-tab.ts");
          tab = html`<forum-tab></forum-tab>`;
          break;
        case "canvas": // キャンバスタブ
          await import("../tab/canvas-tab.ts");
          tab = html`<canvas-tab></canvas-tab>`;
          break;
        default:
          tab = html`<p>タブが見つかりません。</p>`;
          break;
      }
      return tab;
    },
    args: () => [this.current_tab],
  });

  render() {
    return this._changeTab.render({
      pending: () => html`<p>タブを読み込み中...</p>`,
      complete: (tab) => html`${tab}`,
      error: () => html`<p>タブを読み込めませんでした。</p>`,
    });
  }
}
