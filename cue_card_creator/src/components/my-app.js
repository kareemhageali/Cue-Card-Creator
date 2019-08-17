import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

import { store } from '../store.js';
import { navigate, setInitialValues } from '../actions/app.js';
import { getCookie } from '../../helpers.js';

class MyApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      appTitle: { type: String },
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
          padding-top: 64px;
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
      }
      `
    ];
  }

  render() {
    return html`
      <main role="main" class="main-content">
        <card-creator class="page" ?active="${this._page === 'create'}"></card-creator>
      </main>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
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
    const visitorIdQuery = getCookie('visitor_id') ? '?visitor_id=' + getCookie('visitor_id') : '';
    fetch('http://localhost:8000/api/get_initial_values' + visitorIdQuery)
      .then(function(response) {
        return response.json();
      })
      .then(function(initialValues) {
        store.dispatch(setInitialValues(initialValues));
      });
  }
}

window.customElements.define('my-app', MyApp);
