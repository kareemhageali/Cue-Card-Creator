import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';

import { store } from '../store.js';


class QuestionsPage extends connect(store)(LitElement) {
  static get properties() {
    return {
      _cards: { type: Array },
      _currentCardIndex: { type: Number },
      _currentCard: { type: Object },
      _correctAnswers: { type: Array },
      _incorrectAnswers: { type: Array},
    };
  }

  static get styles() {
    return [
      css`
        .content-block {
          display: none;
        }

        .content-block[active] {
          display: block;
        }

        paper-button {
          background-color: var(--paper-button-primary-color);
          color: var(--paper-button-text-color);
          margin: 0;
        }

        paper-card:not(:first-of-type) {
          margin-top: 50px;
        }

        paper-card:last-of-type {
          margin-bottom: 50px;
        }

        paper-card {
          display: flex;
          flex-direction: column;
          width: 80%;
          margin: 0 auto;
          padding: 15px;
          border-radius: 8px;
        }

        .question-buttons {
          margin-top: 20px;
        }

        .title {
          font-size: 18px;
          font-weight: bold;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="content-block" ?active="${this._activePage === 'questions'}">
        <paper-card elevation="3">
          <div class="title">Question ${this._currentCardIndex + 1}:</div>
          <div>${this._currentCard.question}</div>
          <iron-autogrow-textarea id="answerInput" rows="2" placeholder="What is the answer?"></iron-autogrow-textarea>
          <div class="question-buttons">
              <paper-button @click="${(e) => this._submitAnswer(e)}">Submit</paper-button>
          </div>
        </paper-card>
      </div>

      <div class="content-block" ?active="${this._activePage === 'answers'}">
        ${this._incorrectAnswers.length !== 0 ?
          html`
            <paper-card elevation="3">
              <div class="title">Incorrect answers:</div>
              ${this._incorrectAnswers.map(card =>
                html`
                  <div>Question ${this._cards.indexOf(card) + 1}</div>
                  <div>${card.question}</div>
                  <div>Correct Answer:</div>
                  <div>${card.answer}</div>
                `
              )}
            </paper-card>
          ` : null
        }
      </div>
    `;
  }

  constructor() {
    super();
    this._incorrectAnswers = [];
    this._correctAnswers = [];
    this._activePage = 'questions';
    this._cards = store.getState().app.currentCollection.cards;
    this._currentCard = this._cards[0];
    this._currentCardIndex = 0;
  }

  stateChanged(state) {
    this._cards = state.app.currentCollection.cards;
    if (!this._currentCard) {
      this._currentCard = this._cards[0]
      this._currentCardIndex = 0;
    }
  }

  _submitAnswer() {
    if (this._currentCard.answer.toLowerCase() === this.shadowRoot.querySelector('#answerInput').value.toLowerCase()) {
      this._correctAnswers.push(this._currentCard);
    } else {
      this._incorrectAnswers.push(this._currentCard);
    }
    this._currentCardIndex = this._currentCardIndex + 1;

    // Finished all questions, we must now show the results of the questions
    if (this._currentCardIndex >= this._cards.length) {
      this._activePage = 'answers';
      console.log(this._incorrectAnswers);
      return;
    }
    this._currentCard = this._cards[this._currentCardIndex];
    return;
  }
}

window.customElements.define('questions-page', QuestionsPage);
