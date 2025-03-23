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
    this.title = "";
    this.description = "";
    this.image = "";
    this.link = "";
    this.href = "";
    this.loadingState = false;
    this.themeColor = "";


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
      link: { type: String },
      href: { type: String},
      loadingState: { type: Boolean, reflect: true, attribute: "loading-state"},
      themeColor: { type: String}
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
        border-left: 8px solid transparent;
        padding: 16px;
        border-radius: 8px;
        transition: border-left-color 0.3s ease-in-out;
      }
      :host(:hover) .card {
        border-left-color: var(--theme-color, var(--ddd-theme-primary));
      }
      .card h2 {
        margin: var(--ddd-spacing-0);
        font-size: var(--ddd-font-16);
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
        max-width: 512px;
        max-height: 256px;
      }
      .loader {
        border: 16px solid #f3f3f3;
        border-top: 16px solid #3498db;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 2s linear infinite;
      }
      @keyframes spin {
        0% {transform: rotate(0deg); }
        100% {transform: rotate(360deg); }
      }
      @media (max-width: 600px) {
        :host {
          max-width: 100%;
          padding: var(--ddd-spacing-3);
        }
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
      ${this.loadingState ? html`<div class="loader"></div>` : ""}
      <div class="card" style="--theme-color:${this.themeColor}">
        <a href="${this.link}" target="_blank">${this.link}</a>
        <h2>${this.title || "No preview available"}</h2>
        <p>${this.description}</p>
        ${this.image ? html`<img src="${this.image}" alt="Preview Image">` : ''}
      </div>
    </div>
    `;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(link) {
    this.loadingState = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();

      this.title = data.data["og:title"] || data.data["title"] || "No title available";
      this.description = data.data["og:description"] || data.data["description"] || "No description available";
      this.image = data.data["og:image"] || data.data["image"] || "";
      this.link = data.data["og:url"] || data.data["url"] || link;
      this.themeColor = data.data?.["theme-color"]?.trim() || this.getThemeColor(link);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.loadingState = false;
    }
  }

  getThemeColor(link) {
    try {
      const hostname = new URL(link).hostname;
      if (hostname.endsWith("psu.edu")) {
        return "var(--ddd-primary-2)";
      }
    } catch (error) {
      console.warn("Invalid URL format:", link);
    }

    const randomNum = Math.floor(Math.random() * 26);
    return `var(--ddd-primary-${randomNum})`;
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