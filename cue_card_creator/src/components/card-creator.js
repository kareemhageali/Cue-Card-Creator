import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-toast/paper-toast.js';

import { store } from '../store.js';
import { getCookie } from '../../helpers.js';
import { retrieveCards, navigate } from '../actions/app.js'


class CardCreator extends connect(store)(LitElement) {
  static get properties() {
    return {
      _cards: { type: Array },
      _currentCollection: { type: Object },
    };
  }

  static get styles() {
    return [
      css`
        .page-header {
          display: flex;
          flex-direction: column;
          width: 50%;
          margin: 0 auto 20px;
        }

        #collectionTitle {
          font-size: 32px;
        }

        paper-card {
          display: flex;
          flex-direction: column;
          width: 50%;
          margin: 0 auto;
          padding: 15px;
          border-radius: 8px;
        }

        paper-card:not(:first-of-type) {
          margin-top: 50px;
        }

        paper-card:last-of-type {
          margin-bottom: 50px;
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

        @media only screen and (max-width: 768px) {
          paper-card, .page-header {
            width: 90%;
          }
        }
      `
    ];
  }

  render() {
    return html`
      <div class="page-header">
        <div id="collectionTitle">${this._currentCollection.name}</div>
        <div>${this._cards.length === 1 ? '1 Card' : this._cards.length + ' Cards'}</div>
      </div>
      <paper-card elevation="3">
        <paper-input id="questionInput" label="Input your question" required></paper-input>
        <paper-input id="answerInput" label="What is the answer?" required></paper-input>
        <div>
          <paper-button @click="${() => this._createCard()}">Create</paper-button>
          <paper-button @click="${() => this._finishCreation()}">Finish</paper-button>
        </div>
      </paper-card>

      ${this._cards.map(card =>
          html`
            <paper-card elevation="3">
              <paper-input class="question-input" label="Question" value="${card.question}"></paper-input>
              <paper-input class="answer-input" label="Answer" value="${card.answer}"></paper-input>
              <paper-button @click="${(e) => this._saveCard(e, card.id)}">Save</paper-button>
            </paper-card>
          `
        )}

      <paper-toast id="creationToast">Created Successfully!</paper-toast>
    `;
  }

  constructor() {
    super();
  }

  stateChanged(state) {
    this._cards = state.app.currentCards;
    this._currentCollection = state.app.currentCollection;
  }

  _createCard() {
    if (!(this.shadowRoot.querySelector('#questionInput').validate() &&
            this.shadowRoot.querySelector('#answerInput').validate())) {
      return;
    }

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
        this.shadowRoot.querySelector('#creationToast').open();
        this.shadowRoot.querySelector('#questionInput').value = '';
        this.shadowRoot.querySelector('#answerInput').value = '';
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
      .then(response => {
        return response.json();
      })
      .then(cards => {
        store.dispatch(retrieveCards(cards, store.getState().app.currentCollection));
      });
  }

  _finishCreation() {
    store.dispatch(navigate('/collections'));
  }
}

window.customElements.define('card-creator', CardCreator);
