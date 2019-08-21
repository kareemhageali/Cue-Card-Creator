import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';

import { store } from '../store.js';
import { retrieveCollections, retrieveCollection, selectCollection, navigate } from '../actions/app.js';
import { getCookie } from '../../helpers.js';


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

        .card-buttons > paper-button {
          margin: 0;
        }

        .page-header {
          display: flex;
          flex-direction: column;
          width: 50%;
          margin: 0 auto 20px;
        }

        .dialog-content {
          margin: auto;
          padding: 30px;
        }

        .dialog-content > h1 {
          line-height: 1.2;
        }

        #pageTitle {
          font-size: 32px;
        }

        #collectionName {
          font-size: 18px;
          font-weight: bold;
        }

        #openDialogButton {
          margin: 0;
          width: 40%;
        }

        #createCollectionDialog {
          width: 40%;
          height: 30%;
        }

        #createCollectionButton {
          margin: 0;
          margin-top: 40px;
        }

        @media only screen and (max-width: 768px) {
          .collection-viewer-content, .page-header {
            width: 90%;
          }

          #createCollectionDialog {
            width: 60%;
            height: 40%;
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
        <paper-button id="openDialogButton" @click="${() => this._openCreateDialog()}">Create Collection</paper-button>
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

      <paper-dialog id="createCollectionDialog" with-backdrop>
        <div class="dialog-content">
          <h1>Create Collection</h1>
          <paper-input id="nameInput" label="Name" required></paper-input>
          <paper-button id="createCollectionButton" @click="${() => this._createCollection()}">Create</paper-button>
        </div>
      </paper-dialog>
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

  _openCreateDialog() {
    this.shadowRoot.querySelector('#createCollectionDialog').open();
  }

  _createCollection() {
    if (!this.shadowRoot.querySelector('#nameInput').validate()) {
      return;
    }

    const requestBody = {name: this.shadowRoot.querySelector('#nameInput').value,
                         visitor: store.getState().app.visitorId}
    fetch('/api/collections/', {method: 'POST',
                                body: JSON.stringify(requestBody),
                                headers: {'Content-Type': 'application/json',
                                          'X-CSRFToken': getCookie('csrftoken')}})
      .then(response => {
        return response.json();
      })
      .then(collection => {
        this.shadowRoot.querySelector('#nameInput').value = '';
        this.shadowRoot.querySelector('#createCollectionDialog').close();
        store.dispatch(retrieveCollection(collection));
        store.dispatch(selectCollection(collection));
        store.dispatch(navigate('/create'));
      });
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
