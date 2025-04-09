import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("canvas-tab")
export class CanvasTab extends LitElement {
  static styles = [
    globalStyles,
    css`
      .canvas_area {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
      }

      #canvas {
        width: 200px;
        height: 200px;
        border: 2px solid var(--middle-color);
        background: var(--light-color);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
      }
    `,
  ];

  render() {
    return html`
      <div class="canvas_area">
        <div id="canvas"></div>
      </div>
    `;
  }
}
