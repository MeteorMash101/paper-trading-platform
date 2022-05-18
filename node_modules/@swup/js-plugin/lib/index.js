'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('@swup/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JsPlugin = function (_Plugin) {
	_inherits(JsPlugin, _Plugin);

	function JsPlugin() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, JsPlugin);

		var _this = _possibleConstructorReturn(this, (JsPlugin.__proto__ || Object.getPrototypeOf(JsPlugin)).call(this));

		_this.name = 'JsPlugin';
		_this.currentAnimation = null;

		_this.getAnimationPromises = function (type) {
			var animationIndex = _this.getAnimationIndex(type);
			return [_this.createAnimationPromise(animationIndex, type)];
		};

		_this.createAnimationPromise = function (index, type) {
			var currentTransitionRoutes = _this.swup.transition;
			var animation = _this.options[index];

			return new Promise(function (resolve) {
				animation[type](resolve, {
					paramsFrom: animation.regFrom.exec(currentTransitionRoutes.from),
					paramsTo: animation.regTo.exec(currentTransitionRoutes.to),
					transition: currentTransitionRoutes,
					from: animation.from,
					to: animation.to
				});
			});
		};

		_this.getAnimationIndex = function (type) {
			// already saved from out animation
			if (type === 'in') {
				return _this.currentAnimation;
			}

			var animations = _this.options;
			var animationIndex = 0;
			var topRating = 0;

			Object.keys(animations).forEach(function (key, index) {
				var animation = animations[key];
				var rating = _this.rateAnimation(animation);

				if (rating >= topRating) {
					animationIndex = index;
					topRating = rating;
				}
			});

			_this.currentAnimation = animationIndex;
			return _this.currentAnimation;
		};

		_this.rateAnimation = function (animation) {
			var currentTransitionRoutes = _this.swup.transition;
			var rating = 0;

			// run regex
			var fromMatched = animation.regFrom.test(currentTransitionRoutes.from);
			var toMatched = animation.regTo.test(currentTransitionRoutes.to);

			// check if regex passes
			rating += fromMatched ? 1 : 0;
			rating += toMatched ? 1 : 0;

			// beat all other if custom parameter fits
			rating += fromMatched && animation.to === currentTransitionRoutes.custom ? 2 : 0;

			return rating;
		};

		var defaultOptions = [{
			from: '(.*)',
			to: '(.*)',
			out: function out(next) {
				return next();
			},
			in: function _in(next) {
				return next();
			}
		}];

		_this.options = _extends({}, defaultOptions, options);

		_this.generateRegex();
		return _this;
	}

	_createClass(JsPlugin, [{
		key: 'mount',
		value: function mount() {
			var swup = this.swup;

			swup._getAnimationPromises = swup.getAnimationPromises;
			swup.getAnimationPromises = this.getAnimationPromises;
		}
	}, {
		key: 'unmount',
		value: function unmount() {
			swup.getAnimationPromises = swup._getAnimationPromises;
			swup._getAnimationPromises = null;
		}
	}, {
		key: 'generateRegex',
		value: function generateRegex() {
			var _this2 = this;

			var isRegex = function isRegex(str) {
				return str instanceof RegExp;
			};

			this.options = Object.keys(this.options).map(function (key) {
				return _extends({}, _this2.options[key], {
					regFrom: isRegex(_this2.options[key].from) ? _this2.options[key].from : (0, _pathToRegexp2.default)(_this2.options[key].from),
					regTo: isRegex(_this2.options[key].to) ? _this2.options[key].to : (0, _pathToRegexp2.default)(_this2.options[key].to)
				});
			});
		}
	}]);

	return JsPlugin;
}(_plugin2.default);

exports.default = JsPlugin;