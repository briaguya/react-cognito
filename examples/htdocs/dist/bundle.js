(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-redux', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-redux'), require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactRedux, global.actions);
    global.Confirm = mod.exports;
  }
})(this, function (exports, _react, _reactRedux, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Confirm = undefined;

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var BaseConfirm = function BaseConfirm(props) {
    return _react2.default.cloneElement(props.children, {
      error: props.error,
      onSubmit: props.onSubmit,
      onResend: props.onResend,
      onCancel: props.onCancel
    });
  };

  var confirm = function confirm(verificationCode, user, dispatch) {
    user.confirmRegistration(verificationCode, true, function (error) {
      if (error) {
        dispatch(_actions.Action.confirmFailed(user, error.message));
      } else {
        dispatch(_actions.Action.logout());
      }
    });
  };

  var resend = function resend(user, dispatch) {
    return user.resendConfirmationCode(function (err) {
      if (err) {
        dispatch(_actions.Action.confirmationRequired(user, err.message));
      } else {
        dispatch(_actions.Action.confirmationRequired(user, 'Confirmation code resent'));
      }
    });
  };

  var mapStateToProps = function mapStateToProps(state) {
    return {
      error: state.cognito.error,
      user: state.cognito.user
    };
  };

  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
      confirmPartial: function confirmPartial(verificationCode, user) {
        return confirm(verificationCode, user, dispatch);
      },
      onCancel: function onCancel() {
        return dispatch(_actions.Action.logout());
      },
      onResendPartial: function onResendPartial(user) {
        return resend(user, dispatch);
      }
    };
  };

  var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
      onSubmit: function onSubmit(verificationCode) {
        return dispatchProps.confirmPartial(verificationCode, stateProps.user);
      },
      onResend: function onResend() {
        return dispatchProps.onResendPartial(stateProps.user);
      }
    });
  };

  /**
   * Container for a confirmation form.  Magically adds the following props to the 
   * contained form:
   *
   *  * user - the Cognito User from the redux store
   *  * error - the persisted error from the redux store
   *  * onSubmit - a handler that calls the Cognito confirm API
   *  * onResend - a handler that calls the Cognito resend request API
   *  * onCancel - Logs the user out completely
   *
   * @example
   * <Confirm>
   *   <ConfirmForm />
   * </Confirm>
   *
   */
  var Confirm = exports.Confirm = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BaseConfirm);
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-redux', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-redux'), require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactRedux, global.actions);
    global.EmailVerification = mod.exports;
  }
})(this, function (exports, _react, _reactRedux, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.EmailVerification = exports.verifyEmail = undefined;

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var BaseEmailVerification = function BaseEmailVerification(props) {
    return _react2.default.cloneElement(props.children, {
      error: props.error,
      onSubmit: props.onSubmit,
      onCancel: props.onCancel
    });
  };

  var verifyEmail = exports.verifyEmail = function verifyEmail(verificationCode, user, dispatch) {
    return new Promise(function (resolve, reject) {
      user.verifyAttribute('email', verificationCode, {
        onSuccess: function onSuccess() {
          dispatch(_actions.Action.login(user));
          resolve();
        },
        inputVerificationCode: function inputVerificationCode() {
          dispatch(_actions.Action.emailVerificationRequired(user));
          reject();
        },
        onFailure: function onFailure(error) {
          dispatch(_actions.Action.emailVerificationFailed(user, error.message));
          reject();
        }
      });
    });
  };

  var mapStateToProps = function mapStateToProps(state) {
    return {
      error: state.cognito.error,
      user: state.cognito.user
    };
  };

  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
      verifyPartial: function verifyPartial(verificationCode, user) {
        return verifyEmail(verificationCode, user, dispatch);
      },
      onCancel: function onCancel() {
        return dispatch(_actions.Action.logout());
      }
    };
  };

  var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
      onSubmit: function onSubmit(verificationCode) {
        return dispatchProps.verifyPartial(verificationCode, stateProps.user);
      }
    });
  };

  /**
   * Wrapper for an Email Verification Form.
   * Magically adds the following props to the contained form:
   *
   *  * user - the Cognito user from the Redux store
   *  * error - the persisted error from the Redux store
   *  * onSubmit - a handler that calls the Cognito verification API
   *
   * @example
   * <EmailVerification>
   *   <EmailVerificationForm />
   * </EmailVerification>
   *
   */
  var EmailVerification = exports.EmailVerification = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BaseEmailVerification);
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-redux', './auth'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-redux'), require('./auth'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactRedux, global.auth);
    global.Login = mod.exports;
  }
})(this, function (exports, _react, _reactRedux, _auth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var BaseLogin = function BaseLogin(props) {
    return _react2.default.cloneElement(props.children, {
      username: props.username,
      error: props.error,
      onSubmit: props.onSubmit
    });
  };

  var mapStateToProps = function mapStateToProps(state) {
    var username = '';
    if (state.cognito.user) {
      username = state.cognito.user.getUsername();
    }
    return {
      username: username,
      error: state.cognito.error,
      config: state.cognito.config,
      userPool: state.cognito.userPool
    };
  };

  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
      authenticator: function authenticator(username, password, userPool, config) {
        return (0, _auth.authenticate)(username, password, userPool, config).then(dispatch);
      }
    };
  };

  var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, stateProps, {
      onSubmit: function onSubmit(username, password) {
        return dispatchProps.authenticator(username, password, stateProps.userPool, stateProps.config);
      }
    });
  };

  /**
   * Container for login behaviour, wrapping a login form.
   *
   * Magically provides the following props to the wrapped form:
   *
   *  * username
   *  * error
   *  * onSubmit
   *
   * @example
   * <Login>
   *   <LoginForm />
   * </Login>
   */
  var Login = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BaseLogin);

  exports.Login = Login;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'prop-types', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('prop-types'), require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.propTypes, global.actions);
    global.Logout = mod.exports;
  }
})(this, function (exports, _react, _propTypes, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logout = undefined;

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Logout = exports.Logout = function (_React$Component) {
    _inherits(Logout, _React$Component);

    function Logout() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Logout);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Logout.__proto__ || Object.getPrototypeOf(Logout)).call.apply(_ref, [this].concat(args))), _this), _this.onClick = function (event) {
        var store = _this.context.store;

        var state = store.getState();
        state.cognito.user.signOut();
        event.preventDefault();
        store.dispatch(_actions.Action.logout());
        _this.props.onLogout();
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /**
     * Passed to child element as onClick prop.
     * Signs the user out, and then dispatches the logout action
     * If you want to take further actions (like reloading UI) then add an
     * onLogout property to the Logout element
     */


    _createClass(Logout, [{
      key: 'render',


      /**
       * renders the child element, adding an onClick property
       */
      value: function render() {
        return _react2.default.cloneElement(this.props.children, {
          onClick: this.onClick
        });
      }
    }]);

    return Logout;
  }(_react2.default.Component);

  Logout.contextTypes = {
    store: _propTypes.PropTypes.object
  };
  Logout.propTypes = {
    children: _react2.default.PropTypes.any.isRequired,
    onLogout: _react2.default.PropTypes.func
  };
  Logout.defaultProps = {
    onLogout: function onLogout() {}
  };
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-redux', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-redux'), require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactRedux, global.actions);
    global.NewPasswordRequired = mod.exports;
  }
})(this, function (exports, _react, _reactRedux, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NewPasswordRequired = undefined;

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var BaseNewPasswordRequired = function BaseNewPasswordRequired(props) {
    return _react2.default.cloneElement(props.children, {
      error: props.error,
      onSubmit: props.onSubmit
    });
  };

  var setNewPassword = function setNewPassword(password, user, config, userAttributes, dispatch) {
    return user.completeNewPasswordChallenge(password, userAttributes, {
      onSuccess: function onSuccess() {
        return dispatch(_actions.Action.authenticated(user));
      },
      onFailure: function onFailure(error) {
        return dispatch(_actions.Action.newPasswordRequiredFailure(user, error.message));
      },
      mfaRequired: function mfaRequired() {
        return dispatch(_actions.Action.mfaRequired(user));
      },
      newPasswordRequired: function newPasswordRequired() {
        return dispatch(_actions.Action.newPasswordRequired(user));
      }
    });
  };

  var mapStateToProps = function mapStateToProps(state) {
    return {
      error: state.cognito.error,
      user: state.cognito.user,
      config: state.cognito.config
    };
  };

  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
      setNewPasswordPartial: function setNewPasswordPartial(password, user, config, userAttributes) {
        return setNewPassword(password, user, config, userAttributes, dispatch);
      }
    };
  };

  var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, stateProps, {
      onSubmit: function onSubmit(password, userAttributes) {
        return dispatchProps.setNewPasswordPartial(password, stateProps.user, stateProps.config, userAttributes);
      }
    });
  };

  /**
   * Wrapper for a New Password Required form
   *
   * Magically provides the following props to the wrapped element:
   *
   * * user - the Cognito user
   * * error - the persistent react-cognito error message
   * * onSubmit - a handler that calls the Set New Password API
   *
   * @example
   *
   * <NewPasswordRequired>
   *   <NewPasswordRequiredForm />
   * </NewPasswordRequired>
   */
  var NewPasswordRequired = exports.NewPasswordRequired = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BaseNewPasswordRequired);
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-redux', 'amazon-cognito-identity-js', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-redux'), require('amazon-cognito-identity-js'), require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactRedux, global.amazonCognitoIdentityJs, global.actions);
    global.PasswordReset = mod.exports;
  }
})(this, function (exports, _react, _reactRedux, _amazonCognitoIdentityJs, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PasswordReset = undefined;

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var BasePasswordReset = function BasePasswordReset(props) {
    return _react2.default.cloneElement(props.children, {
      error: props.error,
      username: props.username,
      sendVerificationCode: props.sendVerificationCode,
      setPassword: props.setPassword
    });
  };

  var getUser = function getUser(username, userPool) {
    var user = new _amazonCognitoIdentityJs.CognitoUser({
      Username: username,
      Pool: userPool
    });
    return user;
  };

  var setPassword = function setPassword(username, userPool, code, password) {
    return new Promise(function (resolve) {
      var user = getUser(username, userPool);
      user.confirmPassword(code, password, {
        onSuccess: function onSuccess() {
          return resolve(_actions.Action.finishPasswordResetFlow('Password reset'));
        },
        onFailure: function onFailure(err) {
          return resolve(_actions.Action.beginPasswordResetFlow(user, err.message));
        }
      });
    });
  };

  var sendVerificationCode = function sendVerificationCode(username, userPool) {
    return new Promise(function (resolve) {
      var user = getUser(username, userPool);
      user.forgotPassword({
        onSuccess: function onSuccess() {
          return resolve(_actions.Action.beginPasswordResetFlow(user, 'Verification code sent'));
        },
        onFailure: function onFailure(err) {
          return resolve(_actions.Action.beginPasswordResetFlow(user, err.message));
        }
      });
    });
  };

  var mapStateToProps = function mapStateToProps(state) {
    var props = {
      error: state.cognito.error || '',
      user: state.cognito.user,
      username: '',
      userPool: state.cognito.userPool
    };
    if (state.cognito.user != null) {
      props.username = state.cognito.user.getUsername();
    }
    return props;
  };

  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
      sendVerificationCodePartial: function sendVerificationCodePartial(username, userPool) {
        sendVerificationCode(username, userPool).then(dispatch);
      },
      setPasswordPartial: function setPasswordPartial(user, userPool, code, password) {
        setPassword(user, userPool, code, password).then(dispatch);
      }
    };
  };

  var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, stateProps, {
      sendVerificationCode: function sendVerificationCode(username) {
        return dispatchProps.sendVerificationCodePartial(username, stateProps.userPool);
      },
      setPassword: function setPassword(username, code, password) {
        return dispatchProps.setPasswordPartial(username, stateProps.userPool, code, password);
      }
    });
  };

  /**
   * Container for a Password Reset form
   *
   * Magically provides the following props to the wrapped element:
   *
   *  * user
   *  * username
   *  * error
   *  * sendVerificationCode
   *  * setPassword
   *
   * @example
   * <PasswordReset>
   *   <PasswordResetForm />
   * </PasswordReset>
   */
  var PasswordReset = exports.PasswordReset = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BasePasswordReset);
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.actions = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * container for all the actions
  */
  var Action = {

    configure: function configure(config) {
      return {
        type: 'COGNITO_CONFIGURE',
        config: config
      };
    },

    authenticated: function authenticated(user) {
      return {
        type: 'COGNITO_AUTHENTICATED',
        user: user
      };
    },

    loggingIn: function loggingIn(attributes) {
      return {
        type: 'COGNITO_LOGGING_IN',
        attributes: attributes
      };
    },

    login: function login(creds) {
      return {
        type: 'COGNITO_LOGIN',
        creds: creds
      };
    },

    logout: function logout() {
      return {
        type: 'COGNITO_LOGOUT'
      };
    },

    loginFailure: function loginFailure(user, error) {
      return {
        type: 'COGNITO_LOGIN_FAILURE',
        user: user,
        error: error
      };
    },

    mfaRequired: function mfaRequired(user) {
      return {
        type: 'COGNITO_LOGIN_MFA_REQUIRED',
        user: user
      };
    },

    newPasswordRequired: function newPasswordRequired(user) {
      return {
        type: 'COGNITO_LOGIN_NEW_PASSWORD_REQUIRED',
        user: user
      };
    },

    newPasswordRequiredFailure: function newPasswordRequiredFailure(user, error) {
      return {
        type: 'COGNITO_NEW_PASSWORD_REQUIRED_FAILURE',
        user: user,
        error: error
      };
    },

    emailVerificationRequired: function emailVerificationRequired(attributes) {
      return {
        type: 'COGNITO_EMAIL_VERIFICATION_REQUIRED',
        attributes: attributes
      };
    },

    emailVerificationFailed: function emailVerificationFailed(user, error) {
      return {
        type: 'COGNITO_EMAIL_VERIFICATION_FAILED',
        user: user,
        error: error
      };
    },

    beginPasswordResetFlow: function beginPasswordResetFlow(user, error) {
      return {
        type: 'COGNITO_BEGIN_PASSWORD_RESET_FLOW',
        user: user,
        error: error
      };
    },

    finishPasswordResetFlow: function finishPasswordResetFlow(error) {
      return {
        type: 'COGNITO_FINISH_PASSWORD_RESET_FLOW',
        error: error
      };
    },

    updateAttributes: function updateAttributes(attributes) {
      return {
        type: 'COGNITO_UPDATE_USER_ATTRIBUTES',
        attributes: attributes
      };
    },

    confirmationRequired: function confirmationRequired(user, error) {
      return {
        type: 'COGNITO_USER_UNCONFIRMED',
        user: user,
        error: error
      };
    },

    confirmFailed: function confirmFailed(user, error) {
      return {
        type: 'COGNITO_USER_CONFIRM_FAILED',
        user: user,
        error: error
      };
    }
  };

  exports.Action = Action;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.actions);
    global.attributes = mod.exports;
  }
})(this, function (exports, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.mkAttrList = exports.updateAttributes = exports.getUserAttributes = exports.sendAttributeVerificationCode = undefined;


  /**
   * Request that a verification code is sent by email or SMS to verify
   * an attribute
   * @param {object} user - the cognito user object
   * @param {string} attribute - the attribute name
  */
  var sendAttributeVerificationCode = function sendAttributeVerificationCode(user, attribute) {
    return new Promise(function (resolve, reject) {
      user.getAttributeVerificationCode(attribute, {
        onSuccess: function onSuccess() {
          return resolve(false);
        },
        inputVerificationCode: function inputVerificationCode() {
          return resolve(true);
        },
        onFailure: function onFailure(error) {
          return reject(error.message);
        }
      });
    });
  };

  /**
   * Fetches the user attributes from Cognito, and turns them into
   * an object
   * @param {object} user - the cognito user object
   * @returns {Promise} resolves with the attributes or rejects with an error message
  */
  var getUserAttributes = function getUserAttributes(user) {
    return new Promise(function (resolve, reject) {
      return user.getUserAttributes(function (error, result) {
        if (error) {
          reject(error.message);
        } else {
          var attributes = {};
          for (var i = 0; i < result.length; i += 1) {
            var name = result[i].getName();
            var value = result[i].getValue();
            attributes[name] = value;
          }
          resolve(attributes);
        }
      });
    });
  };

  /**
   * convert an attribute dictionary to an attribute list
   * @param {object} attributes - a dictionary of attributes
   * @return {array} AWS expected attribute list
  */
  var mkAttrList = function mkAttrList(attributes) {
    return Object.keys(attributes).map(function (key) {
      return {
        Name: key,
        Value: attributes[key]
      };
    });
  };

  /**
   * update the attributes in Cognito
   * @param {object} user - the CognitoUser object
   * @param {object} attributes - an attributes dictionary with the attributes to be updated
   * @return {Promise<object>} a promise that resolves to a redux action
  */
  var updateAttributes = function updateAttributes(user, attributes) {
    return new Promise(function (resolve, reject) {
      var attributeList = mkAttrList(attributes);
      user.updateAttributes(attributeList, function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve(_actions.Action.updateAttributes(attributes));
        }
      });
    });
  };

  exports.sendAttributeVerificationCode = sendAttributeVerificationCode;
  exports.getUserAttributes = getUserAttributes;
  exports.updateAttributes = updateAttributes;
  exports.mkAttrList = mkAttrList;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'amazon-cognito-identity-js', 'aws-cognito-sdk', './actions', './attributes', './utils'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('amazon-cognito-identity-js'), require('aws-cognito-sdk'), require('./actions'), require('./attributes'), require('./utils'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.amazonCognitoIdentityJs, global.awsCognitoSdk, global.actions, global.attributes, global.utils);
    global.auth = mod.exports;
  }
})(this, function (exports, _amazonCognitoIdentityJs, _awsCognitoSdk, _actions, _attributes, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.emailVerificationFlow = exports.registerUser = exports.performLogin = exports.authenticate = undefined;


  /**
   * sends the email verification code and transitions to the correct state
   * @param {object} user - the CognitoUser object
   * @param {object} attributes - the attributes dictionary
   * @return {Promise<object>} a promise that resolves to a redux action
  */
  var emailVerificationFlow = function emailVerificationFlow(user, attributes) {
    return new Promise(function (resolve) {
      return (0, _attributes.sendAttributeVerificationCode)(user, 'email').then(function (required) {
        if (required) {
          resolve(_actions.Action.emailVerificationRequired(attributes));
        } else {
          // dead end?
          resolve(_actions.Action.loggingIn(attributes));
        }
      }, function (error) {
        // some odd classes of error here
        resolve(_actions.Action.emailVerificationFailed(error, attributes));
      });
    });
  };

  /**
   * logs in to the federated identity pool with a JWT
   * @param {string} username - the username
   * @param {string} jwtToken - a token from the session
   * @param {object} config - the react-cognito config
   * @return {Promise<object>} a promise that resolves to the federated identity credentials
  */
  var refreshIdentityCredentials = function refreshIdentityCredentials(username, jwtToken, config) {
    return new Promise(function (resolve, reject) {
      var logins = (0, _utils.buildLogins)(username, jwtToken, config);
      var creds = new _awsCognitoSdk.CognitoIdentityCredentials(logins);
      creds.refresh(function (error) {
        if (error) {
          reject(error.message);
        } else {
          resolve(creds);
        }
      });
    });
  };

  /**
   * establishes a session with the user pool, and logs into the federated identity
   * pool using a token from the session
   * @param {object} user - the CognitoUser object
   * @param {object} config -the react-cognito config
   * @return {Promise<object>} an action to be dispatched
  */
  var performLogin = function performLogin(user, config) {
    return new Promise(function (resolve, reject) {
      if (user != null) {
        user.getSession(function (err, session) {
          if (err) {
            resolve(_actions.Action.loginFailure(user, err.message));
          } else {
            var jwtToken = session.getIdToken().getJwtToken();
            var username = user.getUsername();
            refreshIdentityCredentials(username, jwtToken, config).then(function (creds) {
              return resolve(_actions.Action.login(creds));
            }, function (message) {
              return resolve(_actions.Action.loginFailure(user, message));
            });
          }
        });
      } else {
        reject('user is null');
      }
    });
  };

  /**
   *
   * Authenticates with a user pool, and handles responses.
   * if the authentication is successful it then logs in to the
   * identity pool.
   *
   * returns an action depending on the outcome.  Possible actions returned
   * are:
   *
   * - login - valid user who is logged in
   * - loginFailure - failed to authenticate with user pool or identity pool
   * - mfaRequired - user now needs to enter MFA
   * - newPasswordRequired - user must change password on first login
   * - emailVerificationRequired - user must verify their email address
   * - emailVerificationFailed - email verification is required, but won't work
   *
   * Dispatch the resulting action, e.g.:
   *
   * ```
   * const { userPool, config } = state.cognito;
   * authenticate(username, password, userPool, config).then(dispatch);
   * ```
   *
   * @param {string} username - the username provided by the user
   * @param {string} password - the password provided by the user
   * @param {object} userPool - a Cognito User Pool object
   * @return {Promise<object>} - a promise that resolves an action to be dispatched
   *
  */
  var authenticate = function authenticate(username, password, userPool) {
    return new Promise(function (resolve) {
      var creds = new _amazonCognitoIdentityJs.AuthenticationDetails({
        Username: username,
        Password: password
      });

      var user = new _amazonCognitoIdentityJs.CognitoUser({
        Username: username,
        Pool: userPool
      });

      user.authenticateUser(creds, {
        onSuccess: function onSuccess() {
          return resolve(_actions.Action.authenticated(user));
        },
        onFailure: function onFailure(error) {
          if (error.code === 'UserNotConfirmedException') {
            resolve(_actions.Action.confirmationRequired(user));
          } else {
            resolve(_actions.Action.loginFailure(user, error.message));
          }
        },
        mfaRequired: function mfaRequired() {
          return resolve(_actions.Action.mfaRequired(user));
        },
        newPasswordRequired: function newPasswordRequired() {
          return resolve(_actions.Action.newPasswordRequired(user));
        }
      });
    });
  };

  /**
   * sign up this user with the user pool provided
   * @param {object} userPool - a Cognito userpool (e.g. state.cognito.userPool)
   * @param {object} config - the react-cognito config object
   * @param {string} username - the username
   * @param {string} password - the password
   * @param {object} attributes - an attributes dictionary
   * @return {Promise<object>} a promise that resolves a redux action
  */
  var registerUser = function registerUser(userPool, config, username, password, attributes) {
    return new Promise(function (resolve, reject) {
      return userPool.signUp(username, password, (0, _attributes.mkAttrList)(attributes), null, function (err, result) {
        if (err) {
          reject(err.message);
        } else if (result.userConfirmed === false) {
          resolve(_actions.Action.confirmationRequired(result.user));
        } else {
          resolve(authenticate(username, password, userPool));
        }
      });
    });
  };

  exports.authenticate = authenticate;
  exports.performLogin = performLogin;
  exports.registerUser = registerUser;
  exports.emailVerificationFlow = emailVerificationFlow;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.guard = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  /*
   Default behaviour is to restrict access to only logged in users
  */

  var testLoggedIn = function testLoggedIn(state, wantLoggedIn) {
    var isLoggedIn = state.cognito.user !== null;
    if (isLoggedIn && wantLoggedIn) {
      return true;
    }
    if (!isLoggedIn && !wantLoggedIn) {
      return true;
    }
    return false;
  };

  var permitted = function permitted(state, expr) {
    return new Promise(function (resolve) {
      if (expr.loggedIn !== undefined) {
        resolve(testLoggedIn(state, expr.loggedIn));
      } else {
        resolve(testLoggedIn(state, true));
      }
    });
  };

  var guard = function guard(store, forbiddenUrl) {
    var expr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var routeState = arguments[3];
    var replace = arguments[4];
    var callback = arguments[5];

    var state = store.getState();
    var dest = forbiddenUrl;

    if (expr.forbiddenUrl !== undefined) {
      dest = expr.forbiddenUrl;
    }
    permitted(state, expr).then(function (allow) {
      if (!allow) {
        replace(dest);
      }
      callback();
    });
  };

  /**
   * creates a guard function you can use in <Route> tags
   * @param {object} store - the redux store
   * @param {string} forbiddenUrl - the default url to navigate to if forbidden
   * @returns {function} - a function that can be provided to onEnter
  */
  var createGuard = function createGuard(store, forbiddenUrl) {
    return function (expr) {
      return function (state, replace, callback) {
        return guard(store, forbiddenUrl, expr, state, replace, callback);
      };
    };
  };

  exports.createGuard = createGuard;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './reducers', './actions', './states', './utils', './guard', './auth', './attributes', './policy', './Login.jsx', './Logout.jsx', './NewPasswordRequired.jsx', './EmailVerification.jsx', './PasswordReset.jsx', './Confirm.jsx'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./reducers'), require('./actions'), require('./states'), require('./utils'), require('./guard'), require('./auth'), require('./attributes'), require('./policy'), require('./Login.jsx'), require('./Logout.jsx'), require('./NewPasswordRequired.jsx'), require('./EmailVerification.jsx'), require('./PasswordReset.jsx'), require('./Confirm.jsx'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.reducers, global.actions, global.states, global.utils, global.guard, global.auth, global.attributes, global.policy, global.Login, global.Logout, global.NewPasswordRequired, global.EmailVerification, global.PasswordReset, global.Confirm);
    global.index = mod.exports;
  }
})(this, function (exports, _reducers, _actions, _states, _utils, _guard, _auth, _attributes, _policy, _Login, _Logout, _NewPasswordRequired, _EmailVerification, _PasswordReset, _Confirm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_reducers).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _reducers[key];
      }
    });
  });
  Object.keys(_actions).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _actions[key];
      }
    });
  });
  Object.keys(_states).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _states[key];
      }
    });
  });
  Object.keys(_utils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _utils[key];
      }
    });
  });
  Object.keys(_guard).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _guard[key];
      }
    });
  });
  Object.keys(_auth).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _auth[key];
      }
    });
  });
  Object.keys(_attributes).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _attributes[key];
      }
    });
  });
  Object.keys(_policy).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _policy[key];
      }
    });
  });
  Object.keys(_Login).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _Login[key];
      }
    });
  });
  Object.keys(_Logout).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _Logout[key];
      }
    });
  });
  Object.keys(_NewPasswordRequired).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _NewPasswordRequired[key];
      }
    });
  });
  Object.keys(_EmailVerification).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _EmailVerification[key];
      }
    });
  });
  Object.keys(_PasswordReset).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _PasswordReset[key];
      }
    });
  });
  Object.keys(_Confirm).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _Confirm[key];
      }
    });
  });
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './actions', './attributes', './auth', './states'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./actions'), require('./attributes'), require('./auth'), require('./states'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.actions, global.attributes, global.auth, global.states);
    global.policy = mod.exports;
  }
})(this, function (exports, _actions, _attributes, _auth, _states) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.identityPoolLogin = exports.emailVerificationRequired = exports.fetchAttributes = exports.direct = exports.enable = exports.setupCognito = undefined;


  /**
   * subscribes a "policy" function to the store, and calls it
   * with the state and the dispatch function
   * @param {object} store - the redux store
   * @param {function} f - f(state, dispatch)
  */
  var enable = function enable(store, f) {
    store.subscribe(function () {
      var state = store.getState();
      var dispatch = store.dispatch;
      f(state, dispatch);
    });
  };

  /**
   * requires email verification before transitioning from AUTHENTICATED
   * @param {object} state - the redux store state
   * @param {function} dispatch - the dispatch function
  */
  var emailVerificationRequired = function emailVerificationRequired(state, dispatch) {
    if (state.cognito.state === _states.CognitoState.AUTHENTICATED) {
      var user = state.cognito.user;
      (0, _attributes.getUserAttributes)(user).then(function (attributes) {
        if (attributes.email_verified !== 'true') {
          (0, _auth.emailVerificationFlow)(user, attributes).then(dispatch);
        } else {
          dispatch(_actions.Action.loggingIn(attributes));
        }
      });
    }
  };

  /**
   * fetches and stores attributes before transitioning from AUTHENTICATED
   * @param {object} state - the redux store state
   * @param {function} dispatch - the dispatch function
  */
  var fetchAttributes = function fetchAttributes(state, dispatch) {
    if (state.cognito.state === _states.CognitoState.AUTHENTICATED) {
      var user = state.cognito.user;
      (0, _attributes.getUserAttributes)(user).then(function (attributes) {
        dispatch(_actions.Action.loggingIn(attributes));
      });
    }
  };

  /**
   * transitions directly from AUTHENTICATED to LOGGING_IN
   * @param {object} state - the redux store state
   * @param {function} dispatch - the dispatch function
  */
  var direct = function direct(state, dispatch) {
    if (state.cognito.state === _states.CognitoState.AUTHENTICATED) {
      dispatch(_actions.Action.loggingIn());
    }
  };

  /**
   * logs into the single federated identity pool to transition from LOGGING_IN
   * to LOGGED_IN
   * @param {object} state - the redux store state
   * @param {function} dispatch - the dispatch function
  */
  var identityPoolLogin = function identityPoolLogin(state, dispatch) {
    if (state.cognito.state === _states.CognitoState.LOGGING_IN) {
      (0, _auth.performLogin)(state.cognito.user, state.cognito.config).then(dispatch);
    }
  };

  /**
   * sets up react-cognito with default policies.
  */
  var setupCognito = function setupCognito(store, config) {
    store.dispatch(_actions.Action.configure(config));
    enable(store, emailVerificationRequired);
    enable(store, identityPoolLogin);
  };

  exports.setupCognito = setupCognito;
  exports.enable = enable;
  exports.direct = direct;
  exports.fetchAttributes = fetchAttributes;
  exports.emailVerificationRequired = emailVerificationRequired;
  exports.identityPoolLogin = identityPoolLogin;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'amazon-cognito-identity-js', './states'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('amazon-cognito-identity-js'), require('./states'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.amazonCognitoIdentityJs, global.states);
    global.reducers = mod.exports;
  }
})(this, function (exports, _amazonCognitoIdentityJs, _states) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.cognito = undefined;


  /* global AWSCognito */

  var initial = {
    user: null,
    state: _states.CognitoState.LOGGED_OUT,
    error: '',
    userPool: null,
    attributes: {},
    creds: null,
    config: {
      region: null,
      userPool: null,
      clientId: null,
      identityPool: null
    }
  };

  var configure = function configure(state, action) {
    // surprise side-effect!
    AWSCognito.config.region = action.config.region;
    var pool = new _amazonCognitoIdentityJs.CognitoUserPool({
      UserPoolId: action.config.userPool,
      ClientId: action.config.clientId
    });
    var user = pool.getCurrentUser();
    return Object.assign({}, state, {
      config: action.config,
      userPool: pool,
      user: user
    });
  };

  // sometimes we don't get the attributes in later parts of the login flow
  // but lets not clobber the ones we've got if we've not got them
  var addAttributes = function addAttributes(s, attributes) {
    var s2 = Object.assign({}, s);
    if (attributes) {
      s2.attributes = attributes;
    }
    return s2;
  };

  /**
   * reducer function to be passed to redux combineReducers
   * @param {object} state
   * @param {object} action
  */

  var cognito = exports.cognito = function cognito() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial;
    var action = arguments[1];

    switch (action.type) {

      case 'COGNITO_CONFIGURE':
        return configure(state, action);

      case 'COGNITO_AUTHENTICATED':
        return Object.assign({}, state, {
          user: action.user,
          error: '',
          state: _states.CognitoState.AUTHENTICATED
        });

      case 'COGNITO_LOGGING_IN':
        return Object.assign({}, state, {
          state: _states.CognitoState.LOGGING_IN,
          attributes: action.attributes
        });

      case 'COGNITO_LOGIN':
        return Object.assign({}, state, addAttributes({
          error: '',
          creds: action.creds,
          state: _states.CognitoState.LOGGED_IN
        }, action.attributes));

      case 'COGNITO_LOGOUT':
        return Object.assign({}, state, {
          user: null,
          error: '',
          creds: null,
          state: _states.CognitoState.LOGGED_OUT
        });

      case 'COGNITO_LOGIN_FAILURE':
        return Object.assign({}, state, {
          user: action.user,
          state: _states.CognitoState.LOGGED_OUT,
          error: action.error
        });

      case 'COGNITO_LOGIN_MFA_REQUIRED':
        return Object.assign({}, state, {
          user: action.user,
          error: '',
          state: _states.CognitoState.MFA_REQUIRED
        });

      case 'COGNITO_LOGIN_NEW_PASSWORD_REQUIRED':
        return Object.assign({}, state, {
          user: action.user,
          error: '',
          state: _states.CognitoState.NEW_PASSWORD_REQUIRED
        });

      case 'COGNITO_USER_UNCONFIRMED':
        return Object.assign({}, state, {
          user: action.user,
          state: _states.CognitoState.CONFIRMATION_REQUIRED,
          error: action.error
        });

      case 'COGNITO_USER_CONFIRM_FAILED':
        return Object.assign({}, state, {
          user: action.user,
          state: _states.CognitoState.CONFIRMATION_REQUIRED,
          error: action.error
        });

      case 'COGNITO_NEW_PASSWORD_REQUIRED_FAILURE':
        return Object.assign({}, state, {
          error: action.error,
          state: _states.CognitoState.NEW_PASSWORD_REQUIRED
        });

      case 'COGNITO_EMAIL_VERIFICATION_REQUIRED':
        return Object.assign({}, state, addAttributes({
          error: '',
          state: _states.CognitoState.EMAIL_VERIFICATION_REQUIRED
        }, action.attributes));

      case 'COGNITO_EMAIL_VERIFICATION_FAILED':
        return Object.assign({}, state, addAttributes({
          error: action.error,
          state: _states.CognitoState.EMAIL_VERIFICATION_REQUIRED
        }, action.attributes));

      case 'COGNITO_BEGIN_PASSWORD_RESET_FLOW':
        return Object.assign({}, state, {
          error: action.error
        });

      case 'COGNITO_FINISH_PASSWORD_RESET_FLOW':
        return Object.assign({}, state, {
          error: action.error
        });

      // this moves us into the AUTHENTICATED state, potentially causing
      // a number of side-effects. this is so we can re-verify the email
      // address if we have to
      case 'COGNITO_UPDATE_USER_ATTRIBUTES':
        return Object.assign({}, state, {
          attributes: Object.assign({}, state.attributes, action.attributes),
          state: _states.CognitoState.AUTHENTICATED
        });

      default:
        return state;
    }
  };
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.states = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  /** states stored in store.cognito.state */
  var CognitoState = exports.CognitoState = {
    LOGGED_OUT: 'LOGGED_OUT',
    AUTHENTICATED: 'AUTHENTICATED',
    LOGGING_IN: 'LOGGING_IN',
    LOGGED_IN: 'LOGGED_IN',
    NEW_PASSWORD_REQUIRED: 'NEW_PASSWORD_REQUIRED',
    MFA_REQUIRED: 'MFA_REQUIRED',
    EMAIL_VERIFICATION_REQUIRED: 'EMAIL_VERIFICATION_REQUIRED',
    CONFIRMATION_REQUIRED: 'CONFIRMATION_REQUIRED'
  };
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.utils = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  /**
   * Change a user's password
   * @param {object} user - the cognito user object
   * @param {string} oldPassword - the current password
   * @param {string} newPassword - the new password
  */
  var changePassword = function changePassword(user, oldPassword, newPassword) {
    return new Promise(function (resolve, reject) {
      return user.changePassword(oldPassword, newPassword, function (err, result) {
        if (err) {
          reject(err.message);
        } else {
          resolve(result);
        }
      });
    });
  };

  /**
   * builds the federated identity pool login structure
   * @param {string} username - the username of the user
   * @param {string} jwtToken - a JWT Token from the session
   * @param {object} config - the cognito react config object
  */
  var buildLogins = function buildLogins(username, jwtToken, config) {
    var loginDomain = "cognito-idp." + config.region + ".amazonaws.com";
    var loginUrl = loginDomain + "/" + config.userPool;
    var creds = {
      IdentityPoolId: config.identityPool,
      Logins: {},
      LoginId: username };
    creds.Logins[loginUrl] = jwtToken;
    return creds;
  };

  exports.changePassword = changePassword;
  exports.buildLogins = buildLogins;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.App = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = function App(_ref) {
    var children = _ref.children;
    return children;
  };
  App.propTypes = {
    children: _react.PropTypes.any
  };

  exports.default = App;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-cognito'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-cognito'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactCognito);
    global.ChangePasswordForm = mod.exports;
  }
})(this, function (exports, _react, _reactCognito) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var ChangePasswordForm = function (_React$Component) {
    _inherits(ChangePasswordForm, _React$Component);

    function ChangePasswordForm(props) {
      _classCallCheck(this, ChangePasswordForm);

      var _this = _possibleConstructorReturn(this, (ChangePasswordForm.__proto__ || Object.getPrototypeOf(ChangePasswordForm)).call(this, props));

      _this.onSubmit = function (event) {
        var store = _this.context.store;

        var state = store.getState();
        var user = state.cognito.user;
        event.preventDefault();
        (0, _reactCognito.changePassword)(user, _this.state.oldPassword, _this.state.newPassword).then(function () {
          return _this.setState({ error: 'Password changed' });
        }, function (error) {
          return _this.setState({ error: error });
        });
      };

      _this.changeOldPassword = function (event) {
        _this.setState({ oldPassword: event.target.value });
      };

      _this.changeNewPassword = function (event) {
        _this.setState({ newPassword: event.target.value });
      };

      _this.render = function () {
        return _react2.default.createElement(
          'form',
          { onSubmit: _this.onSubmit },
          _react2.default.createElement(
            'div',
            null,
            _this.state.error
          ),
          _react2.default.createElement(
            'label',
            null,
            'Old Password',
            _react2.default.createElement('input', { placeholder: 'old password', onChange: _this.changeOldPassword, required: true })
          ),
          _react2.default.createElement(
            'label',
            null,
            'New Password',
            _react2.default.createElement('input', { placeholder: 'new password', onChange: _this.changeNewPassword, required: true })
          ),
          _react2.default.createElement(
            'button',
            { type: 'submit' },
            'Set new password'
          )
        );
      };

      _this.state = {
        error: '',
        oldPassword: '',
        newPassword: ''
      };
      return _this;
    }

    return ChangePasswordForm;
  }(_react2.default.Component);

  ChangePasswordForm.contextTypes = {
    store: _react.PropTypes.object
  };

  exports.default = ChangePasswordForm;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.ConfirmForm = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var ConfirmForm = function (_React$Component) {
    _inherits(ConfirmForm, _React$Component);

    function ConfirmForm(props) {
      _classCallCheck(this, ConfirmForm);

      var _this = _possibleConstructorReturn(this, (ConfirmForm.__proto__ || Object.getPrototypeOf(ConfirmForm)).call(this, props));

      _this.onSubmit = function (event) {
        event.preventDefault();
        _this.props.onSubmit(_this.state.verificationCode);
      };

      _this.changeVerificationCode = function (event) {
        _this.setState({ verificationCode: event.target.value });
      };

      _this.render = function () {
        return _react2.default.createElement(
          'form',
          { onSubmit: _this.onSubmit },
          _react2.default.createElement(
            'div',
            null,
            _this.props.error
          ),
          _react2.default.createElement(
            'label',
            null,
            'Verification Code',
            _react2.default.createElement('input', { placeholder: 'code', onChange: _this.changeVerificationCode, required: true })
          ),
          _react2.default.createElement(
            'button',
            { type: 'submit' },
            'Submit'
          ),
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: _this.props.onResend },
            'Resend code'
          ),
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: _this.props.onCancel },
            'Cancel'
          )
        );
      };

      _this.state = {
        error: props.error,
        verificationCode: ''
      };
      return _this;
    }

    return ConfirmForm;
  }(_react2.default.Component);

  ConfirmForm.propTypes = {
    onSubmit: _react.PropTypes.func,
    onCancel: _react.PropTypes.func,
    onResend: _react.PropTypes.func,
    error: _react.PropTypes.string
  };

  exports.default = ConfirmForm;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-redux', 'react-router', 'react-cognito', './LogoutButton', './LoginForm', './EmailVerificationForm', './NewPasswordRequiredForm', './ConfirmForm'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-redux'), require('react-router'), require('react-cognito'), require('./LogoutButton'), require('./LoginForm'), require('./EmailVerificationForm'), require('./NewPasswordRequiredForm'), require('./ConfirmForm'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactRedux, global.reactRouter, global.reactCognito, global.LogoutButton, global.LoginForm, global.EmailVerificationForm, global.NewPasswordRequiredForm, global.ConfirmForm);
    global.Dashboard = mod.exports;
  }
})(this, function (exports, _react, _reactRedux, _reactRouter, _reactCognito, _LogoutButton, _LoginForm, _EmailVerificationForm, _NewPasswordRequiredForm, _ConfirmForm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _LogoutButton2 = _interopRequireDefault(_LogoutButton);

  var _LoginForm2 = _interopRequireDefault(_LoginForm);

  var _EmailVerificationForm2 = _interopRequireDefault(_EmailVerificationForm);

  var _NewPasswordRequiredForm2 = _interopRequireDefault(_NewPasswordRequiredForm);

  var _ConfirmForm2 = _interopRequireDefault(_ConfirmForm);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var loggedInPage = function loggedInPage(user, attributes) {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'logged in as ',
        user.getUsername()
      ),
      _react2.default.createElement(
        'ul',
        null,
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactCognito.Logout,
            null,
            _react2.default.createElement(_LogoutButton2.default, null)
          )
        ),
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactRouter.Link,
            { to: '/change_password' },
            'Change password'
          )
        ),
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactRouter.Link,
            { to: '/change_email' },
            'Change email address'
          )
        )
      ),
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'p',
          null,
          'Attributes'
        ),
        _react2.default.createElement(
          'table',
          null,
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'td',
                null,
                'Name'
              ),
              _react2.default.createElement(
                'td',
                null,
                'Value'
              )
            )
          ),
          _react2.default.createElement(
            'tbody',
            null,
            Object.keys(attributes).map(function (name) {
              return _react2.default.createElement(
                'tr',
                { key: name },
                _react2.default.createElement(
                  'td',
                  null,
                  name
                ),
                _react2.default.createElement(
                  'td',
                  null,
                  attributes[name]
                )
              );
            })
          )
        )
      )
    );
  };

  var loggedOutPage = function loggedOutPage() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'not logged in'
      ),
      _react2.default.createElement(
        _reactCognito.Login,
        null,
        _react2.default.createElement(_LoginForm2.default, null)
      ),
      _react2.default.createElement(
        'ul',
        null,
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactRouter.Link,
            { to: '/register' },
            'Register'
          )
        ),
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactRouter.Link,
            { to: '/reset' },
            'Password reset'
          )
        )
      )
    );
  };

  var newPasswordPage = function newPasswordPage() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'New password required, since this is your first login'
      ),
      _react2.default.createElement(
        _reactCognito.NewPasswordRequired,
        null,
        _react2.default.createElement(_NewPasswordRequiredForm2.default, null)
      )
    );
  };

  var emailVerificationPage = function emailVerificationPage() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'You must verify your email address.  Please check your email for a code'
      ),
      _react2.default.createElement(
        _reactCognito.EmailVerification,
        null,
        _react2.default.createElement(_EmailVerificationForm2.default, null)
      )
    );
  };

  var confirmForm = function confirmForm() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'A confirmation code has been sent to your email address'
      ),
      _react2.default.createElement(
        _reactCognito.Confirm,
        null,
        _react2.default.createElement(_ConfirmForm2.default, null)
      ),
      _react2.default.createElement(
        _reactRouter.Link,
        { to: '/' },
        'Home'
      )
    );
  };

  var mfaPage = function mfaPage() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'You need to enter an MFA, but this library does not yet support them.'
      )
    );
  };

  var BaseDashboard = function BaseDashboard(_ref) {
    var state = _ref.state,
        user = _ref.user,
        attributes = _ref.attributes;

    switch (state) {
      case _reactCognito.CognitoState.LOGGED_IN:
        return loggedInPage(user, attributes);
      case _reactCognito.CognitoState.AUTHENTICATED:
      case _reactCognito.CognitoState.LOGGING_IN:
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('img', { src: 'ajax-loader.gif' })
        );
      case _reactCognito.CognitoState.LOGGED_OUT:
      case _reactCognito.CognitoState.LOGIN_FAILURE:
        return loggedOutPage();
      case _reactCognito.CognitoState.MFA_REQUIRED:
        return mfaPage();
      case _reactCognito.CognitoState.NEW_PASSWORD_REQUIRED:
        return newPasswordPage();
      case _reactCognito.CognitoState.EMAIL_VERIFICATION_REQUIRED:
        return emailVerificationPage();
      case _reactCognito.CognitoState.CONFIRMATION_REQUIRED:
        return confirmForm();
      default:
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'p',
            null,
            'Unrecognised cognito state'
          )
        );
    }
  };
  BaseDashboard.propTypes = {
    user: _react.PropTypes.object,
    attributes: _react.PropTypes.object,
    state: _react.PropTypes.string
  };

  var mapStateToProps = function mapStateToProps(state) {
    return {
      state: state.cognito.state,
      user: state.cognito.user,
      attributes: state.cognito.attributes
    };
  };

  var Dashboard = (0, _reactRedux.connect)(mapStateToProps, null)(BaseDashboard);

  exports.default = Dashboard;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.EmailVerificationForm = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var EmailVerificationForm = function (_React$Component) {
    _inherits(EmailVerificationForm, _React$Component);

    function EmailVerificationForm(props) {
      _classCallCheck(this, EmailVerificationForm);

      var _this = _possibleConstructorReturn(this, (EmailVerificationForm.__proto__ || Object.getPrototypeOf(EmailVerificationForm)).call(this, props));

      _this.onSubmit = function (event) {
        event.preventDefault();
        _this.props.onSubmit(_this.state.verificationCode);
      };

      _this.changeVerificationCode = function (event) {
        _this.setState({ verificationCode: event.target.value });
      };

      _this.render = function () {
        return _react2.default.createElement(
          'form',
          { onSubmit: _this.onSubmit },
          _react2.default.createElement(
            'div',
            null,
            _this.props.error
          ),
          _react2.default.createElement(
            'label',
            null,
            'Verification Code',
            _react2.default.createElement('input', { placeholder: 'code', onChange: _this.changeVerificationCode, required: true })
          ),
          _react2.default.createElement(
            'button',
            { type: 'submit' },
            'Submit'
          ),
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: _this.props.onCancel },
            'Cancel'
          )
        );
      };

      _this.state = {
        error: props.error,
        verificationCode: ''
      };
      return _this;
    }

    return EmailVerificationForm;
  }(_react2.default.Component);

  EmailVerificationForm.propTypes = {
    onSubmit: _react.PropTypes.func,
    onCancel: _react.PropTypes.func,
    error: _react.PropTypes.string
  };

  exports.default = EmailVerificationForm;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.LoginForm = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var LoginForm = function (_React$Component) {
    _inherits(LoginForm, _React$Component);

    function LoginForm(props) {
      _classCallCheck(this, LoginForm);

      var _this = _possibleConstructorReturn(this, (LoginForm.__proto__ || Object.getPrototypeOf(LoginForm)).call(this, props));

      _this.onSubmit = function (event) {
        event.preventDefault();
        _this.props.onSubmit(_this.state.username, _this.state.password);
      };

      _this.changeUsername = function (event) {
        _this.setState({ username: event.target.value });
      };

      _this.changePassword = function (event) {
        _this.setState({ password: event.target.value });
      };

      _this.render = function () {
        return _react2.default.createElement(
          'form',
          { onSubmit: _this.onSubmit },
          _react2.default.createElement(
            'div',
            null,
            _this.props.error
          ),
          _react2.default.createElement(
            'label',
            null,
            'Username',
            _react2.default.createElement('input', { placeholder: 'Username', value: _this.state.username, onChange: _this.changeUsername, required: true })
          ),
          _react2.default.createElement(
            'label',
            null,
            'Password',
            _react2.default.createElement('input', { placeholder: 'Password', onChange: _this.changePassword, type: 'password', required: true })
          ),
          _react2.default.createElement(
            'button',
            { type: 'submit' },
            'Sign in'
          )
        );
      };

      _this.state = {
        username: props.username,
        error: props.error,
        password: ''
      };
      return _this;
    }

    return LoginForm;
  }(_react2.default.Component);

  LoginForm.propTypes = {
    onSubmit: _react.PropTypes.func,
    username: _react.PropTypes.string,
    error: _react.PropTypes.string
  };

  exports.default = LoginForm;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.LogoutButton = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var LogoutButton = function LogoutButton(_ref) {
    var onClick = _ref.onClick;
    return _react2.default.createElement(
      'button',
      { onClick: onClick },
      'Log out'
    );
  };
  LogoutButton.propTypes = {
    onClick: _react.PropTypes.func
  };

  exports.default = LogoutButton;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.NewPasswordRequiredForm = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var NewPasswordRequiredForm = function (_React$Component) {
    _inherits(NewPasswordRequiredForm, _React$Component);

    function NewPasswordRequiredForm(props) {
      _classCallCheck(this, NewPasswordRequiredForm);

      var _this = _possibleConstructorReturn(this, (NewPasswordRequiredForm.__proto__ || Object.getPrototypeOf(NewPasswordRequiredForm)).call(this, props));

      _this.onSubmit = function (event) {
        event.preventDefault();
        _this.props.onSubmit(_this.state.password);
      };

      _this.changePassword = function (event) {
        _this.setState({ password: event.target.value });
      };

      _this.render = function () {
        return _react2.default.createElement(
          'form',
          { onSubmit: _this.onSubmit },
          _react2.default.createElement(
            'div',
            null,
            _this.props.error
          ),
          _react2.default.createElement(
            'label',
            null,
            'Password',
            _react2.default.createElement('input', { placeholder: 'new password', onChange: _this.changePassword, required: true })
          ),
          _react2.default.createElement(
            'button',
            { type: 'submit' },
            'Set new password'
          )
        );
      };

      _this.state = {
        error: props.error,
        password: ''
      };
      return _this;
    }

    return NewPasswordRequiredForm;
  }(_react2.default.Component);

  NewPasswordRequiredForm.propTypes = {
    onSubmit: _react.PropTypes.func,
    error: _react.PropTypes.string
  };

  exports.default = NewPasswordRequiredForm;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-router'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-router'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactRouter);
    global.PasswordResetForm = mod.exports;
  }
})(this, function (exports, _react, _reactRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var PasswordResetForm = function (_React$Component) {
    _inherits(PasswordResetForm, _React$Component);

    function PasswordResetForm(props) {
      _classCallCheck(this, PasswordResetForm);

      var _this = _possibleConstructorReturn(this, (PasswordResetForm.__proto__ || Object.getPrototypeOf(PasswordResetForm)).call(this, props));

      _this.onSubmit = function (event) {
        event.preventDefault();
        _this.props.setPassword(_this.state.username, _this.state.code, _this.state.password);
      };

      _this.sendVerificationCode = function (event) {
        event.preventDefault();
        _this.props.sendVerificationCode(_this.state.username);
      };

      _this.changePassword = function (event) {
        _this.setState({ password: event.target.value });
      };

      _this.changeCode = function (event) {
        _this.setState({ code: event.target.value });
      };

      _this.changeUsername = function (event) {
        _this.setState({ username: event.target.value });
      };

      _this.render = function () {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            null,
            _this.props.error
          ),
          _react2.default.createElement(
            'form',
            { onSubmit: _this.sendVerificationCode },
            _react2.default.createElement(
              'label',
              null,
              'Username',
              _react2.default.createElement('input', { type: 'text', placeholder: 'username', value: _this.state.username, onChange: _this.changeUsername, required: true })
            ),
            _react2.default.createElement(
              'button',
              { type: 'submit' },
              'Send verification code'
            )
          ),
          _react2.default.createElement(
            'form',
            { onSubmit: _this.onSubmit },
            _react2.default.createElement(
              'label',
              null,
              'Verification code',
              _react2.default.createElement('input', { placeholder: 'code', onChange: _this.changeCode, required: true })
            ),
            _react2.default.createElement(
              'label',
              null,
              'Password',
              _react2.default.createElement('input', { placeholder: 'new password', onChange: _this.changePassword, required: true })
            ),
            _react2.default.createElement(
              'button',
              { type: 'submit' },
              'Set new password'
            )
          ),
          _react2.default.createElement(
            _reactRouter.Link,
            { to: '/' },
            'Home'
          )
        );
      };

      _this.state = {
        username: props.username,
        code: '',
        password: ''
      };
      return _this;
    }

    return PasswordResetForm;
  }(_react2.default.Component);

  PasswordResetForm.propTypes = {
    error: _react.PropTypes.string,
    username: _react.PropTypes.string,
    sendVerificationCode: _react.PropTypes.func,
    setPassword: _react.PropTypes.func
  };
  exports.default = PasswordResetForm;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-cognito'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-cognito'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactCognito);
    global.RegisterForm = mod.exports;
  }
})(this, function (exports, _react, _reactCognito) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var RegisterForm = function (_React$Component) {
    _inherits(RegisterForm, _React$Component);

    function RegisterForm(props) {
      _classCallCheck(this, RegisterForm);

      var _this = _possibleConstructorReturn(this, (RegisterForm.__proto__ || Object.getPrototypeOf(RegisterForm)).call(this, props));

      _this.onSubmit = function (event) {
        var _this$context = _this.context,
            store = _this$context.store,
            router = _this$context.router;

        var state = store.getState();
        var userPool = state.cognito.userPool;
        var config = state.cognito.config;
        event.preventDefault();
        (0, _reactCognito.registerUser)(userPool, config, _this.state.username, _this.state.password, {
          email: _this.state.email
        }).then(function (action) {
          store.dispatch(action);
          router.push('/');
        }, function (error) {
          return _this.setState({ error: error });
        });
      };

      _this.changeUsername = function (event) {
        _this.setState({ username: event.target.value });
      };

      _this.changePassword = function (event) {
        _this.setState({ password: event.target.value });
      };

      _this.changeEmail = function (event) {
        _this.setState({ email: event.target.value });
      };

      _this.render = function () {
        return _react2.default.createElement(
          'form',
          { onSubmit: _this.onSubmit },
          _react2.default.createElement(
            'div',
            null,
            _this.state.error
          ),
          _react2.default.createElement(
            'label',
            null,
            'Username',
            _react2.default.createElement('input', { placeholder: 'username', onChange: _this.changeUsername, required: true })
          ),
          _react2.default.createElement(
            'label',
            null,
            'Password',
            _react2.default.createElement('input', { placeholder: 'password', onChange: _this.changePassword, required: true })
          ),
          _react2.default.createElement(
            'label',
            null,
            'Email Address',
            _react2.default.createElement('input', { placeholder: 'email', type: 'email', onChange: _this.changeEmail, required: true })
          ),
          _react2.default.createElement(
            'button',
            { type: 'submit' },
            'Register'
          )
        );
      };

      _this.state = {
        error: '',
        username: '',
        password: '',
        email: ''
      };
      return _this;
    }

    return RegisterForm;
  }(_react2.default.Component);

  RegisterForm.contextTypes = {
    store: _react.PropTypes.object,
    router: _react.PropTypes.object
  };

  exports.default = RegisterForm;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-cognito'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-cognito'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactCognito);
    global.UpdateEmailForm = mod.exports;
  }
})(this, function (exports, _react, _reactCognito) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var UpdateEmailForm = function (_React$Component) {
    _inherits(UpdateEmailForm, _React$Component);

    function UpdateEmailForm(props) {
      _classCallCheck(this, UpdateEmailForm);

      var _this = _possibleConstructorReturn(this, (UpdateEmailForm.__proto__ || Object.getPrototypeOf(UpdateEmailForm)).call(this, props));

      _this.componentWillMount = function () {
        var store = _this.context.store;

        var state = store.getState();
        _this.setState({ email: state.cognito.attributes.email });
      };

      _this.onSubmit = function (event) {
        var store = _this.context.store;

        var state = store.getState();
        var user = state.cognito.user;
        var config = state.cognito.config;
        event.preventDefault();
        (0, _reactCognito.updateAttributes)(user, {
          email: _this.state.email
        }, config).then(function (action) {
          store.dispatch(action);
          _this.setState({ error: 'email changed' });
        }, function (error) {
          return _this.setState({ error: error });
        });
      };

      _this.changeEmail = function (event) {
        _this.setState({ email: event.target.value });
      };

      _this.render = function () {
        return _react2.default.createElement(
          'form',
          { onSubmit: _this.onSubmit },
          _react2.default.createElement(
            'div',
            null,
            _this.state.error
          ),
          _react2.default.createElement(
            'label',
            null,
            'Email address',
            _react2.default.createElement('input', { value: _this.state.email, onChange: _this.changeEmail, required: true })
          ),
          _react2.default.createElement(
            'button',
            { type: 'submit' },
            'Update'
          )
        );
      };

      _this.state = {
        error: '',
        email: ''
      };
      return _this;
    }

    return UpdateEmailForm;
  }(_react2.default.Component);

  UpdateEmailForm.contextTypes = {
    store: _react.PropTypes.object
  };

  exports.default = UpdateEmailForm;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['react', 'react-dom', 'react-router', 'react-cognito', 'react-redux', 'redux', './App', './Dashboard', './ChangePasswordForm', './PasswordResetForm', './UpdateEmailForm', './RegisterForm', '../config.json'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('react'), require('react-dom'), require('react-router'), require('react-cognito'), require('react-redux'), require('redux'), require('./App'), require('./Dashboard'), require('./ChangePasswordForm'), require('./PasswordResetForm'), require('./UpdateEmailForm'), require('./RegisterForm'), require('../config.json'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.react, global.reactDom, global.reactRouter, global.reactCognito, global.reactRedux, global.redux, global.App, global.Dashboard, global.ChangePasswordForm, global.PasswordResetForm, global.UpdateEmailForm, global.RegisterForm, global.config);
    global.index = mod.exports;
  }
})(this, function (_react, _reactDom, _reactRouter, _reactCognito, _reactRedux, _redux, _App, _Dashboard, _ChangePasswordForm, _PasswordResetForm, _UpdateEmailForm, _RegisterForm, _config) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _App2 = _interopRequireDefault(_App);

  var _Dashboard2 = _interopRequireDefault(_Dashboard);

  var _ChangePasswordForm2 = _interopRequireDefault(_ChangePasswordForm);

  var _PasswordResetForm2 = _interopRequireDefault(_PasswordResetForm);

  var _UpdateEmailForm2 = _interopRequireDefault(_UpdateEmailForm);

  var _RegisterForm2 = _interopRequireDefault(_RegisterForm);

  var _config2 = _interopRequireDefault(_config);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var reducers = (0, _redux.combineReducers)({
    cognito: _reactCognito.cognito
  });

  var store = (0, _redux.createStore)(reducers,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

  (0, _reactCognito.setupCognito)(store, _config2.default);

  // this attempts to retrieve the user from local storage and establish
  // a new session for them
  var state = store.getState();

  var guard = (0, _reactCognito.createGuard)(store, '/forbidden');

  var changePassword = function changePassword() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_ChangePasswordForm2.default, null),
      _react2.default.createElement(
        _reactRouter.Link,
        { to: '/' },
        'Home'
      )
    );
  };

  var updateEmail = function updateEmail() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_UpdateEmailForm2.default, null),
      _react2.default.createElement(
        _reactRouter.Link,
        { to: '/' },
        'Home'
      )
    );
  };

  var passwordReset = function passwordReset() {
    return _react2.default.createElement(
      _reactCognito.PasswordReset,
      null,
      _react2.default.createElement(_PasswordResetForm2.default, null)
    );
  };

  var registerForm = function registerForm() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'Complete this form'
      ),
      _react2.default.createElement(_RegisterForm2.default, null),
      _react2.default.createElement(
        _reactRouter.Link,
        { to: '/' },
        'Home'
      )
    );
  };

  var render = function render() {
    _reactDom2.default.render(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        _reactRouter.Router,
        { history: _reactRouter.browserHistory },
        _react2.default.createElement(
          _reactRouter.Route,
          { path: '/', component: _App2.default },
          _react2.default.createElement(_reactRouter.IndexRoute, { component: _Dashboard2.default }),
          _react2.default.createElement(_reactRouter.Route, {
            path: '/change_password',
            component: changePassword,
            onEnter: guard()
          }),
          _react2.default.createElement(_reactRouter.Route, {
            path: '/reset',
            component: passwordReset,
            onEnter: guard({ loggedIn: false })
          }),
          _react2.default.createElement(_reactRouter.Route, {
            path: '/change_email',
            component: updateEmail,
            onEnter: guard()
          }),
          _react2.default.createElement(_reactRouter.Route, {
            path: '/register',
            component: registerForm,
            onEnter: guard({ loggedIn: false })
          })
        )
      )
    ), document.getElementById('app'));
  };

  // we defer rendering the application until we've fetched the user
  // from local storage and potentially updated their local state
  (0, _reactCognito.performLogin)(state.cognito.user, state.cognito.config).then(store.dispatch, render).then(render);
});
