// src/filterlist.ts
var Filterlist = class {
  element;
  excludeClass;
  hiddenClass;
  lastClass;
  filters;
  urlIsUpdatable;
  filterNames;
  initCallback;
  filtersCallback;
  constructor(options) {
    this.element = options.element;
    this.urlIsUpdatable = options.urlIsUpdatable || false;
    this.filters = [];
    this.filterNames = [];
    this.initCallback = options.initCallback;
    this.filtersCallback = options.filtersCallback;
    this.lastClass = options.lastClass || "last";
    this.hiddenClass = options.hiddenClass;
    this.excludeClass = options.excludeFromFilteringClass || "filterList__exclude";
    if (this.element && this.element.hasAttribute("data-filter-names")) {
      const attr = this.element.getAttribute("data-filter-names");
      if (attr.length > 0) {
        this.filterNames = attr.split(" ");
      } else {
        console.warn("data-filter-names has no value");
        return;
      }
    } else {
      console.warn("Element not found or has no data-filter-names attribute!");
      return;
    }
    this.setEventHandlers();
    this.setDefaultFilters(this.filterNames);
    this.updateFiltersfromURL();
    this.updateBrowserHistory();
    if (typeof this.initCallback === "function") {
      this.initCallback();
    }
    this.applyFilters(this.element);
  }
  updateBrowserHistory() {
    if (this.urlIsUpdatable) {
      history.replaceState({ filters: this.filters }, document.title, window.location.href);
    }
  }
  setDefaultFilters(filterNames) {
    filterNames.forEach((filterName) => {
      const ignoreValue = this.getFilterIgnoreValue(filterName);
      const filterValue = this.getFilterValue(filterName);
      this.filters.push({
        name: filterName,
        value: filterValue,
        ignoreValue
      });
    });
  }
  getFilterIgnoreValue(filterName) {
    const filterElement = document.querySelector(`[name="${filterName}"]`);
    let value = void 0;
    if (filterElement) {
      if (filterElement.tagName === "SELECT") {
        value = filterElement.getAttribute("data-ignore");
      }
    } else {
      console.warn("No filter with name " + filterName + " was found in markup!");
    }
    return value;
  }
  getFilterValue(filterName) {
    const filterElement = document.querySelector(`[name="${filterName}"]`);
    let value = void 0;
    if (filterElement) {
      if (filterElement.getAttribute("type") === "checkbox") {
        value = filterElement.checked ? filterElement.value : void 0;
      } else {
        value = filterElement.value;
      }
    } else {
      console.warn("No filter with name " + filterName + " was found in markup!");
    }
    return value;
  }
  updateFiltersfromURL() {
    this.filterNames.forEach((filterName) => {
      const searchParams = new URLSearchParams(window.location.search);
      const newValue = searchParams.get(filterName);
      if (newValue) {
        this.updateFilters({
          name: filterName,
          value: newValue
        });
        this.updateDOM(this.filters);
      }
    });
  }
  updateFilters(updatedFilter) {
    let filter = this.filters.find((filter2) => filter2.name === updatedFilter.name);
    if (filter && filter.value !== updatedFilter.value) {
      filter.value = updatedFilter.value;
      this.applyFilters(this.element);
    }
  }
  setEventHandlers() {
    this.filterNames.forEach((filterName) => {
      const filterElement = document.querySelector('[name="' + filterName + '"]');
      if (filterElement) {
        filterElement.addEventListener("change", () => {
          this.updateFilters({
            name: filterName,
            value: this.getFilterValue(filterName)
          });
          if (this.urlIsUpdatable) {
            const url = this.updateURL(new URL(window.location.href), this.filters);
            history.pushState({ filters: this.filters }, document.title, url);
          }
        });
      }
    });
    if (this.urlIsUpdatable) {
      window.addEventListener("popstate", (e) => {
        if (e.state.filters) {
          for (let prop in e.state.filters) {
            this.filters[prop] = e.state.filters[prop];
          }
          ;
          this.updateDOM(e.state.filters);
          this.applyFilters(this.element);
        }
      });
    }
  }
  updateDOM(filters) {
    filters.forEach((filter) => {
      const element = document.querySelector(`[name="${filter.name}"]`);
      if (element) {
        if (element.tagName === "SELECT") {
          element.value = filter.value;
        } else if (element.tagName === "INPUT") {
          if (element.getAttribute("type") === "checkbox") {
            element.checked = element.value === filter.value ? true : false;
          }
        }
      }
    });
  }
  //public method for changing filters via other scripts
  setFilters(filters) {
    for (let property in filters) {
      this.filters.forEach(function(item) {
        if (item.name === property) {
          item.value = filters[property];
        }
      });
    }
    ;
    this.updateDOM(this.filters);
    this.applyFilters(this.element);
    if (this.urlIsUpdatable) {
      const url = this.updateURL(new URL(window.location.href), this.filters);
      history.pushState({ filters: this.filters }, document.title, url);
    }
  }
  // returns elements that match all applicable filters
  getMatchedItems(listItems) {
    const matchedItems = [];
    const applicableFilters = this.filters.filter((item) => {
      return item.value !== void 0 && item.value !== item.ignoreValue;
    });
    listItems.forEach((element) => {
      let matched = true;
      applicableFilters.forEach((filter) => {
        const hasThisFilter = element.hasAttribute("data-filter-" + filter.name);
        const filterValue = element.getAttribute("data-filter-" + filter.name);
        if (!hasThisFilter || !filterValue.split(" ").includes(filter.value)) {
          matched = false;
        }
      });
      if (matched) {
        matchedItems.push(element);
      }
    });
    return matchedItems;
  }
  applyFilters(element) {
    const listItems = [...element.children].filter((item) => {
      return !item.classList.contains(this.excludeClass);
    });
    const matchedItems = this.getMatchedItems(listItems);
    listItems.forEach((el) => {
      this.hiddenClass ? el.classList.add(this.hiddenClass) : el.setAttribute("hidden", "hidden");
    });
    if (matchedItems.length === 0) {
      element.classList.add("is-empty");
    } else {
      matchedItems.forEach((item) => {
        this.hiddenClass ? item.classList.remove(this.hiddenClass) : item.removeAttribute("hidden");
      });
      element.classList.remove("is-empty");
    }
    if (this.lastClass) {
      const lastVisibleElement = element.querySelector(`.${this.lastClass}`);
      if (lastVisibleElement) {
        lastVisibleElement.classList.remove(this.lastClass);
      }
      if (matchedItems.length > 0) {
        matchedItems[matchedItems.length - 1].classList.add(this.lastClass);
      }
    }
    if (typeof this.filtersCallback === "function") {
      this.filtersCallback();
    }
  }
  // url is a URL object
  updateURL(url, filters) {
    filters.forEach((filter) => {
      if (filter.value === void 0 || filter.value.length === 0 || filter.value === filter.ignoreValue) {
        url.searchParams.delete(filter.name);
      } else {
        url.searchParams.set(filter.name, filter.value);
      }
    });
    return url;
  }
};
export {
  Filterlist as default
};
//# sourceMappingURL=filterlist.js.map
