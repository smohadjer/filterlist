filterList.js is a vanilla js script that can be used to filter any arbitrary list of items. How to filter the list is up to you. You can filter a list using only parameters in URL, or using form elements in markup such as select or checboxes, or from your own scripts by calling filterList's "setFilters()" method. For examples see demo page.

### Demo
https://smohadjer.github.io/filterList/demo.html

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
