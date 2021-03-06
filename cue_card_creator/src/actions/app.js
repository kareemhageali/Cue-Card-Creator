import {getCookie, setCookie} from '../../helpers.js';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const SET_INITIAL_VALUES = 'SET_INITIAL_VALUES';
export const RETRIEVE_COLLECTIONS = 'RETRIEVE_COLLECTIONS';
export const RETRIEVE_COLLECTION = 'RETRIEVE_COLLECTION';
export const RETRIEVE_CARDS = 'RETRIEVE_CARDS'
export const SELECT_COLLECTION = 'SELECT_COLLECTION';

export const navigate = (path) => (dispatch, getState) => {
  // Extract the page name from path.
  let page = path === '/' || !getState().app.visitorId ? 'collections' : path.slice(1);

  // Account for case of bundle name in URL
  if (page.indexOf('/') >= 0) {
    page = page.substring(page.indexOf('/') + 1);
  }
  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));
};

export const setInitialValues = (initialValues) => {
  if (!getCookie('visitor_id')) {
    setCookie('visitor_id', initialValues.visitor);
  }
  return {
    type: SET_INITIAL_VALUES,
    initialValues
  };
};

export const retrieveCollections = (collections) => {
  return {
    type: RETRIEVE_COLLECTIONS,
    collections
  };
};

export const retrieveCollection = (collection) => {
  return {
    type: RETRIEVE_COLLECTION,
    collection
  }
};

export const retrieveCards = (cards, currentCollection) => {
  return {
    type: RETRIEVE_CARDS,
    cards,
    currentCollection
  };
};

export const selectCollection = (selectedCollection) => {
  return {
    type: SELECT_COLLECTION,
    selectedCollection
  };
};

const loadPage = (page) => (dispatch) => {
  switch(page) {
    case 'create':
      import('../components/card-creator.js');
      break;
    case 'collections':
      import('../components/collection-viewer.js');
      break;
    case 'questions':
      import('../components/questions-page.js');
      break;
    default:
      return;
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  window.history.pushState({}, '', page);
  return {
    type: UPDATE_PAGE,
    page
  };
};
