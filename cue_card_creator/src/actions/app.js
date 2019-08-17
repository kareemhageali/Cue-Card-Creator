import {getCookie, setCookie} from '../../helpers.js';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const SET_INITIAL_VALUES = 'SET_INITIAL_VALUES';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? 'create' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));
};

export const setInitialValues = (initialValues) => {
  if (!getCookie('visitor_id')) {
    setCookie('visitor_id', initialValues.visitor_id);
  }
  return {
    type: SET_INITIAL_VALUES,
    initialValues
  };
};

const loadPage = (page) => (dispatch) => {
  switch(page) {
    case 'create':
      import('../components/card-creator.js');
      break;
    default:
      return;
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};
