import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';

import { store } from '../store.js';
import { retrieveCollections, selectCollection, navigate } from '../actions/app.js';


class CollectionViewer extends connect(store)(LitElement) {
  static get properties() {
    return {
      _collections: { type: Array },
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

        paper-card:last-of-type {
          margin-bottom: 50px;
        }

        .collection-viewer-content {
          display: flex;
          flex-direction: column;
          width: 50%;
          margin: 0 auto;
          padding: 15px;
          border-radius: 8px;
        }

        .card-buttons {
          margin-top: 20px;
        }

        .page-header {
          display: flex;
          flex-direction: column;
          width: 50%;
          margin: 0 auto 20px;
        }

        #pageTitle {
          font-size: 32px;
        }

        #collectionName {
          font-size: 18px;
          font-weight: bold;
        }

        @media only screen and (max-width: 768px) {
          .collection-viewer-content, .page-header {
            width: 90%;
          }
        }

        @media only screen and (max-width: 500px) {
          .card-buttons {
            display: flex;
            flex-direction: column;
          }

          .card-buttons > paper-button:not(:last-of-type) {
            margin-bottom: 20px;
          }
        }
      `
    ];
  }

  render() {
    return html`
      <div class="page-header">
        <div id="pageTitle">Collections</div>
        <div>Choose a collection to start answering questions!</div>
      </div>
      ${this._collections.map(collection =>
        html`
          <paper-card class="collection-viewer-content" elevation="3">
            <div id="collectionName">${collection.name}</div>
            <div>${collection.cards.length === 1 ? '1 card' : collection.cards.length + ' cards'}</div>
            <div class="card-buttons">
                <paper-button @click="${() => this._openQuestions(collection)}">Start Answering</paper-button>
                ${this._currentVisitor === collection.visitor ?
                    html`
                      <paper-button @click="${() => this._viewCards(collection)}">View Cards</paper-button>
                    ` : null}
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
    this._currentVisitor = state.app.visitorId;
    this._collections = state.app.collections;
  }

  _getCollections() {
    fetch('/api/collections/?visitor=' + store.getState().app.visitorId)
      .then(function(response) {
        return response.json();
      })
      .then(function(collections){
        store.dispatch(retrieveCollections(collections));
      });
  }

  _openQuestions(collection) {
    store.dispatch(selectCollection(collection));
    store.dispatch(navigate('/questions'));
  }

  _viewCards(collection) {
    store.dispatch(selectCollection(collection));
    store.dispatch(navigate('/create'));
  }
}

window.customElements.define('collection-viewer', CollectionViewer);
