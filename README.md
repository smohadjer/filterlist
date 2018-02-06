The filterList.js is a vanilla js script with no dependency that can be used to filter HTML lists. Lists can be filtered using URL parameters or form fields by simply setting data attrbiutes on list items that correspond to name of those parameters or form fields. For examples see [demo page](https://smohadjer.github.io/filterList/demo/demo.html).

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
- Use `data-ignore="ignoreValue"` on form elements such as "Select" to specify an ignore value for them. If the element has this value, no filtering will be applied to your list.

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
