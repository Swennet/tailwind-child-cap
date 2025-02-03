# tailwind-child-cap

`tailwind-child-cap` is a Tailwind CSS plugin designed to control the maximum number of visible child elements within a container. This utility is particularly useful for creating responsive designs where the number of displayed elements needs to be adjusted based on the screen size.

## Features

- Generates utility classes `.child-cap-{n}` to specify the number of visible child elements.
- Provides `.child-cap-none` to display all child elements, overriding previous cap settings.
- Fully responsive, allowing different caps at different breakpoints.

## Installation

Install the plugin via npm:

```bash
npm install -D tailwind-child-cap
```

## Usage

Add `tailwind-child-cap` to your Tailwind CSS configuration file (`tailwind.config.js`):

```javascript
// tailwind.config.js
module.exports = {
  // ...
  plugins: [
    require("tailwind-child-cap"),
    // ... other plugins
  ],
};
```

Optionally, you can customize the maximum range of the child-cap classes:

```javascript
// tailwind.config.js
module.exports = {
  // ...
  plugins: [
    require("tailwind-child-cap")({ maxRange: 30 }),
    // ...
  ],
};
```

## Examples

### Basic Usage

```html
<div class="child-cap-3">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
  <div class="item">Item 4</div>
  <!-- Hidden -->
</div>
```

In this example, only the first three child elements will be visible.

### Responsive Design

```html
<div class="child-cap-2 md:child-cap-4 lg:child-cap-6">
  <!-- Child elements here -->
</div>
```

This setup displays 2 child elements by default, 4 on medium screens, and 6 on large screens.

### Removing the Cap

```html
<div class="md:child-cap-3 lg:child-cap-none">
  <!-- Child elements here -->
</div>
```

This configuration caps the children to 3 on medium screens and removes the cap on large screens, displaying all children.

## Contributing

Contributions to `tailwind-child-cap` are welcome! Feel free to submit issues or pull requests on GitHub for any bugs, improvements, or new features.

## License

This plugin is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
