import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';

import { store } from '../store.js';
import { navigate, setInitialValues } from '../actions/app.js';
import { getCookie } from '../../helpers.js';

class MyApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      _page: { type: String },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-primary-color: #E91E63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --paper-button-primary-color: #1dbf22;
          --paper-button-text-color: white;
        }

        .main-content {
          padding-top: 68px;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }

        @media only screen and (max-width: 768px) {
          .main-content {
            padding-top: 32px;
          }
        }
      }
      `
    ];
  }

  render() {
    return html`
      <main role="main" class="main-content">
        <collection-viewer class="page" ?active="${this._page === 'collections'}"></collection-viewer>
        <card-creator class="page" ?active="${this._page === 'create'}"></card-creator>
        <questions-page class="page" ?active="${this._page === 'questions'}"></questions-page>
      </main>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    setPassiveTouchGestures(true);
    this._getInitialValues();
  }

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
  }

  stateChanged(state) {
    this._page = state.app.page;
  }

  _getInitialValues() {
    const visitorIdQuery = getCookie('visitor_id') ? '?visitor=' + getCookie('visitor_id') : '';
    fetch('/api/get_initial_values/' + visitorIdQuery)
      .then(function(response) {
        return response.json();
      })
      .then(function(initialValues) {
        store.dispatch(setInitialValues(initialValues));
      });
  }
}

window.customElements.define('my-app', MyApp);
