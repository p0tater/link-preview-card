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

  randomColor() {
    var random = Math.floor(Math.random() * 25) + 1;
    return "var(--ddd-primary-" + random + ")";

  }

  inputChanged(e) {
    this.loading = true;
    console.log(this.loading);
    this.link = this.shadowRoot.querySelector('#input').value;
    this.getData(this.link);
  }
  containsWords(link, words) {
    const textLowerCase = link.toLowerCase();
    const wordsArray = words.toLowerCase().split(' ');
  
    for (const word of wordsArray) {
      if (!textLowerCase.includes(word)) {
        return false;
      }
    }
    return true;
  }
  
   
  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=https://${link}`
    
    try {
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      const hereElement = this.shadowRoot.querySelector('#here');
      const thereElement = this.shadowRoot.querySelector('#there');
      const psuColor = "var(--ddd-primary-2)";   
    
      
      if (hereElement || thereElement) {
        this.image = json.data["og:image"] || json.data["ld+json"].logo;
        this.theme = json.data["theme-color"] || "#ffffff";
        if(this.image == undefined){
          this.image = "https://www.psu.edu/psu-edu-assets/images/shared/psu-mark.svg"; //chooses PSU logo if no image
        }else if(this.image.substring(0, 4) != "http" && this.image.substring(0, 4) != "www."){
          this.image = "https://" + this.link + "/" + this.image;
        }
        if(this.theme == "#ffffff"){
          this.theme = this.randomColor();
        }
        console.log(this.image);
        this.loading = false;
        this.hasOutput = true;
        if(json.data["og:title"] == undefined && json.data["title"] == undefined){
          thereElement.innerHTML = "No title found";
        } else{
        thereElement.innerHTML = json.data["og:title"] || json.data["title"]; 
        }
        if(json.data["description"] === "undefined"|| json.data["description"] == undefined){
          hereElement.innerHTML = "No description found";
        } else{
          hereElement.innerHTML = json.data["description"];
        }
        console.log(this.loading);
        if(this.containsWords(this.link,"psu")) { //checks if link contains "psu"
          this.backgroundColor = psuColor;
          console.log('hello');
        } else{
        this.backgroundColor = this.theme;
        console.log(this.theme);
        }
      } 
    } catch (error) {
      this.shadowRoot.querySelector('#here').innerHTML = "";
      this.shadowRoot.querySelector('#there').innerHTML = "";
      console.error(error.message);
      this.loading = true;
      this.hasOutput = false;
    
      setTimeout(() => {
        this.loading = false;
        console.log("timeout");
      }, 1500);
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
    this.theme = "";
    this.image = "";
    this.backgroundColor = "";
    this.hasOutput = false;
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
      hasOutput: { type: Boolean, reflect:true, attribute: "has-output" },
      backgroundColor: { type: String, reflect:true, attribute: "background-color" },
      image: { type: String, reflect:true },
      theme: { type: String, reflect:true }, 
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`

    @media screen and (max-width: 420px) {
      link-preview-card {
        justify-content: center;
      }
      .wrapper {
        width: 90%;
        margin: 0;
        padding: var(--ddd-spacing-2);
      }
    }
   
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        border-radius: var(--ddd-border-radius);
        border: var(--ddd-border-xs);
        display: inline-block;
      }
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }
      pre{
        height: auto;
        width: 20em;
        color: var(--ddd-theme-default-coalyGray);
        font-family: var(--ddd-font-nav);
        word-wrap: break-word;
        white-space: initial;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
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
        color: var(--ddd-theme-primary);
        width:21.6em;
      }
      #there{
        text-decoration: none;
        margin-left: var(--ddd-spacing-2);
        font-family: var(--ddd-font-secondary);
        font-weight: var(--ddd-font-weight-regular);
        color: var(--ddd-theme-default-coalyGray);

      }

      img{
        max-width: 25%;
        max-height: 25%;
      }
     
      

    `];
    
  }

  // Lit render the HTML <h3><span>${this.t.title}:</span> ${this.title}</h3> 
  render() {
    return html`
<div class="wrapper" style="border-color: ${this.backgroundColor};">
  <div>
    <input id="input" type="text" @input="${this.inputChanged}">
  
  <div class="loader" ?hidden="${!this.loading}" ></div>
  <div id="banner" style="display: ${this.hasOutput ? 'flex' : 'none'}; background-color: ${this.backgroundColor};">
      <a id="there" href="https://${this.link}" target="_blank" rel="noopener noreferrer"> 
      </a>
      <pre id="here" style="background-color: ${this.backgroundColor};">
      </pre>
      <img id="image" src="${this.image}" alt="${this.title} logo">
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