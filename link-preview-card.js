/**
 * Copyright 2025 p0tater
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
    this.link = this.value;
    this.getData(this.value);
  }

  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${this.link}`;
    try {
      this.loading = true;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json.data);
      const hereElement = this.shadowRoot.querySelector('#here');
      const thereElement = this.shadowRoot.querySelector('#there');
      if (hereElement || thereElement) {
        this.loading = false;
        hereElement.innerHTML = JSON.stringify(json.data, null, 2);
        thereElement.innerHTML = json.data["og:title"];
      }
     
    } catch (error) {
      console.error(error.message);
    }
  }

  

  


  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.link = "";
    this.title = "";
    this.t = this.t || {};
    this.loading = false;
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String, reflect:true },
      link: { type: String, reflect:true  },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }
      pre{
        height: 100px;
        width: 95%;
        color:black;
      }
      .loader {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
      }

    `];
  }

  // Lit render the HTML <h3><span>${this.t.title}:</span> ${this.title}</h3>
  render() {
    return html`
<div class="wrapper">
  <div>
    <input id="input" type="text" value="${this.link}" @input="${this.inputChanged}">
  </div>
  <div class="loader" ?hidden="${!this.loading}">
      <pre id="there" >
      </pre>
      <pre id="here" >
      </pre>
  </div>
</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);