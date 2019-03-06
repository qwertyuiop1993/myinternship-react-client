import { FETCH_STUDENTS } from "actions/types";

export default (state=[], action) => {
  switch (action.type) {
    case FETCH_STUDENTS:
      return action.payload;
    default:
      return state;
  }
};
