(function () {
  const separator = "/";
  const arrow = " \u203a ";

  const encode_key = (name) => btoa(encodeURIComponent(name));
  const decode_key = (key) => decodeURIComponent(atob(key));

  const split_categories = (encoded) =>
    encoded ? decode_key(encoded).split(",") : [];

  const is_within = (category, path) =>
    category === path || category.startsWith(path + separator);

  const all_item_categories = () => {
    const lists = window["quarto-listings"] || {};
    return Object.keys(lists).flatMap((id) =>
      lists[id].items.map((item) =>
        split_categories(item.values().categories)
      )
    );
  };

  window.filterListingCategory = function (category) {
    const lists = window["quarto-listings"] || {};
    Object.keys(lists).forEach((id) => {
      const list = lists[id];
      if (!list) return;
      if (category === "") {
        list.filter();
        return;
      }
      list.filter((item) =>
        split_categories(item.values().categories).some((c) =>
          is_within(c, category)
        )
      );
    });
  };

  const build_tree = (paths) => {
    const root = { children: new Map() };
    paths.forEach((path) => {
      const parts = path.split(separator);
      let node = root;
      parts.forEach((part, i) => {
        if (!node.children.has(part)) {
          node.children.set(part, {
            name: part,
            path: parts.slice(0, i + 1).join(separator),
            children: new Map()
          });
        }
        node = node.children.get(part);
      });
    });
    return root;
  };

  const make_category_el = (node, items) => {
    const el = document.createElement("div");
    el.className = "category";
    el.setAttribute("data-category", encode_key(node.path));
    const count = items.filter((cats) =>
      cats.some((c) => is_within(c, node.path))
    ).length;
    el.append(node.name + " ");
    const count_el = document.createElement("span");
    count_el.className = "quarto-category-count";
    count_el.textContent = "(" + count + ")";
    el.append(count_el);
    el.onclick = () => {
      window.activateCategory(node.path);
      window.setCategoryHash(node.path);
    };
    return el;
  };

  const render_level = (parent_el, node, items) => {
    const sorted = Array.from(node.children.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    sorted.forEach((child) => {
      parent_el.append(make_category_el(child, items));
      if (child.children.size > 0) {
        const wrapper = document.createElement("div");
        wrapper.className = "nested-category-children";
        render_level(wrapper, child, items);
        parent_el.append(wrapper);
      }
    });
  };

  const nest_sidebar = (container, items) => {
    const category_els = Array.from(container.querySelectorAll(":scope > .category"));
    const all_el = category_els.find((el) => el.getAttribute("data-category") === "");
    const paths = category_els
      .filter((el) => el !== all_el)
      .map((el) => decode_key(el.getAttribute("data-category")));
    const tree = build_tree(paths);
    category_els.filter((el) => el !== all_el).forEach((el) => el.remove());
    render_level(container, tree, items);
  };

  const prettify_labels = () => {
    document
      .querySelectorAll(".listing-category, .quarto-category")
      .forEach((el) => {
        el.textContent = el.textContent.split(separator).join(arrow);
      });
  };

  document.addEventListener("DOMContentLoaded", function () {
    const containers = document.querySelectorAll(
      ".quarto-listing-category.category-default, .quarto-listing-category.category-unnumbered"
    );
    if (containers.length > 0 && window["quarto-listings"]) {
      const items = all_item_categories();
      containers.forEach((container) => nest_sidebar(container, items));
      if (window["quarto-listing-loaded"]) {
        window["quarto-listing-loaded"]();
      }
    }
    prettify_labels();
  });
})();
