# nested-categories

A Quarto extension for nested categories in website listings. Write categories as paths, and the category menu on your listing page becomes a nested list that you can click to filter, as usual.

HTML output only.

## Installing

From the root of your Quarto project:

```bash
quarto add ONSdigital/nested-categories
```

This adds the extension to `_extensions/`. Then enable the filter in `_quarto.yml`:

```yaml
filters:
  - nested-categories
```

To install manually, copy `_extensions/nested-categories` from this repository into your project's `_extensions/` folder.

## Using it

Separate levels with `/` in the `categories` of your posts:

```yaml
categories:
  - charts/bar
  - charts/line
  - examples
```

Parents don't need to be listed. `charts` is created automatically, and clicking it shows every post in `charts/*`. A post in several subcategories of one parent is only counted once.

Your listing page needs `categories: true` (or `unnumbered`) as usual:

```yaml
listing:
  contents: posts
  categories: true
```

This works with `categories: true` and `categories: unnumbered`. With `categories: cloud`, categories are shown as flat tags with their full paths. On post pages and listing cards, `charts/bar` is shown as `charts › bar`.

## Why paths and not nested YAML?

Quarto's listing code only reads flat strings from `categories`, so nested YAML lists can't be passed through to the listing.

## Example

The repository is a small project. Run `quarto preview` from its root to see `index.qmd` listing the posts in `posts/`.

## Changing the separator

The separator (`/`) and the arrow used for display are constants at the top of `nested-categories.js`.
