import {UPDATE_PAGE, SET_INITIAL_VALUES, RETRIEVE_COLLECTIONS, SELECT_COLLECTION, RETRIEVE_CARDS} from '../actions/app.js';

const INITIAL_STATE = {
  page: '',
  visitorId: null,
  currentCollection: null,
  collections: [],
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      };
    case SET_INITIAL_VALUES:
      return {
        ...state,
        visitorId: action.initialValues.visitor
      };
    case RETRIEVE_COLLECTIONS:
      return {
        ...state,
        collections: action.collections
      };
    case RETRIEVE_CARDS:
      const foundIndex = state.collections.findIndex(x => x.id === action.currentCollection.id);
      const tempCollections = state.collections;
      tempCollections[foundIndex] = {...tempCollections[foundIndex],
                                     cards: action.cards};
      return {
        ...state,
        collections: tempCollections
      };
    case SELECT_COLLECTION:
      return {
        ...state,
        currentCollection: action.selectedCollection
      };
    default:
      return state;
  }
};

export default app;
