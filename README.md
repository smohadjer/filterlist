# filterList
jQuery plugin for filtering lists

Demo: https://smohadjer.github.io/filterList/demo.html

This jQuery plugin can be used to filter any arbitrary list of items. How to filter the list is up to you. You can filter a list using parameters in URL such as filtername=filtervalue or via a button or form elements by assigning a handler to these elements to invoke filterList’s setFilter() method. For examples see demos.

How to use:
- Include script jQuery.filterList.js in your page and initialise plugin using: $(‘.myList’).filterList();
- You can use any HTML element for markup. Name of filters can be provided on the list element using data attribute with the syntax data-filters-name=“filtername1 filtername2”.
- List Items that should be filtered need a data attribute with syntax data-filter-filtername=“filtervalue”.

Features:
- Requires no CSS and allows you to use your own markup structure.
- Filtering by default is URL aware (list can be filtered via URL parameters or changing list filtering updates URL parameters). This can be turned off.
