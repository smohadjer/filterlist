/*
 * @name          filterList.js
 * @version       3.1.0
 * @lastmodified  2018-02-06
 * @author        Saeid Mohadjer
 * @repo		  https://github.com/smohadjer/filterList
 *
 * Licensed under the MIT License
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FilterList = function () {
	function FilterList(options) {
		_classCallCheck(this, FilterList);

		this.urlIsUpdatable = options.urlIsUpdatable === undefined ? false : options.urlIsUpdatable;
		this.element = options.element;
		this.filters = [];
		this.filterNames = this.element.getAttribute('data-filter-names').split(' ');
		this.initCallback = options.initCallback;
		this.filtersCallback = options.filtersCallback;
		this.url = window.location.href;
		this.lastClass = options.lastClass || 'last';
		this.hiddenClass = options.hiddenClass || 'hidden';

		this.setEventHandlers();
		this.setDefaultFilters(this.filterNames);
		this.updateFiltersfromURL();
		this.updateBrowserHistory();

		if (typeof this.initCallback === 'function') {
			this.initCallback();
		}

		this.applyFilters();
	}

	_createClass(FilterList, [{
		key: 'updateBrowserHistory',
		value: function updateBrowserHistory() {
			if (this.urlIsUpdatable && window.history && window.history.pushState) {
				var state = {};
				state.filters = this.filters.slice();
				history.replaceState(state, document.title, this.url);
			}
		}
	}, {
		key: 'setDefaultFilters',
		value: function setDefaultFilters(filterNames) {
			var _this = this;

			filterNames.forEach(function (filterName, i) {
				//const ignoreValue = this.element.getAttribute(`data-filter-${filterName}-ignore`);
				var ignoreValue = _this.getFilterIgnoreValue(filterName);
				var filterValue = _this.getFilterValue(filterName);

				console.log('default filters: ', filterName, filterValue, ignoreValue);

				_this.filters.push({
					name: filterName,
					value: filterValue,
					ignoreValue: ignoreValue
				});
			});
		}
	}, {
		key: 'getFilterIgnoreValue',
		value: function getFilterIgnoreValue(filterName) {
			var filterElement = document.querySelector('[name="' + filterName + '"]');
			var ignoreValue = void 0;

			if (filterElement) {
				if (filterElement.tagName === 'SELECT') {
					ignoreValue = filterElement.getAttribute('data-ignore');
				}
			} else {
				console.warn('No filter with name ' + filterName + ' was found in markup!');
			}

			return ignoreValue;
		}
	}, {
		key: 'getFilterValue',
		value: function getFilterValue(filterName) {
			var filterElement = document.querySelector('[name="' + filterName + '"]');
			var filterValue = void 0;

			if (filterElement) {
				if (filterElement.getAttribute('type') === 'checkbox') {
					filterValue = filterElement.checked ? filterElement.value : undefined;
				} else {
					filterValue = filterElement.value;
				}
			} else {
				console.warn('No filter with name ' + filterName + ' was found in markup!');
			}

			return filterValue;
		}
	}, {
		key: 'updateFiltersfromURL',
		value: function updateFiltersfromURL() {
			var _this2 = this;

			this.filterNames.forEach(function (filterName, i) {
				var newValue = _this2.getUrlParameter(filterName);

				if (newValue) {
					_this2.updateFilters({
						name: filterName,
						value: newValue
					}, true);
				}
			});
		}
	}, {
		key: 'updateFilters',
		value: function updateFilters(updatedFilter, triggerEvent) {
			var filter = this.filters.find(function (filter) {
				return filter.name === updatedFilter.name;
			});

			if (filter && filter.value !== updatedFilter.value) {
				filter.value = updatedFilter.value;
				this.applyFilters();

				if (triggerEvent) {
					this.updateDOM([filter]);
				}
			}
		}
	}, {
		key: 'setEventHandlers',
		value: function setEventHandlers() {
			var _this3 = this;

			this.filterNames.forEach(function (filterName, i) {
				var filterElement = document.querySelector('[name="' + filterName + '"]');

				if (filterElement) {
					filterElement.addEventListener('change', function (e) {
						console.log(filterName, _this3.getFilterValue(filterName));
						_this3.updateFilters({
							name: filterName,
							value: _this3.getFilterValue(filterName)
						});

						if (_this3.urlIsUpdatable) {
							_this3.updateURL();
						}
					});
				}
			});

			if (this.urlIsUpdatable && window.history && window.history.pushState) {
				window.addEventListener("popstate", function (e) {
					if (e.state.filters) {
						for (var prop in e.state.filters) {
							_this3.filters[prop] = e.state.filters[prop];
						};

						_this3.updateDOM(e.state.filters);
						_this3.applyFilters();
					}
				});
			}
		}
	}, {
		key: 'updateDOM',
		value: function updateDOM(filtersArray) {
			for (var i in filtersArray) {
				var filter = filtersArray[i];
				var filterElement = document.querySelector('[name="' + filter.name + '"]');

				if (filterElement) {
					if (filterElement.tagName === 'SELECT') {
						filterElement.value = filter.value;
					}

					if (filterElement.tagName === 'INPUT') {
						if (filterElement.getAttribute('type') === 'checkbox') {
							filterElement.checked = filterElement.value === filter.value ? true : false;
						}
					}
				}
			}
		}

		//public method for changing filters

	}, {
		key: 'setFilters',
		value: function setFilters(filters) {
			var _this4 = this;

			var _loop = function _loop(property) {
				_this4.filters.forEach(function (item, i) {
					if (item.name === property) {
						item.value = filters[property];
					}
				});
			};

			for (var property in filters) {
				_loop(property);
			};

			this.updateDOM(this.filters);
			this.applyFilters();

			if (this.urlIsUpdatable) {
				this.updateURL();
			}
		}
	}, {
		key: 'applyFilters',
		value: function applyFilters() {
			var _this5 = this;

			var matchedItems = [];
			var listItems = this.element.children;

			if (this.lastClass) {
				var lastVisibleElement = this.element.querySelector('.' + this.lastClass);
				if (lastVisibleElement) {
					lastVisibleElement.classList.remove(this.lastClass);
				}
			}

			// If filters are set, only items whose data attributes
			//match all the set filters would show
			[].concat(_toConsumableArray(listItems)).forEach(function (element) {
				var matched = true;

				_this5.filters.forEach(function (filter, i) {
					if (filter.value !== undefined && filter.value !== filter.ignoreValue) {
						//any list item that doesn't have attribute for this filter or
						//has attribute for this filter with another value should
						//be filtered out.
						if (!element.hasAttribute('data-filter-' + filter.name) || element.getAttribute('data-filter-' + filter.name) !== filter.value) {
							matched = false;
							return false;
						}
					}
				});

				if (matched) {
					matchedItems.push(element);
				}
			});

			[].concat(_toConsumableArray(listItems)).forEach(function (el) {
				el.classList.add(_this5.hiddenClass);
			});

			if (matchedItems.length !== 0) {
				matchedItems.forEach(function (item, i) {
					item.classList.remove(_this5.hiddenClass);

					//add a class to last visible item in the list in case last item in list needs special styling
					if (_this5.lastClass && i === matchedItems.length - 1) {
						item.classList.add(_this5.lastClass);
					}
				});

				this.element.classList.remove('is-empty');
			} else {
				this.element.classList.add('is-empty');
			}

			if (typeof this.filtersCallback === 'function') {
				this.filtersCallback();
			}
		}
	}, {
		key: 'updateURL',
		value: function updateURL() {
			var _this6 = this;

			if (window.history && window.history.pushState) {
				var state = {};
				state.filters = Object.assign({}, this.filters);

				this.filters.forEach(function (filter) {
					if (filter.value !== undefined && filter.value.length !== 0 && filter.value !== filter.ignoreValue) {
						_this6.url = _this6.updateQueryStringParameter(_this6.url, filter.name, filter.value);
					} else {
						_this6.url = _this6.removeURLParameter(_this6.url, filter.name);
					}
				});

				history.pushState(state, document.title, this.url);
			}
		}

		//http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js

	}, {
		key: 'getUrlParameter',
		value: function getUrlParameter(sParam) {
			var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			    sURLVariables = sPageURL.split('&'),
			    sParameterName,
			    i;

			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');

				if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : sParameterName[1];
				}
			}
		}
	}, {
		key: 'updateQueryStringParameter',
		value: function updateQueryStringParameter(uri, key, value) {
			var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
			var separator = uri.indexOf('?') !== -1 ? "&" : "?";

			if (uri.match(re)) {
				return uri.replace(re, '$1' + key + "=" + value + '$2');
			} else {
				return uri + separator + key + "=" + value;
			}
		}
	}, {
		key: 'removeURLParameter',
		value: function removeURLParameter(url, parameter) {
			//prefer to use l.search if you have a location/link object
			var urlparts = url.split('?');
			if (urlparts.length >= 2) {
				var prefix = encodeURIComponent(parameter) + '=';
				var pars = urlparts[1].split(/[&;]/g);

				//reverse iteration as may be destructive
				for (var i = pars.length; i-- > 0;) {
					//idiom for string.startsWith
					if (pars[i].lastIndexOf(prefix, 0) !== -1) {
						pars.splice(i, 1);
					}
				}

				url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
				return url;
			} else {
				return url;
			}
		}
	}]);

	return FilterList;
}();
//# sourceMappingURL=filterList.js.map
