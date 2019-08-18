import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';

import { store } from '../store.js';
import { retrieveCollections } from '../actions/app.js';


class CollectionViewer extends connect(store)(LitElement) {
  static get properties() {
    return {
      _collections: {type: Array},
    };
  }

  static get styles() {
    return [
      css`
        paper-button {
          background-color: var(--paper-button-primary-color);
          color: var(--paper-button-text-color);
          margin: 0;
        }

        paper-card:not(:first-of-type) {
          margin-top: 50px;
        }

        .collection-viewer-content {
          display: flex;
          flex-direction: column;
          width: 80%;
          margin: 0 auto;
          padding: 15px;
          border-radius: 8px;
        }

        .card-buttons {
          margin-top: 20px;
        }

        #collectionName {
          font-size: 18px;
          font-weight: bold;
        }
      `
    ];
  }

  render() {
    return html`
      ${this._collections.map(collection =>
        html`
          <paper-card class="collection-viewer-content" elevation="3">
            <div id="collectionName">${collection.name}</div>
            <div>${collection.cards.length === 1 ? '1 card' : collection.cards.length + ' cards'}</div>
            <div class="card-buttons">
                <paper-button @click="${this._openQuestions}">Start Answering</paper-button>
                <paper-button @click="${this._viewCards}">View Cards</paper-button>
            </div>
          </paper-card>
        `
      )}
    `;
  }

  constructor() {
    super();
    this._getCollections();
  }

  stateChanged(state) {
    this._collections = state.app.collections;
  }

  _getCollections() {
    fetch('/api/collections?visitor=' + store.getState().app.visitorId)
      .then(function(response) {
        return response.json();
      })
      .then(function(collections){
        store.dispatch(retrieveCollections(collections));
      });
  }

  _openQuestions() {
    return;
  }

  _viewCards() {
    return;
  }
}

window.customElements.define('collection-viewer', CollectionViewer);
