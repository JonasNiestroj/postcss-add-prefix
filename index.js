var postcss = require("postcss");

const checkForKeyframe = (selector) => {
  return /^([0-9]*[.])?[0-9]+\%$|^from$|^to$/.test(selector);
};

const walkRules = (postcss) => {
  postcss.walkRules((rule) => {
    rule.selectors = rule.selectors.map((selector) => {
      // Check if the current rule is a keyframe
      if (checkForKeyframe(selector)) {
        return selector;
      }
      return `${options.selector} ${selector}`;
    });
  });
};

module.exports = postcss.plugin("postcss-add-prefix", (options) => {
  options = options || { selector: "#prefix" };
  return (postcss) => walkRules(postcss);
});
