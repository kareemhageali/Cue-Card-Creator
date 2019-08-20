import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/paper-button/paper-button.js';

import { store } from '../store.js';
import { getCookie } from '../../helpers.js';
import { retrieveCards, navigate } from '../actions/app.js'


class CardCreator extends connect(store)(LitElement) {
  static get properties() {
    return {
      _cards: { type: Array },
    };
  }

  static get styles() {
    return [
      css`
        .card-creation-content {
          display: flex;
          flex-direction: column;
          width: 80%;
          margin: 0 auto;
        }

        .card-creation-content:not(:first-of-type) {
          margin-top: 50px;
        }

        .card-creation-content:last-of-type {
          margin-bottom: 50px;
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

      ${this._cards.map(card =>
          html`
            <div class="card-creation-content">
              <iron-autogrow-textarea class="question-input" rows="4" value="${card.question}"></iron-autogrow-textarea>
              <iron-autogrow-textarea class="answer-input" rows="2" value="${card.answer}"></iron-autogrow-textarea>
              <paper-button @click="${(e) => this._saveCard(e, card.id)}">Save</paper-button>
            </div>
          `
        )}
    `;
  }

  constructor() {
    super();
  }

  stateChanged(state) {
    this._cards = state.app.currentCollection.cards;
  }

  _createCard() {
    const requestBody = {question: this.shadowRoot.querySelector('#questionInput').value,
                         answer: this.shadowRoot.querySelector('#answerInput').value,
                         visitor: store.getState().app.visitorId,
                         collections: [store.getState().app.currentCollection.id]};
    fetch('/api/cards/', {method: 'POST',
                          body: JSON.stringify(requestBody),
                          headers: {'Content-Type': 'application/json',
                                    'X-CSRFToken': getCookie('csrftoken')}})
      .then(response => {
        this._fetchCards();
        return response.json();
      });
  }

  _saveCard(e, cardId) {
    const requestBody = {question: e.srcElement.parentElement.querySelector('.question-input').value,
                         answer: e.srcElement.parentElement.querySelector('.answer-input').value,
                         visitor: store.getState().app.visitorId};
    fetch('/api/cards/' + cardId + '/', {method: 'PATCH',
                                         body: JSON.stringify(requestBody),
                                         headers: {'Content-Type': 'application/json',
                                                   'X-CSRFToken': getCookie('csrftoken')}});
  }

  _fetchCards() {
    fetch('/api/cards/?collection=' + store.getState().app.currentCollection.id)
      .then(function(response){
        return response.json();
      })
      .then(function(cards){
        store.dispatch(retrieveCards(cards, store.getState().app.currentCollection.id));
      });
  }

  _finishCreation() {
    store.dispatch(navigate('/collections'));
  }
}

window.customElements.define('card-creator', CardCreator);
