import Filterlist from '../dist/filterlist.js';

// Set up our document body
document.body.innerHTML =
'<ul class="list" data-filter-names="fruit">' +
'  <li data-filter-fruit="apple">apple</li>' +
'  <li data-filter-fruit="orange">orange</li>' +
'</ul>';

const url = new URL('http://www.saeidmohadjer.com/');
const filters = [
  {
    name: "fruit",
    value: "apple",
    ignoreValue: "all"
  }
];

const filterlist = new Filterlist({
  element: document.querySelector('.list')
});

describe("Filterlist", () => {
  test("defines updateURL()", () => {
    expect(typeof filterlist.updateURL).toBe("function");
  });

  test("updateURL returns a URL object", () => {
    expect(typeof filterlist.updateURL(url, filters)).toBe('object');
  });
});
