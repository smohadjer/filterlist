Filterlist is a small (4kb) TypeScript library with no dependencies that allows filtering of arbitrary HTML elements via data attributes. Filtering can be triggered using URL parameters, or by adding form elements to page, or programmatically via another script.

## Examples
Examples in GitHub Repo:
- [Minimal demo filtering via URL parameter](https://smohadjer.github.io/filterlist/demo/minimal.html)
- [Filtering span elements inside a div](https://smohadjer.github.io/filterlist/demo/demo-list.html)
- [Filtering rows in a table](https://smohadjer.github.io/filterlist/demo/demo-table.html)

Examples on Web:
- [Filtering posts in a blog using tags](https://saeidmohadjer.com/blog)
- [Filtering Yoga courses by teacher or by course](https://yoga.solmazmohadjer.com/schedule.html)

## Features
- Requires no CSS
- Optionally updates URL when filters are changed without page refresh
- Can be used with any group of HTML elements
- Allows binding form fields to HTML elements via data-attributes (no scripting necessay)

## Usage
- Below snippet shows how to filter a list via a select element:
```
		<select data-ignore="all" name="type">
			<option value="all">Select type</option>
			<option value="fruit">fruit</option>
			<option value="vegetable">vegetable</option>
			<option value="dairy">dairy</option>
		</select>
		<ul data-filter-names="type">
			<li data-filter-type="fruit">Apple</li>
			<li data-filter-type="fruit">Banana</li>
			<li data-filter-type="dairy">Butter</li>
			<li data-filter-type="vegetable">Carrot</li>
			<li data-filter-type="dairy">Cheese</li>
			<li data-filter-type="dairy">Cream</li>
			<li data-filter-type="fruit">Kiwi</li>
			<li data-filter-type="dairy">Milk</li>
			<li data-filter-type="vegetable">Onion</li>
			<li data-filter-type="fruit">Orange</li>
			<li data-filter-type="fruit">Pear</li>
			<li data-filter-type="vegetable">Tomato</li>
			<li data-filter-type="dairy">Yogurt</li>
		</ul>

		<script type="module">
			import Filterlist from '../dist/filterlist.js';
			const filterlist = new Filterlist({
				element: document.querySelector('ul'),
				urlIsUpdatable: true
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
