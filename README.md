FilterList is a small (4kb) zero-dependency JavaScript library that allows you to filter any arbitrary group of HTML elements by adding data attributes to them. Filtering can be triggered via URL parameters, or form elements in markup, or programmatically via a script. For example you can use it to filter posts on a blog based on tags.

## Demo
Examples in GitHub Repo:
- [Minimal demo](https://smohadjer.github.io/filterList/demo/minimal.html)
- [Filtering span elements inside a div](https://smohadjer.github.io/filterList/demo/demo-list.html)
- [Filtering rows in a table](https://smohadjer.github.io/filterList/demo/demo-table.html)

Examples on Web:
- [Filtering posts in a blog using tags](https://saeidmohadjer.com/blog)
- [Filtering Yoga courses by teacher or by course](https://yoga.solmazmohadjer.com/schedule.html)

## Features
- Requires no CSS
- Updates URL after filter is changed without a page refresh
- Can be used with any group of HTML elements

## Usage
- See minimal demo. Below snippet from that demo can show you how to use the library. See other demo examples for more elaborate ways of using the library.
```
<ul data-filter-names="fruit">
	<li data-filter-fruit="apple">Apple</li>
	<li data-filter-fruit="orange">Orange</li>
	<li data-filter-fruit="banana">Banana</li>
	<li data-filter-fruit="kiwi">Kiwi</li>
	<li data-filter-fruit="pear">Pear</li>
</ul>
<script type="module">
	import FilterList from '../src/filterList.js';
	const filter = new FilterList({
		element: document.querySelector('ul'),
	});
</script>
```
- Name of filters should be set on the list's parent element using data attribute with the syntax `data-filter-names=“filtername1 filtername2”`.
- List items that match a filter need a data attribute with syntax `data-filter-filtername=“filtervalue1”`. If an item has multiple values for a certain filter separate them by space: `data-filter-filtername=“filtervalue1 filtervalue2”`.
- Use `data-ignore="ignoreValue"` on form elements such as "Select" to specify value that should be taken into account during filtering, for example an "all" value in dropdown list.

## Options
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

## Public methods
- **setFilter({filtername: filtervalue})**<br />
Use this method to change a filter's value from javascript. For example you may want to add a button to your page that once clicked, it resets all filters to their initial value. For usage example see the demo page.
