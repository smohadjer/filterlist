/*
 * @name          filterList.js
 * @version       3.1.0
 * @lastmodified  2018-02-06
 * @author        Saeid Mohadjer
 * @repo		  https://github.com/smohadjer/filterList
 *
 * Licensed under the MIT License
 */

import * as utils from './utils.js';

'use strict';

export default class FilterList {
	constructor(options) {
		this.urlIsUpdatable = (options.urlIsUpdatable === undefined) ? false : options.urlIsUpdatable;
		this.element = options.element;
		this.filters = [];
		this.filterNames = this.element.getAttribute('data-filter-names').split(' ');
		this.initCallback = options.initCallback;
		this.filtersCallback = options.filtersCallback;
		this.url = window.location.href;
		this.lastClass = options.lastClass || 'last';
		this.hiddenClass = options.hiddenClass || 'hidden';
		this.excludeClass = options.excludeFromFilteringClass || 'filterList__exclude';
		this.filterSelector = options.filterSelector;

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
		if (this.urlIsUpdatable && window.history && window.history.pushState) {
			let state = {};
			state.filters = this.filters.slice();
			history.replaceState(state, document.title, this.url);
		}
	}

	setDefaultFilters(filterNames) {
		filterNames.forEach((filterName) => {
			const ignoreValue = this.getFilterIgnoreValue(filterName);
			const filterValue = this.getFilterValue(filterName);

			this.filters.push({
				name: filterName,
				value: filterValue,
				ignoreValue: ignoreValue
			});
		});
	}

	getFilterIgnoreValue(filterName) {
		const filterElement = document.querySelector(`[name="${filterName}"]`);
		let ignoreValue;

		if (filterElement) {
			if (filterElement.tagName === 'SELECT') {
				ignoreValue = filterElement.getAttribute('data-ignore');
			}
		} else {
			console.warn('No filter with name ' + filterName + ' was found in markup!');
		}

		return ignoreValue;
	}

	getFilterValue(filterName) {
		const filterElement = document.querySelector(`[name="${filterName}"]`);
		let filterValue;

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

	updateFiltersfromURL() {
		this.filterNames.forEach((filterName) => {
			const newValue = utils.getUrlParameter(filterName);

			if (newValue) {
				this.updateFilters({
					name: filterName,
					value: newValue
				}, true);
			}
		});
	}

	updateFilters(updatedFilter, triggerEvent) {
		let filter = this.filters.find((filter) => filter.name === updatedFilter.name);

		if (filter && filter.value !== updatedFilter.value) {
			filter.value = updatedFilter.value;
			this.applyFilters();

			if (triggerEvent) {
				this.updateDOM([filter]);
			}
		}
	}

	setEventHandlers() {
		this.filterNames.forEach((filterName) => {
			const filterElement = document.querySelector('[name="' + filterName + '"]');

			if (filterElement) {
				filterElement.addEventListener('change', () => {
					this.updateFilters({
						name: filterName,
						value: this.getFilterValue(filterName)
					});

					if (this.urlIsUpdatable) {
						this.updateURL();
					}
				});
			}
		});

		if (this.urlIsUpdatable && window.history && window.history.pushState) {
			window.addEventListener("popstate", (e) => {
				if (e.state.filters) {
					for (let prop in e.state.filters) {
						this.filters[prop] = e.state.filters[prop];
					};

					this.updateDOM(e.state.filters);
					this.applyFilters();
				}
			});
		}
	}

	updateDOM(filtersArray) {
		for (let i in filtersArray) {
			let filter = filtersArray[i];
			let filterElement = document.querySelector(`[name="${filter.name}"]`);

			if (filterElement) {
				if (filterElement.tagName === 'SELECT') {
					filterElement.value = filter.value;
				}

				if (filterElement.tagName === 'INPUT') {
					if (filterElement.getAttribute('type') === 'checkbox') {
						filterElement.checked = (filterElement.value === filter.value) ? true : false;
					}
				}
			}
		}
	}

	//public method for changing filters
	setFilters(filters) {
		for (let property in filters) {
			this.filters.forEach(function(item) {
				if (item.name === property) {
					item.value = filters[property];
				}
			});
		};

		this.updateDOM(this.filters);
		this.applyFilters();

		if (this.urlIsUpdatable) {
			this.updateURL();
		}
	}

	applyFilters() {
		let matchedItems = [];
		let listItems;
		let newListItems = [];

		if (this.filterSelector) {
			listItems = this.element.querySelectorAll(this.filterSelector);
		} else {
			listItems = this.element.children;
		}

		//exclude items that shouldn't be filtered
		for (let item of listItems) {
			if (!item.classList.contains(this.excludeClass)) {
				newListItems.push(item);
			}
		}

		if (this.lastClass) {
			let lastVisibleElement = this.element.querySelector(`.${this.lastClass}`);
			if (lastVisibleElement) {
				lastVisibleElement.classList.remove(this.lastClass);
			}
		}

		// If filters are set, only items whose data attributes
		//match all the set filters would show
		[...newListItems].forEach((element) => {
			let matched = true;

			this.filters.forEach(function(filter) {
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

		[...newListItems].forEach((el) => {
			el.classList.add(this.hiddenClass);
		});

		if (matchedItems.length !== 0) {
			matchedItems.forEach((item, i) => {
				item.classList.remove(this.hiddenClass);

				//add a class to last visible item in the list in case last item in list needs special styling
				if (this.lastClass && i === matchedItems.length - 1) {
					item.classList.add(this.lastClass);
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

	updateURL() {
		if (window.history && window.history.pushState)	{
			let state = {};
			state.filters = Object.assign({}, this.filters);

			this.filters.forEach((filter) => {
				if (filter.value !== undefined && filter.value.length !== 0 && filter.value !== filter.ignoreValue) {
					this.url = utils.updateQueryStringParameter(this.url, filter.name, filter.value);
				} else {
					this.url = utils.removeURLParameter(this.url, filter.name);
				}
			});

			history.pushState(state, document.title, this.url);
		}
	}
}
