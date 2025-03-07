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
    this.loading = true;
    this.value = this.shadowRoot.querySelector('#input').value;
    this.link = this.value;
    this.getData(this.value);
  }

  async getData(link) {
    this.loading = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=https://${this.link}`;
    try {
      
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
        thereElement.innerHTML = json.data["description"];
        console.log(this.loading);
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
      loading: { type: Boolean, reflect:true },
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
        height: 1.5em;
        width: 20em;
        color:black;
        font-size: 1em;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      #here{
        height: 6em;
      }
      .loader {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      #banner {
        display: flex;
        flex-direction: column;
        color: white;
        background-color: var(--ddd-theme-default-white );
        width:21.6em;
      }
      

    `];
  }

  // Lit render the HTML <h3><span>${this.t.title}:</span> ${this.title}</h3>
  render() {
    return html`
<div class="wrapper">
  <div>
    <input id="input" type="text" value="${this.link}" @input="${this.inputChanged}">
  
  <div class="loader" ?hidden="${!this.loading}"></div>
  <div id="banner">
      <pre id="there">
      </pre>
      <pre id="here">
      </pre>
  </div>
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