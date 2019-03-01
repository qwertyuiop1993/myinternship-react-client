import axios from "axios";
import { submit } from "redux-form";
import i18n from "i18n";

import {
  REMOVE_ERROR_MESSAGE,
  UPDATE_STUDENT,
  FETCH_COMPANIES,
  ADD_ERROR_MESSAGE,
  STUDENT_SIGNUP,
  STUDENT_SIGNIN,
  FETCH_USER,
  TOGGLE_LANGUAGE
} from "actions/types";

export const studentSignup = (formData) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/signup", formData);
    dispatch({ type: STUDENT_SIGNUP, payload: response.data });
  } catch (err) {
    if (err.response.data.message === "studentid is in use") {
      dispatch({ type: STUDENT_SIGNIN, payload: false });
      return dispatch({ type: ADD_ERROR_MESSAGE, payload: i18n.t("studentForms.formErrors.studentid.duplicateId") });
    }
    dispatch({ type: STUDENT_SIGNIN, payload: false });
    dispatch({ type: ADD_ERROR_MESSAGE, payload: i18n.t("studentForms.formErrors.signupFailure") });
  }
};

export const studentSignin = (formData) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/signin", formData);
    dispatch({ type: STUDENT_SIGNIN, payload: response.data });
  } catch (err) {
    dispatch({ type: STUDENT_SIGNIN, payload: false });
    dispatch({ type: ADD_ERROR_MESSAGE, payload: i18n.t("studentForms.formErrors.signinFailure") });
  }
};

export const addErrorMesssage = (message) => {
  return {
    type: ADD_ERROR_MESSAGE,
    payload: message
  };
};

export const removeErrorMessage = () => {
  return {
    type: REMOVE_ERROR_MESSAGE,
    payload: null
  }
}

export const fetchUser = () => async (dispatch, getState) => {
  try {
    const response = await axios.get("/api/current_user");
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (err) {
    dispatch({ type: FETCH_USER, payload: false });
  }
};

export const fetchCompanies = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/companies");
    dispatch({ type: FETCH_COMPANIES, payload: response.data.companies });
  } catch (err) {
    if (err.response.data === "choices disabled by admin") {
      // value of false in state tells us that admin has explicitly disabled choices
      return dispatch({ type: FETCH_COMPANIES, payload: false });
    }
    dispatch({ type: FETCH_COMPANIES, payload: null });
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "Error fetching companies" });
  }
};

export const updateStudentChoices = (choices) => async (dispatch) => {
  try {
    const response = await axios.patch("/api/updateStudent", { choices: choices });
    dispatch({ type: UPDATE_STUDENT, payload: response.data });
  } catch (err) {
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "Error updating student" });
  }
};

export const toggleLanguage = (language) => {
  return {
    type: TOGGLE_LANGUAGE,
    payload: language
  };
};

export const submitReduxForm = (formName) => async (dispatch) => {
  await dispatch(submit(formName));
};
