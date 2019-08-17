import {UPDATE_PAGE, SET_INITIAL_VALUES} from '../actions/app.js';

const INITIAL_STATE = {
  page: '',
  visitorId: null,
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
    default:
      return state;
  }
};

export default app;
