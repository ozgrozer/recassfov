'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _objectToUrlEncoded = require('./objectToUrlEncoded');

var _objectToUrlEncoded2 = _interopRequireDefault(_objectToUrlEncoded);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Context = _react2.default.createContext();

var Provider = function (_React$Component) {
  _inherits(Provider, _React$Component);

  function Provider() {
    _classCallCheck(this, Provider);

    var _this = _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).call(this));

    _this.state = {
      formItems: {},
      totalValidations: 0,
      classNames: {
        invalidInput: 'is-invalid',
        invalidFeedback: 'invalid-feedback'
      }
    };
    return _this;
  }

  _createClass(Provider, [{
    key: 'setClassNames',
    value: function setClassNames(classNames) {
      this.setState({ classNames: classNames });
    }
  }, {
    key: 'setFormItem',
    value: function setFormItem(item) {
      var formItems = this.state.formItems;

      formItems[item.name] = {
        value: item.value || '',
        validations: item.validations || [],
        invalidFeedback: item.validations ? item.validations[0].invalidFeedback : '',
        className: ''
      };

      this.setState({ formItems: formItems });

      this.setState(function (prevState) {
        return {
          totalValidations: prevState.totalValidations + (item.validations ? item.validations.length : 0)
        };
      });
    }
  }, {
    key: 'cleanFormItems',
    value: function cleanFormItems() {
      var formItems = this.state.formItems;

      Object.keys(formItems).map(function (item) {
        formItems[item].value = '';
      });

      this.setState({ formItems: formItems });
    }
  }, {
    key: 'handleInput',
    value: function handleInput(onChange, e) {
      if (onChange) onChange(e);

      var item = e.target;
      var formItems = this.state.formItems;

      if (item.type === 'checkbox') {
        formItems[item.name].value = !formItems[item.name].value;
      } else {
        formItems[item.name].value = item.value;
      }

      this.setState({ formItems: formItems });
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(_onSubmit, validFormBeforePost, invalidFormBeforePost, validFormAfterPost, invalidFormAfterPost, postUrl, headers, e) {
      var _this2 = this;

      e.preventDefault();

      if (_onSubmit) _onSubmit(e);

      var formItems = this.state.formItems;
      var formItemsValues = {};
      var howManyOfFormItemsAreValidated = 0;

      Object.keys(formItems).map(function (itemName) {
        var item = formItems[itemName];
        formItemsValues[itemName] = item.value;
        var validationsLength = item.validations.length;
        var validated = 0;

        for (var i = 0; i < validationsLength; i++) {
          var validation = item.validations[i];
          var validate = _validator2.default[validation.rule](item.value, validation.args);

          if (validate) {
            validated++;
            howManyOfFormItemsAreValidated++;
          }

          item.className = validationsLength === validated ? '' : ' ' + _this2.state.classNames.invalidInput;

          if (!validate) {
            item.invalidFeedback = validation.invalidFeedback;
            continue;
          }
        }
      });

      this.setState({ formItems: formItems });

      if (howManyOfFormItemsAreValidated === this.state.totalValidations) {
        if (validFormBeforePost) {
          validFormBeforePost({
            formItems: formItemsValues
          });
        }

        if (postUrl) {
          var _formItems = Object.keys(formItems).reduce(function (previous, current) {
            previous[current] = formItems[current].value;
            return previous;
          }, {});

          headers = (typeof headers === 'undefined' ? 'undefined' : _typeof(headers)) === 'object' ? headers : {};
          headers['Content-Type'] = headers.hasOwnProperty('Content-Type') ? headers['Content-Type'] : 'application/x-www-form-urlencoded';
          var data = headers['Content-Type'] === 'application/x-www-form-urlencoded' ? (0, _objectToUrlEncoded2.default)(_formItems) : _formItems;

          (0, _axios2.default)({
            url: postUrl,
            method: 'post',
            data: data,
            headers: headers
          }).then(function (res) {
            var validations = res.data.validations || {};

            if (Object.keys(validations).length) {
              if (invalidFormAfterPost) {
                invalidFormAfterPost({
                  formItems: formItemsValues,
                  ajaxResult: res.data
                });
              }

              Object.keys(validations).map(function (itemName) {
                formItems[itemName].invalidFeedback = validations[itemName];
                formItems[itemName].className = ' ' + _this2.state.classNames.invalidInput;
              });

              _this2.setState({ formItems: formItems });
            } else {
              if (validFormAfterPost) {
                validFormAfterPost({
                  formItems: formItemsValues,
                  ajaxResult: res.data,
                  cleanFormItems: _this2.cleanFormItems.bind(_this2)
                });
              }
            }
          }).catch(function (err) {
            console.log(err);
          });
        }
      } else {
        if (invalidFormBeforePost) {
          invalidFormBeforePost({
            formItems: formItemsValues
          });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var store = {
        state: this.state,
        setClassNames: this.setClassNames.bind(this),
        setFormItem: this.setFormItem.bind(this),
        handleInput: this.handleInput.bind(this),
        onSubmit: this.onSubmit.bind(this)
      };

      return _react2.default.createElement(
        Context.Provider,
        { value: store },
        this.props.children
      );
    }
  }]);

  return Provider;
}(_react2.default.Component);

var Form = function (_React$Component2) {
  _inherits(Form, _React$Component2);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this3 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    if (_this3.props.classNames) {
      _this3.props.store.setClassNames(_this3.props.classNames);
    }
    return _this3;
  }

  _createClass(Form, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          store = _props.store,
          onSubmit = _props.onSubmit,
          validFormBeforePost = _props.validFormBeforePost,
          invalidFormBeforePost = _props.invalidFormBeforePost,
          validFormAfterPost = _props.validFormAfterPost,
          invalidFormAfterPost = _props.invalidFormAfterPost,
          postUrl = _props.postUrl,
          headers = _props.headers,
          classNames = _props.classNames,
          otherProps = _objectWithoutProperties(_props, ['store', 'onSubmit', 'validFormBeforePost', 'invalidFormBeforePost', 'validFormAfterPost', 'invalidFormAfterPost', 'postUrl', 'headers', 'classNames']);

      return _react2.default.createElement(
        'form',
        _extends({}, otherProps, {
          noValidate: true,
          onSubmit: this.props.store.onSubmit.bind(this, onSubmit, validFormBeforePost, invalidFormBeforePost, validFormAfterPost, invalidFormAfterPost, postUrl, headers) }),
        this.props.children
      );
    }
  }]);

  return Form;
}(_react2.default.Component);

var Input = function (_React$Component3) {
  _inherits(Input, _React$Component3);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this4 = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props));

    _this4.props.store.setFormItem(_this4.props);
    return _this4;
  }

  _createClass(Input, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          store = _props2.store,
          validations = _props2.validations,
          className = _props2.className,
          onChange = _props2.onChange,
          otherProps = _objectWithoutProperties(_props2, ['store', 'validations', 'className', 'onChange']);

      var thisItem = store.state.formItems[this.props.name];

      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement('input', _extends({}, otherProps, {
          onChange: store.handleInput.bind(this, onChange),
          className: '' + (className || '') + thisItem.className,
          value: thisItem.value })),
        _react2.default.createElement(
          'div',
          { className: store.state.classNames.invalidFeedback },
          thisItem.invalidFeedback
        )
      );
    }
  }]);

  return Input;
}(_react2.default.Component);

var Textarea = function (_React$Component4) {
  _inherits(Textarea, _React$Component4);

  function Textarea(props) {
    _classCallCheck(this, Textarea);

    var _this5 = _possibleConstructorReturn(this, (Textarea.__proto__ || Object.getPrototypeOf(Textarea)).call(this, props));

    _this5.props.store.setFormItem(_this5.props);
    return _this5;
  }

  _createClass(Textarea, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          store = _props3.store,
          validations = _props3.validations,
          className = _props3.className,
          onChange = _props3.onChange,
          otherProps = _objectWithoutProperties(_props3, ['store', 'validations', 'className', 'onChange']);

      var thisItem = store.state.formItems[this.props.name];

      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          'textarea',
          _extends({}, otherProps, {
            onChange: store.handleInput.bind(this, onChange),
            className: '' + (className || '') + thisItem.className,
            value: thisItem.value }),
          this.props.children
        ),
        _react2.default.createElement(
          'div',
          { className: store.state.classNames.invalidFeedback },
          thisItem.invalidFeedback
        )
      );
    }
  }]);

  return Textarea;
}(_react2.default.Component);

var Select = function (_React$Component5) {
  _inherits(Select, _React$Component5);

  function Select(props) {
    _classCallCheck(this, Select);

    var _this6 = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    var value = _this6.props.children ? { value: _this6.props.children[0].props.value } : null;
    _this6.props.store.setFormItem(_extends({}, _this6.props, value));
    return _this6;
  }

  _createClass(Select, [{
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          store = _props4.store,
          validations = _props4.validations,
          children = _props4.children,
          className = _props4.className,
          onChange = _props4.onChange,
          otherProps = _objectWithoutProperties(_props4, ['store', 'validations', 'children', 'className', 'onChange']);

      var thisItem = store.state.formItems[this.props.name];

      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          'select',
          _extends({}, otherProps, {
            onChange: store.handleInput.bind(this, onChange),
            className: '' + (className || '') + thisItem.className }),
          children
        ),
        _react2.default.createElement(
          'div',
          { className: store.state.classNames.invalidFeedback },
          thisItem.invalidFeedback
        )
      );
    }
  }]);

  return Select;
}(_react2.default.Component);

var connectProvider = function connectProvider(Component) {
  return function (props) {
    return _react2.default.createElement(
      Provider,
      null,
      _react2.default.createElement(
        Context.Consumer,
        null,
        function (store) {
          return _react2.default.createElement(Component, _extends({}, props, { store: store }));
        }
      )
    );
  };
};

var connectConsumer = function connectConsumer(Component) {
  return function (props) {
    return _react2.default.createElement(
      Context.Consumer,
      null,
      function (store) {
        return _react2.default.createElement(Component, _extends({}, props, { store: store }));
      }
    );
  };
};

module.exports.Form = connectProvider(Form);
module.exports.Input = connectConsumer(Input);
module.exports.Textarea = connectConsumer(Textarea);
module.exports.Select = connectConsumer(Select);

