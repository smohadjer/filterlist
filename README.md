The filterList.js is a vanilla js script with no dependency that can be used to filter any list. How to filter a list is up to you. You can filter it using only parameters in URL, or using form elements in markup, or from your own scripts using callbacks and public methods. For examples see [demo page](https://smohadjer.github.io/filterList/demo/demo.html).

### How to use
- Add script to the bottom of your page before closing body tag and then initialise "FilterList" class:
```javascript
<script src="path/to/script/filterlist.js"></script>
var filter = new FilterList({
	element: document.querySelector('.myFilterableList')
});
```
- Name of filters should be set on the list element (ul or ol) using data attribute with the syntax `data-filters-name=“filtername1 filtername2”`.
- List items that match a filter need a data attribute with syntax `data-filter-filtername=“filtervalue”`.
- Use `data="data-filter-filterName-ignore="ignoreValue"` to specify an ignore value for a filter. If a filter has this value, the filter will be ignored (no filtering).

### Features
- The script has no javascript dependencies and no CSS.
- FilterList can update URL when filters change by setting option "urlIsUpdatable" to true.

### Options
- **element: document.getElementById('myList')**<br />
This is the only required option.

- **urlIsUpdatable: true**<br />
If urlIsUpdatable is set to true (default is false) script updates browser URL when a filter changes.

- **lastClass: 'last-visible-item'**<br />
This allows you to define a class to be set on last visible list item in case you want special styling for the last item in your list.

- **initCallback: function() { console.log(this); }**<br />
This callback function is invoked as soon as FilterList is initialised.

- **filtersCallback: function() { console.log(this); }**<br />
This callback function is invoked every time filters are applied.

### Public methods
- **setFilter({filtername: filtervalue})**<br />
Use this method to change a filter's value from javascript. For example you may want to add a button to your page that once clicked, it resets all filters to their initial value. For usage example see the demo page.
