// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Table
* @type {CustomElementConstructor}
*/
export default class Table extends Shadow() {
  /**
   * @param {any} args
   */
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    try {
      this.data = JSON.parse(this.template.content.textContent)
    } catch (error) {
      console.warn('broken JSON supplied!', { component: this, error, templateTextContent: this.template.content.textContent })
    }
  }

  connectedCallback() {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
  }

  disconnectedCallback() { }

  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML() {
    return !this.section
  }

  renderCSS() {
    this.css = /* CSS */ `
      :host {
        --table-margin: 0;
        --table-margin-mobile: 0;
      }
      :host section {
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
      }

      :host section > table {
        border${this.hasAttribute('line-left')
          ? '-left'
          : '-top'
        }: 0.375rem solid #62194e;
        width: calc(50% - 1em);
      }

      :host .text1 {
        color: #62194e;
        margin-top: 0.3125rem;
      }

      :host .text2 {
        color: #62194e;
        margin-top: -0.625rem;
      }

      :host .text3 {
        color: #62194e;
        margin-top: -0.625rem;
      }

      @media only screen and (max-width: _max-width_) {
        :host section {
          flex-direction: column;
        }
        :host section > table {
          width: 100%;
        }
      }
    `
    // wenn das attribut "line-left" den wert "left" hat, dann soll dieses css angehängt werden

    if (this.hasAttribute('line-left')) {
      this.css = /* CSS */ `

      :host .text1 {
        margin-left: 0.625rem;
      }

      :host .text2 {
        margin-left: 0.625rem;
      }

      :host .text3 {
        margin-left: 0.625rem;
      }
    `
    }


    return this.fetchTemplate()
  }

  fetchTemplate() {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      default:
        return this.fetchCSS(styles)
    }
  }

  renderHTML() {
    this.html = /* HTML */ `
      <section>
        ${this.data.map(item => /* HTML */ `
          <table>
              <tr>
                <td>
                  <p class="font-size-tiny text1">${item.label}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h3 class="text2">${item.title}</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <h5 class="text3">${item.description}</h5>
                </td>
              </tr>
          </table>
        `).join('')}
      </section>
    `
  }

  get section() {
    return this.root.querySelector('section')
  }

  get template() {
    return this.root.querySelector('template')
  }
}
