import {
  getAccessToken,
  getAccessTokenFromCookie,
  getToken,
  getTokenFromCookie
} from '../utils/auth';
import {
  REMOVE_TOKEN,
  SET_ACCESS_TOKEN,
  SET_TOKEN
} from '../utils/mutation-type/auth';

export default async function ({ store, req, redirect, route }) {
  // console.log("[check-auth] mdw", req);

  const loggedToken = process.server ? getTokenFromCookie(req) : getToken();
  const loggedAccessToken = process.server
    ? getAccessTokenFromCookie(req)
    : getAccessToken();

  if (loggedToken) {
    store.commit(`auth/auth/${SET_TOKEN}`, loggedToken);
  } else {
    // logout/invalid token case
    store.commit(`auth/auth/${REMOVE_TOKEN}`);
  }
  if (loggedAccessToken) {
    store.commit(`auth/auth/${SET_ACCESS_TOKEN}`, loggedAccessToken);
  }
}
