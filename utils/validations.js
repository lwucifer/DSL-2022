/**
 * validate for email
 */
export const validateEmail = (_email) => {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
  return re.test(_email);
};

/**
 * validate password
 * @param {password} _password
 */
export const validatePassword = (_password) => {
  let re = /^.{8,32}$/;
  return re.test(_password);
};