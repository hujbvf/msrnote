import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("app-screen")
export class AppScreen extends LitElement {
  render() {
    return html`<p>MsrNote App</p>`;
  }
}
