/**
 * Copyright 2025 Alexander Manbeck
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

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.title = "";
    this.description = "";
    this.image = "";
    this.url = "";


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
      title: { type: String },
      description: { type: String },
      image: { type: String },
      url: { type: String }
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
      .card {
        border: 1px solid var(--ddd-theme-primary);
        padding: 16px;
        border-radius: 8px;
      }
      .card h2 {
        margin: 0;
        font-size: 1.2em;
        color: var(--ddd-theme-primary);
      }
      .card a {
        color: var(--ddd-theme-primary);
        text-decoration: none;
      }
      .card p {
        margin: 8px 0;
      }
      .card img {
        max-width: 100%;
        height: auto;
        margin-top: 8px;
      }
      .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--ddd-theme-primary);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 2s linear infinite;
      }
      @keyframes spin {
        0% {transform: rotate(0deg); }
        100% {transform: rotate(360deg); }
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
      <div class="card">
        <h2>${this.title}</h2>
        <a href="${this.url}">${this.url}</a>
        <p>${this.description}</p>
        ${this.image ? html`<img src="${this.image}" alt="Preview Image">` : ''}
      </div>
    </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'href') {
      this.fetchMetadata(newValue);
    }
  }

  async fetchMetadata(url) {
    this.shadowRoot.innerHTML = 'div class="loader"></div>';
    try {
      const response = await fetch('https://open-apis.hax.cloud/api/services/website/metadata?q=${url}');
      const data = await response.json();
      this.title = data.data.title || '';
      this.description = data.data.description || '';
      this.image = data.data.og.image || '';
      this.url = data.data.og.url || url;
      this.requestUpdate;
    } catch (error) {
      this.shadowRoot.innerHTML = 'No preview';
    }
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