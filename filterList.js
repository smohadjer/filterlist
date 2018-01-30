/*
 * @name          filterList
 * @version       1.0.0
 * @lastmodified  2018-01-26
 * @author        Saeid Mohadjer
 * @repo		  https://github.com/smohadjer/filterList
 *
 * Licensed under the MIT License
 */

'use strict';

class FilterList {
	constructor(options) {
		this.options = options;
		this.urlIsUpdatable = (options.urlIsUpdatable === undefined) ? false : options.urlIsUpdatable;
		this.url = window.location.href;
		this.element = options.element;
		this.filterNames = options.element.getAttribute('data-filter-names').split(' ');
		this.initCallback = options.initCallback;
		this.filtersCallback = options.filtersCallback;

		this.setEventHandlers();
		this.setDefaultFilters(this.filterNames);
		this.updateFiltersfromURL();
		this.updateBrowserHistory();

		if (typeof this.initCallback === 'function') {
			this.initCallback();
		}

		this.applyFilters();
	}

	updateBrowserHistory() {
		if (this.urlIsUpdatable) {
			//update history state that is pushed by browser
			if (window.history && window.history.pushState)	{
				let state = {};
				state.filters = this.filters.slice();
				history.replaceState(state, document.title, this.url);
			}
		}
	}

	setDefaultFilters(filterNames) {
		this.filters = [];

		filterNames.forEach((filterName, i) => {
			let filter = {
				name: filterName,
				value: this.getFilterValue(filterName),
				ignoreValue: this.getFilterIgnoreValue(filterName)
			};

			this.filters.push(filter);
		});
	}

	getFilterValue(filterName) {
		var pluginInstance = this;
		var $filter = document.querySelector(`[name="${filterName}"]`);
		var filterValue;

		if ($filter.length === 0) {
			console.warn('No filter with name ' + filterName + ' was found in markup!');
		} else {
			if ($filter.getAttribute('type') === 'checkbox') {
				filterValue = $filter.checked ? $filter.value : undefined;
			} else {
				filterValue = $filter.value;
			}
		}

		return filterValue;
	}

	getFilterIgnoreValue(filterName) {
		var ignoreAttr = `data-filter-${filterName}-ignore`;
		var ignoreValue = this.element.getAttribute(ignoreAttr);
		return ignoreValue;
	}

	updateFiltersfromURL() {
		this.filterNames.forEach((item, i) => {
			var filterName = item;
			var newValue = this.getUrlParameter(filterName);
			var filter = {};

			if (newValue) {
				filter.name = filterName;
				filter.value = newValue;
				this.updateFilters(filter, true);
			}
		});
	}

	updateFilters(updatedFilter, triggerEvent) {
		var pluginInstance = this;

		this.filters.forEach((item, i) => {
			var filter = item;

			if (updatedFilter.name === filter.name && updatedFilter.value !== filter.value) {
				filter.value = updatedFilter.value;

				if (triggerEvent) {
					//pluginInstance.element.trigger('update-markupFilters', [filter]);
					const event = new CustomEvent('update-markupFilters', {detail: [filter]});
					pluginInstance.element.dispatchEvent(event);
				}

				pluginInstance.applyFilters();

				return false;
			}
		});
	}

	setEventHandlers() {
		this.element.addEventListener('update-markupFilters', (e) => {
			this.updateMarkupFilters(e.detail);
		});

		this.filterNames.forEach((item, i) => {
			var filterName = item;
			var $filter = document.querySelector('[name="' + filterName + '"]');
			var value;

			if ($filter) {
				$filter.addEventListener('change', (e) => {
					var filter = {};

					filter.name = $filter.getAttribute('name');
					filter.value = this.getFilterValue(filter.name);
					this.updateFilters(filter);

					if (this.urlIsUpdatable) {
						this.updateURL();
					}
				});
			}
		});

		if (this.urlIsUpdatable) {
			var _this = this;
			if (window.history && window.history.pushState)	{
				window.addEventListener("popstate", function(e) {
					if (e.state.filters) {
						for (var prop in e.state.filters) {
							_this.filters[prop] = e.state.filters[prop];
						};

						_this.updateMarkupFilters(e.state.filters);
						_this.applyFilters();
					}
				});
			}
		}
	}

	updateMarkupFilters(filtersArray) {
		for (let i in filtersArray) {
			let filter = filtersArray[i];
			//filtersArray.forEach((filter, i) => {
			var $filter = document.querySelector(`[name="${filter.name}"]`);

			if ($filter) {
				if ($filter.tagName === 'SELECT') {
					$filter.value = filter.value;
				} else if ($filter.tagName === 'INPUT') {
					if ($filter.getAttribute('type') === 'checkbox') {
						if (filter.value === $filter.value) {
							$filter.checked = true;
						} else {
							$filter.checked = false;
						}
					}
				}
			}
		}
	}

	//public method for changing filters
	setFilters(filters) {
		for (var property in filters) {
			this.filters.forEach(function(item, i) {
				if (item.name === property) {
					item.value = filters[property];
				}
			});
		};

		this.updateMarkupFilters(this.filters);
		this.applyFilters();

		if (this.urlIsUpdatable) {
			this.updateURL();
		}
	}

	applyFilters() {
		var matchedItems = [];
		var $listItems = this.element.querySelectorAll('li');

		// If filters are set, only items whose data attributes
		//match all the set filters would show
		[...$listItems].forEach((el) => {
			//el.classList.remove('last-visible');
			var $li = el;
			var matched = true;

			this.filters.forEach(function(item, i) {
				var filter = item;

				if (filter.value !== undefined && filter.value !== filter.ignoreValue) {
					//any list item that doesn't have attribute for this filter or
					//has attribute for this filter with another value should
					//be filtered out.
					if (!$li.hasAttribute('data-filter-' + filter.name) || $li.getAttribute('data-filter-' + filter.name) !== filter.value) {
						matched = false;
						return false;
					}
				}
			});

			if (matched) {
				matchedItems.push($li);
			}
		});

		[...$listItems].forEach(function(el) {
			el.style.display = 'none';
		});

		if (matchedItems.length !== 0) {
			matchedItems.forEach((item, i) => {
				item.style.display = 'block';
			});
			this.element.classList.remove('is-empty');
			//$listItems.filter(':visible').last().addClass('last-visible');
		} else {
			this.element.classList.add('is-empty');
		}

		if (typeof this.filtersCallback === 'function') {
			this.filtersCallback();
		}
	}

	updateURL() {
		var url = this.url;

		if (window.history && window.history.pushState)	{
			var state = {};
			state.filters = Object.assign({}, this.filters);

			this.filters.forEach((filter) => {
				if (filter.value !== undefined) {
					url = this.updateQueryStringParameter(url, filter.name, filter.value);
				}
			});

			history.pushState(state, document.title, url);
		}
	}

	//http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
	getUrlParameter(sParam) {
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

	updateQueryStringParameter(uri, key, value) {
		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf('?') !== -1 ? "&" : "?";

		if (uri.match(re)) {
			return uri.replace(re, '$1' + key + "=" + value + '$2');
		} else {
			return uri + separator + key + "=" + value;
		}
	}
}
