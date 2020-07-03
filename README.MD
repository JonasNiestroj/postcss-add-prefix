# PostCSS Add Prefix

[PostCSS] plugin to add a prefix to all selectors

[PostCSS]: https://github.com/postcss/postcss

Without postcss-add-prefix
```css
.first {
    display: block;
}

.first, .second {
    display: inline-block;
}
```

With postcss-add-prefix
```css
.scope .first {
  display: block;
}

.scope .first, .scope .second {
  display: inline-block;
}
```

## Usage

```js
postcss([ require('postcss-add-prefix')( { selector: '.scope' } ) ])
```
