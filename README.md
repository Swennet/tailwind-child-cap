# tailwind-child-cap

`tailwind-child-cap` is a Tailwind CSS plugin that limits how many direct child elements are visible in a container.

## Features

- Generates `.child-cap-1` to `.child-cap-N` utilities
- Includes `.child-cap-none` to remove the cap
- Works with responsive variants (`sm:`, `md:`, `lg:`, and so on)

## Installation

```bash
npm install --save-dev tailwind-child-cap
```

## Usage with Tailwind 4 (`app.css`)

```css
@import "tailwindcss";

@plugin "tailwind-child-cap";
```

Custom range:

```css
@import "tailwindcss";

@plugin "tailwind-child-cap" {
    maxrange: 42;
}
```

## Usage with `tailwind.config.js`

```js
module.exports = {
  plugins: [require("tailwind-child-cap")({ maxRange: 30 })],
};
```

## Options

Use `maxRange` in JavaScript config or `maxrange` in the Tailwind 4 `@plugin` block.

- Type: positive integer
- Default: `24`
- Invalid values (non-number, `0`, negative) fall back to `24`

## Examples

### Basic usage

```html
<ul class="child-cap-3">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <!-- Hidden from here -->
  <li>Item 4</li>
  <li>Item 5</li>
</ul>
```

In this example, only the first three child elements are visible.

### Responsive design

```html
<ul class="child-cap-2 md:child-cap-4 lg:child-cap-6">
  <li>Item 1</li>
  <li>Item 2</li>
  <!-- Hidden until md -->
  <li>Item 3</li>
  <li>Item 4</li>
  <!-- Hidden until lg -->
  <li>Item 5</li>
  <li>Item 6</li>
  <!-- Hidden at all breakpoints -->
  <li>Item 7</li>
</ul>
```

This setup shows 2 items by default, 4 on `md`, and 6 on `lg`.

### Removing the cap

```html
<ul class="md:child-cap-3 lg:child-cap-none">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <!-- Hidden on md, visible again on lg -->
  <li>Item 4</li>
  <li>Item 5</li>
</ul>
```

On medium screens this caps at 3 items, and on large screens the cap is removed.

## Compatibility

- Tailwind CSS: `^4.0.0`
- Node.js: `>=14`

## License

MIT, see [LICENSE](LICENSE).
