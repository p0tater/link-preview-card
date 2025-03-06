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
    console.log(this.value);
    this.getData(this.value);
  }

  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${this.link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json.data);
      document.querySelector('#here').innerHTML = JSON.stringify(json.data, null, 2);
      document.querySelector('#there').innerHTML = json.data["og:site_name"];
    } catch (error) {
      console.error(error.message);
    }
  }
  


  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.link = "www.psu.edu";
    this.title = "";
    this.t = this.t || {};
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
    `];
  }

  // Lit render the HTML <h3><span>${this.t.title}:</span> ${this.title}</h3>
  render() {
    return html`
<div class="wrapper">
  <div>
    <input id="input" type="text" value="${this.link}" @input="${this.inputChanged}">
  </div>
  <div>
    
  </div>
  <slot></slot>
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