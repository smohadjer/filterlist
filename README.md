filterList.js allows filtering of any HTML list or group of elements via data attributes. Filters can be set or changed via URL parameters, or form elements, or by other scripts. The script is written in plain JavaScript and has no dependencies. For examples see [demo page](https://smohadjer.github.io/filterList/demo/demo-list-es5.html).

### How to use
- Add script to the bottom of your page before closing body tag and then initialise "FilterList" class:
```javascript
<script src="path/to/script/filterList.js"></script>
var myFilter = new FilterList({
	element: document.querySelector('.myFilterableList')
});
```
- Name of filters should be set on the list's parent element using data attribute with the syntax `data-filters-name=“filtername1 filtername2”`.
- List items that match a filter need a data attribute with syntax `data-filter-filtername=“filtervalue”`.
- Use `data-ignore="ignoreValue"` on form elements such as "Select" to specify value that should be taken into account during filtering, for example an "all" value in dropdown list.

### Features
- The script has no javascript dependencies and no CSS.
- FilterList can update URL when filters change by setting option "urlIsUpdatable" to true.

### Options
- **element: document.getElementById('myList')**<br />
This is the only required option.

- **urlIsUpdatable: true**<br />
If urlIsUpdatable is set to true (default is false) script updates browser URL when a filter changes.

- **lastClass: type string, default = 'last'**<br />
This allows you to define a class to be set on last visible list item in case you want special styling for the last item in your list.

- **hiddenClass: type string, default = 'hidden'**<br />
This allows you to define a class to be set on elements that are filtered out. Styles you set with this class will be applied to elements that do not mach the currently set filters.

- **initCallback: function() { console.log(this); }**<br />
This callback function is invoked as soon as FilterList is initialised.

- **filtersCallback: function() { console.log(this); }**<br />
This callback function is invoked every time filters are applied.

### Public methods
- **setFilter({filtername: filtervalue})**<br />
Use this method to change a filter's value from javascript. For example you may want to add a button to your page that once clicked, it resets all filters to their initial value. For usage example see the demo page.
