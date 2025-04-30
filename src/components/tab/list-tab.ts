import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { v4 as uuidv4 } from "uuid";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/search-input.ts";
import "../part/note-add-button.ts";
import { NoteButton } from "../part/note-button.ts";
import { NoteGroupButton } from "../part/note-group-button.ts";

@customElement("list-tab")
export class ListTab extends LitElement {
  // 現在のディレクトリパス
  @state()
  private _path: string = "";
  // 現在のディレクトリ名
  @state()
  private _dir_name: string = "一覧";
  private _dirNameList: string[] = [];
  // ノートのリスト
  @state()
  private _noteLocalList: any[] = [];
  private _noteLocalResult: any[] = [];
  @state()
  private _noteCloudList: any[] = [];
  private _noteCloudResult: any[] = [];

  // ノート選択用カーソル位置
  private _startX: number | null = null;

  static styles = [globalStyles, tabStyles];

  firstUpdated() {
    // ノートのリストを取得
    this._getNoteList();

    // OPFSの初期化
    this._removeAllNote();
  }

  // すべてのノート・ノートグループを削除
  private _removeAllNote() {
    const worker = new Worker(
      new URL("../worker/reset-opfs.ts", import.meta.url),
      {
        type: "module",
      },
    );

    // ルート内のすべてのファイルとディレクトリを削除
    worker.postMessage("");
  }

  // ノート選択処理(開始)
  private _selectToggleNoteStart(event: PointerEvent) {
    const target = event.target as HTMLElement;

    const noteButton = target.closest("note-button");
    const noteGroupButton = target.closest("note-group-button");
    if (!noteButton && !noteGroupButton) return;

    this._startX = event.clientX;
  }

  // ノート選択処理(終了)
  private _selectToggleNoteEnd(event: PointerEvent) {
    if (!this._startX) return;

    const target = event.target as HTMLElement;

    const noteButton = target.closest("note-button");
    const noteGroupButton = target.closest("note-group-button");
    if (!noteButton && !noteGroupButton) return;

    const endX = event.clientX;

    // スワイプした距離が40px以上の場合は選択状態を変更
    if (Math.abs(endX - this._startX) > 40) {
      if (noteButton) noteButton.toggleAttribute("selected");
      if (noteGroupButton) noteGroupButton.toggleAttribute("selected");
    }

    // スタート位置をリセット
    this._startX = null;
  }

  // ローカルにノートを新規作成
  private _addLocalNote() {
    // パスを指定
    let path = this._path;

    // ノートのパスが""の場合は"local"を指定
    if (path === "") path = "local";

    const worker = new Worker(
      new URL("../worker/add-note.ts", import.meta.url),
      {
        type: "module",
      },
    );

    const noteData = {
      id: `note_${uuidv4()}`,
      name: "ノート",
      path: path,
      date: new Date().toLocaleString(),
    };

    worker.postMessage(noteData);

    worker.onmessage = () => {
      this._noteLocalResult = [
        ...this._noteLocalResult,
        {
          id: noteData.id,
          name: noteData.name,
          date: noteData.date,
        },
      ];
      this._noteLocalList = this._noteLocalResult;
    };
  }

  // ローカルにノートグループを新規作成
  private _addLocalGroup() {
    // パスを指定
    let path = this._path;

    // ノートのパスが""の場合は"local"を指定
    if (path === "") path = "local";

    const worker = new Worker(
      new URL("../worker/add-note-group.ts", import.meta.url),
      {
        type: "module",
      },
    );

    const noteGroupData = {
      id: `note_group_${uuidv4()}`,
      name: "ノートグループ",
      path: path,
    };

    worker.postMessage(noteGroupData);

    worker.onmessage = () => {
      this._noteLocalResult = [
        ...this._noteLocalResult,
        {
          id: noteGroupData.id,
          name: noteGroupData.name,
          num: 0,
        },
      ];
      this._noteLocalList = this._noteLocalResult;
    };
  }

  // クラウドにノートを新規作成
  private _addCloudNote() {
    // パスを指定
    let path = this._path;

    // ノートのパスが""の場合は"cloud"を指定
    if (path === "") path = "cloud";

    const worker = new Worker(
      new URL("../worker/add-note.ts", import.meta.url),
      {
        type: "module",
      },
    );

    const noteData = {
      id: `note_${uuidv4()}`,
      name: "ノート",
      path: path,
      date: new Date().toLocaleString(),
    };

    worker.postMessage(noteData);

    worker.onmessage = () => {
      this._noteCloudResult = [
        ...this._noteCloudResult,
        {
          id: noteData.id,
          name: noteData.name,
          date: noteData.date,
        },
      ];
      this._noteCloudList = this._noteCloudResult;
    };
  }

  // クラウドにノートグループを新規作成
  private _addCloudGroup() {
    // パスを指定
    let path = this._path;

    // ノートのパスが""の場合は"cloud"を指定
    if (path === "") path = "cloud";

    const worker = new Worker(
      new URL("../worker/add-note-group.ts", import.meta.url),
      {
        type: "module",
      },
    );

    const noteGroupData = {
      id: `note_group_${uuidv4()}`,
      name: "ノートグループ",
      path: path,
    };

    worker.postMessage(noteGroupData);

    worker.onmessage = () => {
      this._noteCloudResult = [
        ...this._noteCloudResult,
        {
          id: noteGroupData.id,
          name: noteGroupData.name,
          num: 0,
        },
      ];
      this._noteCloudList = this._noteCloudResult;
    };
  }

  // ノートのリネーム
  private _renameNote(event: CustomEvent) {
    const target = event.target as NoteButton;

    const id = target.id;
    let path: string;
    const name = target.name;

    if (this._path === "") {
      // 親要素が #local_section かどうか確認
      const isLocalCLosest = target.closest("#local_section");

      path = isLocalCLosest ? "local" : "cloud";
    } else if (this._path.startsWith("search")) {
      path = (target as HTMLElement).dataset.path || "";
    } else {
      path = this._path;
    }

    const noteData = {
      noteID: id,
      notePath: path,
      newName: name,
    };

    const worker = new Worker(
      new URL("../worker/rename-note.ts", import.meta.url),
      {
        type: "module",
      },
    );

    worker.postMessage(noteData);
  }

  // ノートグループのリネーム
  private _renameNoteGroup(event: CustomEvent) {
    const target = event.target as NoteGroupButton;

    const id = target.id;
    let path: string;
    const name = target.name;

    if (this._path === "") {
      // 親要素が #local_section かどうか確認
      const isLocalCLosest = target.closest("#local_section");

      path = isLocalCLosest ? "local" : "cloud";
    } else if (this._path.startsWith("search")) {
      path = (target as HTMLElement).dataset.path || "";
    } else {
      path = this._path;
    }

    const noteGroupData = {
      noteID: id,
      notePath: path,
      newName: name,
    };

    const worker = new Worker(
      new URL("../worker/rename-note.ts", import.meta.url),
      {
        type: "module",
      },
    );

    worker.postMessage(noteGroupData);
  }

  // ローカルノート or ノートグループを削除
  private _removeNote() {
    const worker = new Worker(
      new URL("../worker/remove-note.ts", import.meta.url),
      {
        type: "module",
      },
    );

    //  ローカルの note-button & note-group-button を取得
    const localNoteButtons =
      this.shadowRoot?.querySelectorAll(
        "#local_section>note-button, #local_section>note-group-button",
      ) || [];

    if (localNoteButtons.length > 0) {
      // selected が true の要素をフィルタリング
      const localSelectedElements = [...Array.from(localNoteButtons)].filter(
        (element: Element) => (element as any).selected === true,
      );

      // 選択された要素を削除
      localSelectedElements.forEach((element: Element) => {
        element.remove();

        // パスを指定
        let path = this._path;

        // ノートのパスが""の場合は"local"を指定
        if (path === "") path = "local";

        if (this._path.startsWith("search"))
          path = (element as HTMLElement).dataset.path || "";

        const noteData = {
          noteID: element.id,
          notePath: path,
        };

        worker.postMessage(noteData);
      });
    }

    // クラウドの note-button と note-group-button を取得
    const cloudNoteButtons =
      this.shadowRoot?.querySelectorAll(
        "#cloud_section>note-button, #cloud_section>note-group-button",
      ) || [];

    if (cloudNoteButtons.length > 0) {
      // selected が true の要素をフィルタリング
      const cloudSelectedElements = [...Array.from(cloudNoteButtons)].filter(
        (element: Element) => (element as any).selected === true,
      );

      // 選択された要素を削除
      cloudSelectedElements.forEach((element: Element) => {
        element.remove();

        // パスを指定
        let path = this._path;

        // ノートのパスが""の場合は"cloud"を指定
        if (path === "") path = "cloud";

        if (this._path.startsWith("search"))
          path = (element as HTMLElement).dataset.path || "";

        const noteData = {
          noteID: element.id,
          notePath: path,
        };

        worker.postMessage(noteData);

        worker.onmessage = (event) => {
          console.log(event.data);
        };
      });
    }
  }

  // ノート編集操作
  private _editNote(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];

    // 選択された操作を取得
    const selectedAction = selectedOption.value;

    switch (selectedAction) {
      case "delete": // ノート/グループを削除
        this._removeNote();
        break;
      case "select_remove": // ノート/グループ選択解除
        // shadowRoot 内の note-button と note-group-button を取得
        const noteButtons =
          this.shadowRoot?.querySelectorAll("note-button") || [];
        const noteGroupButtons =
          this.shadowRoot?.querySelectorAll("note-group-button") || [];

        // selected が true の要素をフィルタリング
        const selectedElements = [
          ...Array.from(noteButtons),
          ...Array.from(noteGroupButtons),
        ].filter((element: Element) => (element as any).selected === true);

        // 選択された要素を選択解除
        selectedElements.forEach((element: Element) => {
          element.removeAttribute("selected");
        });
        break;
      default:
        break;
    }

    // セレクトボックスをリセット
    target.selectedIndex = 0;
  }

  // ノートを検索
  private _searchNote(event: CustomEvent) {
    const worker = new Worker(
      new URL("../worker/search-note.ts", import.meta.url),
      {
        type: "module",
      },
    );

    const query = event.detail;

    worker.postMessage(query);

    worker.onmessage = (event) => {
      this._path = "search";
      this._dir_name = "検索結果";

      this._noteLocalResult = [];
      this._noteCloudResult = [];

      event.data.local.notes.forEach((note: any) => {
        this._noteLocalResult.push(note);
      });
      event.data.local.groups.forEach((note: any) => {
        this._noteLocalResult.push(note);
      });
      event.data.cloud.notes.forEach((note: any) => {
        this._noteCloudResult.push(note);
      });
      event.data.cloud.groups.forEach((note: any) => {
        this._noteCloudResult.push(note);
      });

      this._noteLocalList = this._noteLocalResult;
      this._noteCloudList = this._noteCloudResult;
    };
  }

  // ノートのパスを移動
  private _moveNotePath(event: CustomEvent) {
    const target = event.target as NoteGroupButton;

    if (this._path === "") {
      // 親要素が #local_section かどうか確認
      const isLocalCLosest = target.closest("#local_section");
      // ストレージ
      const storage = isLocalCLosest ? "local" : "cloud";
      // ノートの ID
      const id = `/${target.id}`;

      // タブのパスを変更
      this._path = `${storage}${id}`;
    } else if (this._path.startsWith("search")) {
      const path = target.dataset.path;
      const id = `/${target.id}`;

      this._path = `${path}${id}`;
    } else {
      // ノートのパス
      const path = this._path;
      // ノートの ID
      const id = `/${target.id}`;

      // タブのパスを変更
      this._path = `${path}${id}`;
    }

    // タブタイトルを変更
    this._dir_name = target.name || "一覧";

    // ノートのリストを取得
    this._getNoteList();
  }

  // ノートのパスを戻す
  private _backNotePath() {
    if (this._path === "search") {
      this._path = "";

      // ノートのリストを取得
      this._getNoteList();

      this._dirNameList = [];
      this._dir_name = "一覧";

      return;
    }

    // パスを1つ戻す
    const path_array = this._path.split("/");
    path_array.pop();
    const path = path_array.join("/");
    this._path = path === "local" || path === "cloud" ? "" : path;

    // ノートのリストを取得
    this._getNoteList();

    this._dirNameList = [];
    this._dir_name = "一覧";

    if (this._path !== "") {
      const dirNameWorker = new Worker(
        new URL("../worker/fetch-group-name.ts", import.meta.url),
        {
          type: "module",
        },
      );

      dirNameWorker.postMessage(this._path);

      dirNameWorker.onmessage = (event) => {
        event.data.map((note: any) => {
          this._dirNameList.push(note.name);
        });

        // タブタイトルを変更
        this._dir_name = this._dirNameList.at(-1) || "一覧";
      };
    }
  }

  // ノートのリストを取得
  private _getNoteList() {
    this._noteLocalResult = [];
    this._noteCloudResult = [];

    // ディレクトリツリーを取得
    const worker = new Worker(
      new URL("../worker/fetch-note-list.ts", import.meta.url),
      {
        type: "module",
      },
    );

    if (this._path === "") {
      // トップ
      worker.postMessage("local");
      worker.postMessage("cloud");
    } else {
      // ローカル or クラウド
      worker.postMessage(this._path);
    }

    // メッセージを受信してデータを結合
    worker.onmessage = (event) => {
      if (event.data.length === 0) {
        this._noteLocalList = this._noteLocalResult;
        this._noteCloudList = this._noteCloudResult;

        return;
      }

      event.data.forEach((note: any) => {
        if (note.path.startsWith("local")) {
          this._noteLocalResult = [
            ...this._noteLocalResult,
            {
              id: note.id,
              name: note.name,
              date: note.date,
              num: note.num,
            },
          ];
        } else if (note.path.startsWith("cloud")) {
          this._noteCloudResult = [
            ...this._noteCloudResult,
            {
              id: note.id,
              name: note.name,
              date: note.date,
              num: note.num,
            },
          ];
        }
      });

      // 状態変数に代入
      this._noteLocalList = [...this._noteLocalResult];
      this._noteCloudList = [...this._noteCloudResult];
    };
  }

  // 内容を描画
  private _renderContent() {
    if (this._path === "") {
      // トップ
      return html`
        <h2>端末内</h2>
        <section id="local_section">
          <note-add-button
            id="add_local_note"
            @add-note=${this._addLocalNote}
            @add-group=${this._addLocalGroup}
          ></note-add-button>
          ${this._noteLocalList.map(
            (note) => html`
              ${!note.id.startsWith("note_group_")
                ? html`<note-button
                    id=${note.id}
                    name=${note.name}
                    date=${note.date}
                    @rename-note=${this._renameNote}
                  ></note-button>`
                : html`<note-group-button
                    id=${note.id}
                    name=${note.name}
                    num=${note.num}
                    @open-note=${this._moveNotePath}
                    @rename-note-group=${this._renameNoteGroup}
                  ></note-group-button>`}
            `,
          )}
        </section>
        <h2>クラウド</h2>
        <section id="cloud_section">
          <note-add-button
            id="add_cloud_note"
            @add-note=${this._addCloudNote}
            @add-group=${this._addCloudGroup}
          ></note-add-button>
          ${this._noteCloudList.map(
            (note) => html`
              ${!note.id.startsWith("note_group_")
                ? html`<note-button
                    id=${note.id}
                    name=${note.name}
                    date=${note.date}
                    @rename-note=${this._renameNote}
                  ></note-button>`
                : html`<note-group-button
                    id=${note.id}
                    name=${note.name}
                    num=${note.num}
                    @open-note=${this._moveNotePath}
                    @rename-note-group=${this._renameNoteGroup}
                  ></note-group-button>`}
            `,
          )}
        </section>
      `;
    } else if (this._path.startsWith("local")) {
      // ローカル
      return html`
        <section id="local_section">
          <note-add-button
            id="add_local_note"
            @add-note=${this._addLocalNote}
            @add-group=${this._addLocalGroup}
          ></note-add-button>
          ${this._noteLocalList.map(
            (note) => html`
              ${!note.id.startsWith("note_group_")
                ? html`<note-button
                    id=${note.id}
                    name=${note.name}
                    date=${note.date}
                    @rename-note=${this._renameNote}
                  ></note-button>`
                : html`<note-group-button
                    id=${note.id}
                    name=${note.name}
                    num=${note.num}
                    @open-note=${this._moveNotePath}
                    @rename-note-group=${this._renameNoteGroup}
                  ></note-group-button>`}
            `,
          )}
        </section>
      `;
    } else if (this._path.startsWith("cloud")) {
      // クラウド
      return html`
        <section id="cloud_section">
          <note-add-button
            id="add_cloud_note"
            @add-note=${this._addCloudNote}
            @add-group=${this._addCloudGroup}
          ></note-add-button>
        </section>
        ${this._noteCloudList.map(
          (note) => html`
            ${!note.id.startsWith("note_group_")
              ? html`<note-button
                  id=${note.id}
                  name=${note.name}
                  date=${note.date}
                  @rename-note=${this._renameNote}
                ></note-button>`
              : html`<note-group-button
                  id=${note.id}
                  name=${note.name}
                  num=${note.num}
                  @open-note=${this._moveNotePath}
                  @rename-note-group=${this._renameNoteGroup}
                ></note-group-button>`}
          `,
        )}
      `;
    } else if (this._path.startsWith("search")) {
      // 検索結果
      return html`
        <section id="local_section">
          ${this._noteLocalList.map(
            (note) => html`
              ${!note.id.startsWith("note_group_")
                ? html`<note-button
                    id=${note.id}
                    name=${note.name}
                    date=${note.date}
                    data-path="${note.path}"
                    @rename-note=${this._renameNote}
                  ></note-button>`
                : html`<note-group-button
                    id=${note.id}
                    name=${note.name}
                    num=${note.num}
                    data-path="${note.path}"
                    @open-note=${this._moveNotePath}
                    @rename-note-group=${this._renameNoteGroup}
                  ></note-group-button>`}
            `,
          )}
        </section>
        <section id="cloud_section">
          ${this._noteCloudList.map(
            (note) => html`
              ${!note.id.startsWith("note_group_")
                ? html`<note-button
                    id=${note.id}
                    name=${note.name}
                    date=${note.date}
                    data-path="${note.path}"
                    @rename-note=${this._renameNote}
                  ></note-button>`
                : html`<note-group-button
                    id=${note.id}
                    name=${note.name}
                    num=${note.num}
                    data-path="${note.path}"
                    @open-note=${this._moveNotePath}
                    @rename-note-group=${this._renameNoteGroup}
                  ></note-group-button>`}
            `,
          )}
        </section>
      `;
    }
  }

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--戻るボタン-->
        ${this._path !== ""
          ? html`<span>
              <label class="icon" @click=${this._backNotePath}
                >chevron_left</label
              >
            </span>`
          : ""}
        <!--タブタイトル-->
        <span class="name">${this._dir_name}</span>
        <!--一覧編集ボタン-->
        <span class="edit">
          <select id="note_edit" class="hidden" @change=${this._editNote}>
            <option>キャンセル</option>
            <option value="delete">削除</option>
            <option value="select_remove">選択解除</option>
          </select>
          <label class="icon" for="note_edit">arrow_drop_down_circle</label>
        </span>
      </div>

      <!--検索-->
      <div class="search_area">
        <search-input
          placeholder="ノートを検索"
          @query-submit=${this._searchNote}
        ></search-input>
      </div>

      <!--内容-->
      <div
        class="content_area"
        @pointerdown=${this._selectToggleNoteStart}
        @pointerup=${this._selectToggleNoteEnd}
      >
        ${this._renderContent()}
      </div>
    `;
  }
}
