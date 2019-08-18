import {UPDATE_PAGE, SET_INITIAL_VALUES, RETRIEVE_COLLECTIONS} from '../actions/app.js';

const INITIAL_STATE = {
  page: '',
  visitorId: null,
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
        visitorId: action.initialValues.visitor_id
      };
    case RETRIEVE_COLLECTIONS:
      return {
        ...state,
        collections: action.collections
      };
    default:
      return state;
  }
};

export default app;
