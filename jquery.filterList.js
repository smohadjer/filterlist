/*
 * @name          filterList
 * @version       1.1
 * @lastmodified  2016-12-02
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
			pluginInstance.filters = {};
			pluginInstance.setDefaultFilters();
			pluginInstance.updateFiltersfromURL();
			pluginInstance.setEventHandlers();
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

		setDefaultFilters: function() {
			var pluginInstance = this;
			var filterNames = pluginInstance.$element.data('filters-name').split(' ');

			$.each(filterNames, function(key, value) {
				var selector = '[name="' + value + '"]';

				if ($(selector).length) {
					pluginInstance.filters[value] = $(selector).val();
				} else {
					console.warn('No filter with name attribute set to ' + value + ' was found!');
				}
			});
		},

		updateFiltersfromURL: function() {
			var pluginInstance = this;

			$.each(pluginInstance.filters, function(key, value) {
				var newValue = pluginInstance.getUrlParameter(key);
				var obj = {};

				if (newValue) {
					obj[key] = newValue;
					pluginInstance.filters[key] = newValue;
					pluginInstance.updateMarkupFilters(obj);
				}
			});
		},

		setEventHandlers: function() {
			var pluginInstance = this;

			$.each(pluginInstance.filters, function(filterName, filterValue) {
				var $filterElement = $('[name="' + filterName + '"]');
				if ($filterElement.length) {
					$filterElement.on('change', function(e) {
						var filterObject = {};
						filterObject[filterName] = $(this).val();
						pluginInstance.setFilters(filterObject);
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

		updateMarkupFilters: function(filterObj) {
			var pluginInstance = this;

			$.each(filterObj, function(key, value) {
				var selector = '[name="' + key + '"]';
				if ($(selector).length) {
					$(selector).val(value);
				}
			});
		},

		//public method for changing filters
		setFilters: function(filters) {
			var pluginInstance = this;

			$.each(filters, function(key, value) {
				pluginInstance.filters[key] = value;
			});

			pluginInstance.updateMarkupFilters(filters);
			pluginInstance.applyFilters();

			if (pluginInstance.options.urlIsUpdatable) {
				pluginInstance.updateURL();
			}
		},

		applyFilters: function() {
			var pluginInstance = this;
			var $listItems = pluginInstance.$element.find('li');
			var allFiltersSetToDeafult = true;

			$listItems.removeClass('last-visible');

			$.each(pluginInstance.filters, function(key, value) {
				if (value !== 'all') {
					allFiltersSetToDeafult = false;
					return false; //end loop
				}
			});

			// When no filters are set or all filters are set to all, do no
			//filtering and show all items
			if ($.isEmptyObject(pluginInstance.filters) || allFiltersSetToDeafult === true) {
				$listItems.show();
				pluginInstance.options.filtersCallback(pluginInstance);
				return;
			}

			// If filters are set, only items whose data attributes
			//match all the set filters would show
			var matchedItems = [];

			$listItems.each(function() {
				var $li = $(this);
				var matched = true;

				$.each(pluginInstance.filters, function(key, value) {
					if (value !== 'all') {
						if (!$li.data('filter-' + key) || $li.data('filter-' + key) !== value) {
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
				$listItems.filter(':visible').last().addClass('last-visible');
			}

			pluginInstance.options.filtersCallback(pluginInstance);
		},

		updateURL: function() {
			var pluginInstance = this;
			var url = pluginInstance.url;

			if (window.history && window.history.pushState)	{
				var state = {};
				state.filters = $.extend({}, pluginInstance.filters);

				$.each(pluginInstance.filters, function(key, value) {
					url = pluginInstance.updateQueryStringParameter(url, key, value);
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
