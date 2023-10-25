import Filterlist from './filterList.js';

// Set up our document body
document.body.innerHTML =
'<ul class="list" data-filter-names="fruit">' +
'  <li data-filter-fruit="apple">apple</li>' +
'  <li data-filter-fruit="orange">orange</li>' +
'</ul>';

const filterlist = new Filterlist({
  element: document.querySelector('.list')
});

describe("Filterlist", () => {
  test("defines updateURL()", () => {
    expect(typeof filterlist.updateURL).toBe("function");
  });
});
