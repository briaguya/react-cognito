import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoState } from './states';

/* global AWSCognito */

const initial = {
  user: null,
  state: CognitoState.LOGGED_OUT,
  error: null,
  userPool: null,
  config: {
    region: null,
    userPool: null,
    clientId: null,
    identityPool: null,
  },
};

const configure = (state, action) => {
  // naughty side-effect
  AWSCognito.config.region = action.config.region;
  const pool = new CognitoUserPool({
    UserPoolId: action.config.userPool,
    ClientId: action.config.clientId,
  });
  const user = pool.getCurrentUser();
  return Object.assign({}, state, {
    config: action.config,
    userPool: pool,
    user,
  });
};

export const cognito = (state = initial, action) => {
  switch (action.type) {

    case 'COGNITO_CONFIGURE':
      return configure(state, action);

    case 'COGNITO_LOGIN':
      return Object.assign({}, state, {
        user: action.user,
        state: CognitoState.LOGGED_IN,
      });

    case 'COGNITO_LOGOUT':
      return Object.assign({}, state, {
        user: null,
        state: CognitoState.LOGGED_OUT,
      });

    case 'COGNITO_LOGIN_FAILURE':
      return Object.assign({}, state, {
        user: action.user,
        state: CognitoState.LOGIN_FAILURE,
        error: action.error,
      });

    case 'COGNITO_LOGIN_MFA_REQUIRED':
      return Object.assign({}, state, {
        user: action.user,
        state: CognitoState.MFA_REQUIRED,
      });

    case 'COGNITO_LOGIN_NEW_PASSWORD_REQUIRED':
      return Object.assign({}, state, {
        user: action.user,
        state: CognitoState.NEW_PASSWORD_REQUIRED,
      });

    default:
      return state;
  }
};
