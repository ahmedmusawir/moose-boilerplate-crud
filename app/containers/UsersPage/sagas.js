/*
 *
 * UsersPage sagas
 *
 * These watch for specific events to come from Redux (takeLatest), fetch the
 * data necessary for the given event, and then finally return it via an action
 * where any number of Components could be listening for it.
 *
 */

import { take, call, select, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request from 'utils/request';
import axios from 'axios';

import {
  LOAD_USERS,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  ADD_USER,
  ADD_USER_SUCCESS,
} from './constants';
import {
  usersLoaded,
  usersLoadingError,
  userDeleted,
  userDeleteError,
  userAdded,
  userAddingError,
} from './actions';
import { makeSelectUser } from './selectors';

/**
 * Gets the users
 */
export function* getUsers() {
  // const requestURL = 'https://jsonplaceholder.typicode.com/users';
  // const requestURL = 'http://localhost:3001/users';
  const requestURL = 'http://128.199.122.47:3001/users';

  try {
    const users = yield call(request, requestURL);
    yield put(usersLoaded(users));
  } catch (err) {
    yield put(usersLoadingError(err));
  }
}

/**
 * Adds a user
 */
export function* addUser() {
  const requestURL = 'http://128.199.122.47:3001/users';
  const user = yield select(makeSelectUser());

  console.log('from addUser saga');
  console.log(user);
  console.log('----------------');

  try {
    // yield call(request, requestURL, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(user),
    // });
    yield axios.post(requestURL, user);
    yield put(userAdded());
  } catch (err) {
    yield put(userAddingError(err));
  }
}

/**
 * Deletes the chosen user
 */
export function* deleteUser() {
  const user = yield select(makeSelectUser());
  console.log(user);
  // const requestURL = `https://jsonplaceholder.typicode.com/users/${user.id}`;
  // const requestURL = `http://localhost:3001/users/${user.id}`;
  const requestURL = `http://128.199.122.47:3001/users/${user.id}`;

  try {
    yield call(request, requestURL, { method: 'DELETE' });
    yield put(userDeleted());
  } catch (err) {
    yield put(userDeleteError(err));
  }
}

/**
 * Saga to watch for location changes
 */
export function* watchLoadUsers() {
  // Watches for LOAD_USERS actions and calls getUsers when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(LOAD_USERS, getUsers);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

/**
 * Saga to watch for DELETE_USER actions
 */
export function* watchDeleteUser() {
  yield takeLatest(DELETE_USER, deleteUser);
}

/**
 * Saga to watch for DELETE_USER_SUCCESS actions
 */
export function* watchDeleteUserSuccess() {
  yield takeLatest(DELETE_USER_SUCCESS, getUsers);
}

/**
 * Saga to watch for ADD_USER actions
 */
export function* watchAddUser() {
  yield takeLatest(ADD_USER, addUser);
}

/**
 * Saga to watch for ADD_USER_SUCCESS actions
 */
export function* watchAddUserSuccess() {
  yield takeLatest(ADD_USER_SUCCESS, getUsers);
}

// Bootstrap sagas
export default [
  watchLoadUsers,
  watchDeleteUser,
  watchDeleteUserSuccess,
  watchAddUser,
  watchAddUserSuccess,
];
