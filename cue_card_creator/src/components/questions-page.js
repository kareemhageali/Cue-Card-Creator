import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';

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
          width: 50%;
          margin: 0 auto;
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
          width: 100%;
          margin: 0 auto;
          padding: 15px;
          border-radius: 8px;
        }

        .question-buttons {
          margin-top: 20px;
        }

        .answer-content > div {
          font-size: 18px;
        }

        .answer-content > div:not(:last-of-type) {
          padding-bottom: 5px;
        }

        .answer-content > .card-text {
          font-size: 20px;
        }

        .answer-content > .card-data {
          font-size: 16px;
        }

        .answer-content {
          margin-top: 8px;
          padding-bottom: 18px;
        }

        .answer-content:not(:last-of-type) {
          border-bottom: 3px solid gray;
        }


        .title {
          font-size: 24px;
          font-weight: bold;
        }

        .incorrect-answers {
          box-shadow: 3px 3px 3px 5px red;
        }

        .correct-answers {
          box-shadow: 3px 3px 3px 5px green;
        }

        .page-title {
          font-size: 32px;
        }

        .results-header {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin: auto;
          margin-bottom: 15px;
        }

        #retryButton {
          width: 20%;
        }

        @media only screen and (max-width: 768px) {
          .content-block[active] {
            width: 90%;
          }
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
          <paper-input id="answerInput" label="What is the answer?" required></paper-input>
          <div class="question-buttons">
              <paper-button @click="${(e) => this._submitAnswer(e)}">Submit</paper-button>
          </div>
        </paper-card>
      </div>

      <div class="content-block" ?active="${this._activePage === 'answers'}">
        <div class="results-header">
          <div class="page-title">Your results from collection: ${store.getState().app.currentCollection.name}</div>
          <paper-button id="retryButton" @click="${() => this._initializeQuestions()}">Retry?</paper-button>
        </div>
        ${this._incorrectAnswers.length !== 0 ?
          html`
            <paper-card class="incorrect-answers" elevation="3">
              <div class="title">Incorrect answers:</div>
                ${this._incorrectAnswers.map(card =>
                  html`
                    <div class="answer-content">
                      <div class="card-text">Question ${this._cards.indexOf(card) + 1}:</div>
                      <div class="card-data">${card.question}</div>
                      <div class="card-text"> Correct Answer:</div>
                      <div class="card-data">${card.answer}</div>
                    </div>
                  `
                )}
              </div>
            </paper-card>
          ` : null
        }
        ${this._correctAnswers.length !== 0 ?
          html`
            <paper-card class="correct-answers" elevation="3">
              <div class="title">Correct answers:</div>
              ${this._correctAnswers.map(card =>
                html`
                  <div class="answer-content">
                    <div>Question ${this._cards.indexOf(card) + 1}:</div>
                    <div>${card.question}</div>
                  </div>
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
    this._initializeQuestions();
  }

  stateChanged(state) {
    this._cards = state.app.currentCollection.cards;
    if (!this._currentCard) {
      this._currentCard = this._cards[0]
      this._currentCardIndex = 0;
    }
  }

  _initializeQuestions() {
    this._incorrectAnswers = [];
    this._correctAnswers = [];
    this._cards = store.getState().app.currentCollection.cards;
    this._currentCard = this._cards[0];
    this._currentCardIndex = 0;
    this._activePage = 'questions';
  }

  _submitAnswer() {
    if (!this.shadowRoot.querySelector('#answerInput').validate()) {
      return;
    }

    if (this._currentCard.answer.toLowerCase() === this.shadowRoot.querySelector('#answerInput').value.toLowerCase()) {
      this._correctAnswers.push(this._currentCard);
    } else {
      this._incorrectAnswers.push(this._currentCard);
    }
    this._currentCardIndex = this._currentCardIndex + 1;

    // Finished all questions, we must now show the results of the questions
    if (this._currentCardIndex >= this._cards.length) {
      this._activePage = 'answers';
      return;
    }

    this.shadowRoot.querySelector('#answerInput').value = '';
    this._currentCard = this._cards[this._currentCardIndex];
    return;
  }
}

window.customElements.define('questions-page', QuestionsPage);
