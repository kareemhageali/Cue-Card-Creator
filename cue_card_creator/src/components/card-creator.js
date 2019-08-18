import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/paper-button/paper-button.js';

import { store } from '../store.js';


class CardCreator extends connect(store)(LitElement) {
  static get properties() {
    return {
    };
  }

  static get styles() {
    return [
      css`
        .card-creation-content {
            display: flex;
            flex-direction: column;
            width: 80%;
            margin: auto;
        }

        .card-creation-content > iron-autogrow-textarea {
            width: 100%;
        }

        paper-button {
            background-color: var(--paper-button-primary-color);
            color: var(--paper-button-text-color);
            width: 50px;
            margin-top: 5px;
            margin-left: 0;
            padding-left: 0;
            padding-right: 0;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="card-creation-content">
          <iron-autogrow-textarea id="questionInput" rows="4" placeholder="Input your question"></iron-autogrow-textarea>
          <iron-autogrow-textarea id="answerInput" rows="2" placeholder="What is the answer?"></iron-autogrow-textarea>
          <div>
              <paper-button @click="${this._createCard}">Create</paper-button>
              <paper-button @click="${this._finishCreation}">Finish</paper-button>
          </div>
      </div>
    `;
  }

  constructor() {
    super();
  }

  _createCard() {
    const requestBody = {question: this.shadowRoot.querySelector('#questionInput').value,
                          answer: this.shadowRoot.querySelector('#answerInput').value,
                          visitor: store.getState().app.visitorId};
    fetch('/api/cards/', {method: 'POST',
                          body: JSON.stringify(requestBody),
                          headers: {'Content-Type': 'application/json'}});
    return;
  }

  _finishCreation() {
    return;
  }
}

window.customElements.define('card-creator', CardCreator);
