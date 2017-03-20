/*
 * @name          filterList
 * @version       2.0.2
 * @lastmodified  2017-03-20
 * @author        Saeid Mohadjer
 *
 * Licensed under the MIT License
 */

;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'filterList',
	defaults = {
		urlIsUpdatable: true,
		initCallback: function() {
			//runs as soon as plugin is initialized
		},
		filtersCallback: function() {
			//runs every time plugin's applyFilters() method is invoked
		}
	};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// methods
	var methods = {
		init: function() {
			var pluginInstance = this;

			pluginInstance.url = window.location.href;
			pluginInstance.filterNames = pluginInstance.$element.data('filter-names').split(' ');

			pluginInstance.setEventHandlers();
			pluginInstance.setDefaultFilters(pluginInstance.filterNames);
			pluginInstance.updateFiltersfromURL();
			pluginInstance.updateBrowserHistory();
			pluginInstance.options.initCallback(pluginInstance);
			pluginInstance.applyFilters();
		},

		updateBrowserHistory: function() {
			var pluginInstance = this;

			if (pluginInstance.options.urlIsUpdatable) {
				//update history state that is pushed by browser
				if (window.history && window.history.pushState)	{
					var state = {};
					state.filters = $.extend({}, pluginInstance.filters);
					history.replaceState(state, document.title, pluginInstance.url);
				}
			}
		},

		setDefaultFilters: function(filterNames) {
			var pluginInstance = this;

			pluginInstance.filters = [];

			$.each(filterNames, function() {
				var filterName = this;
				var filter = {};

				filter.name = filterName;
				//filter.type = pluginInstance.getFilterType(filterName);
				filter.value = pluginInstance.getFilterValue(filterName);
				filter.ignoreValue = pluginInstance.getFilterIgnoreValue(filterName);

				pluginInstance.filters.push(filter);
			});
		},

		getFilterValue: function(filterName) {
			var pluginInstance = this;
			var $filter = $('[name="' + filterName + '"]');
			var filterValue;

			if ($filter.length === 0) {
				console.warn('No filter with name ' + filterName + ' was found in markup!');
			} else {
				if ($filter.attr('type') === 'checkbox') {
					filterValue = $filter.is(':checked') ? $filter.val() : undefined;
				} else {
					filterValue = $filter.val();
				}
			}

			return filterValue;
		},

		getFilterIgnoreValue: function(filterName) {
			var pluginInstance = this;
			var $elm = pluginInstance.$element;
			var ignoreAttr = 'filter-' + filterName + '-ignore';
			var ignoreValue = pluginInstance.$element.data(ignoreAttr);

			return ignoreValue;
		},

		updateFiltersfromURL: function() {
			var pluginInstance = this;

			$.each(pluginInstance.filterNames, function() {
				var filterName = this;
				var newValue = pluginInstance.getUrlParameter(filterName);
				var filter = {};

				if (newValue) {
					filter.name = filterName;
					filter.value = newValue;
					pluginInstance.updateFilters(filter, true);
				}
			});
		},

		updateFilters: function(updatedFilter, triggerEvent) {
			var pluginInstance = this;

			$.each(pluginInstance.filters, function() {
				var filter = this;

				if (updatedFilter.name === filter.name && updatedFilter.value !== filter.value) {
					filter.value = updatedFilter.value;

					if (triggerEvent) {
						pluginInstance.$element.trigger('update-markupFilters', [filter]);
					}

					pluginInstance.applyFilters();

					return false;
				}
			});
		},

		setEventHandlers: function() {
			var pluginInstance = this;

			pluginInstance.$element.on('update-markupFilters', function(e, filter) {
				pluginInstance.updateMarkupFilters([filter]);
			});

			$.each(pluginInstance.filterNames, function() {
				var filterName = this;
				var $filter = $('[name="' + filterName + '"]');
				var value;

				if ($filter.length) {
					$filter.on('change', function(e) {
						var $this = $(this);
						var filter = {};

						filter.name = $this.attr('name');
						filter.value = pluginInstance.getFilterValue(filter.name);
						pluginInstance.updateFilters(filter);

						if (pluginInstance.options.urlIsUpdatable) {
							pluginInstance.updateURL();
						}
					});
				}
			});

			if (pluginInstance.options.urlIsUpdatable) {
				if (window.history && window.history.pushState)	{
					window.addEventListener("popstate", function(e) {
						if (e.state.filters) {
							$.each(e.state.filters, function(key, value) {
								pluginInstance.filters[key] = value;
							});

							pluginInstance.updateMarkupFilters(e.state.filters);
							pluginInstance.applyFilters();
						}
					});
				}
			}
		},

		updateMarkupFilters: function(filtersArray) {
			var pluginInstance = this;

			$.each(filtersArray, function() {
				var filter = this;
				var $filter = $('[name="' + filter.name + '"]');
				var tagName;

				if ($filter.length) {
					tagName = $filter.prop('tagName');

					if (tagName === 'SELECT') {
						$filter.val(filter.value);
					} else if (tagName === 'INPUT') {
						if ($filter.attr('type') === 'checkbox') {
							if (filter.value === $filter.val()) {
								$filter.prop('checked', true);
							} else {
								$filter.prop('checked', false);
							}
						}
					}
				}
			});
		},

		//public method for changing filters
		setFilters: function(filters) {
			var pluginInstance = this;

			$.each(filters, function(key, value) {
				$.each(pluginInstance.filters, function() {
					if (this.name === key) {
						this.value = value;
					}
				});
			});

			pluginInstance.updateMarkupFilters(pluginInstance.filters);
			pluginInstance.applyFilters();

			if (pluginInstance.options.urlIsUpdatable) {
				pluginInstance.updateURL();
			}
		},

		applyFilters: function() {
			var pluginInstance = this;
			var matchedItems = [];
			var $listItems = pluginInstance.$element.find('li');

			$listItems.removeClass('last-visible');

			// If filters are set, only items whose data attributes
			//match all the set filters would show
			$listItems.each(function() {
				var $li = $(this);
				var matched = true;

				$.each(pluginInstance.filters, function() {
					var filter = this;

					if (filter.value !== undefined && filter.value !== filter.ignoreValue) {
						//any list item that doesn't have attribute for this filter or
						//has attribute for this filter with another value should
						//be filtered out.
						if (!$li[0].hasAttribute('data-filter-' + filter.name) || $li.attr('data-filter-' + filter.name) !== filter.value) {
							matched = false;
							return false;
						}
					}
				});

				if (matched) {
					matchedItems.push($li);
				}
			});

			$listItems.hide();

			if (matchedItems.length !== 0) {
				$(matchedItems).each(function() {
					$(this).show();
				});
				pluginInstance.$element.removeClass('is-empty');
				$listItems.filter(':visible').last().addClass('last-visible');
			} else {
				pluginInstance.$element.addClass('is-empty');
			}

			pluginInstance.options.filtersCallback(pluginInstance);
		},

		updateURL: function() {
			var pluginInstance = this;
			var url = pluginInstance.url;

			if (window.history && window.history.pushState)	{
				var state = {};
				state.filters = $.extend({}, pluginInstance.filters);

				$.each(pluginInstance.filters, function() {
					var filter = this;
					if (filter.value !== undefined) {
						url = pluginInstance.updateQueryStringParameter(url, filter.name, filter.value);
					}
				});

				history.pushState(state, document.title, url);
			}
		},

		//http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
		getUrlParameter: function(sParam) {
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
		},

		updateQueryStringParameter: function(uri, key, value) {
		  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		  if (uri.match(re)) {
		    return uri.replace(re, '$1' + key + "=" + value + '$2');
		  }
		  else {
		    return uri + separator + key + "=" + value;
		  }
		}

	};

	// build
	$.extend(Plugin.prototype, methods);

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);
