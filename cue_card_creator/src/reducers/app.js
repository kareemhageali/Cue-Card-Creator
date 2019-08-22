import {UPDATE_PAGE, SET_INITIAL_VALUES, RETRIEVE_COLLECTIONS,
  RETRIEVE_COLLECTION, SELECT_COLLECTION, RETRIEVE_CARDS} from '../actions/app.js';

const INITIAL_STATE = {
  page: '',
  visitorId: null,
  currentCollection: null,
  currentCards: [],
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
    case RETRIEVE_COLLECTION:
      return {
        ...state,
        collections: [action.collection, ...state.collections]
      };
    case RETRIEVE_CARDS:
      const foundIndex = state.collections.findIndex(x => x.id === action.currentCollection.id);
      // Create new reference of object to cause a re-render
      const tempCollections = Object.assign([], state.collections);
      tempCollections[foundIndex] = {...tempCollections[foundIndex],
                                     cards: action.cards};
      return {
        ...state,
        collections: tempCollections,
        currentCards: action.cards,
        currentCollection: tempCollections[foundIndex]
      };
    case SELECT_COLLECTION:
      return {
        ...state,
        currentCollection: action.selectedCollection,
        currentCards: action.selectedCollection.cards
      };
    default:
      return state;
  }
};

export default app;
