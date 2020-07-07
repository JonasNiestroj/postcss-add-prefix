var postcss = require("postcss");

const compiledExcludes = [];
let noPrefix = false;

const checkForKeyframe = (selector) => {
  return /^([0-9]*[.])?[0-9]+\%$|^from$|^to$/.test(selector);
};

const compileExcludes = (excludes) => {
  if (Array.isArray(excludes)) {
    excludes.forEach((exclude) => {
      compiledExcludes.push(new RegExp(exclude));
    });
  } else {
    compiledExcludes.push(new RegExp(excludes));
  }
};

const checkForExclude = (selector) => {
  for (let i = 0; i < compiledExcludes.length; i++) {
    const match = compiledExcludes[i].test(selector);
    if (match) {
      return true;
    }
  }
  return false;
};

const walkRules = (postcss, result, options) => {
  if (options.exclude) {
    compileExcludes(options.exclude);
  }

  postcss.each((rule) => {
    if (rule.type === "atrule") {
      if (rule.name === "no-prefix") {
        noPrefix = true;
      } else if (rule.name === "end-no-prefix") {
        noPrefix = false;
      }
    } else if (rule.type === "rule") {
      if (!noPrefix) {
        const selector = rule.selector;
        // Check if the current rule is a keyframe
        if (checkForKeyframe(selector)) {
          return selector;
        }

        if (options.exclude && checkForExclude(selector)) {
          return selector;
        }

        if (selector.includes(",")) {
          const split = selector.split(",");
          rule.selector = split
            .map((sel) => `${options.selector} ${sel}`)
            .join(",");
        } else {
          rule.selector = `${options.selector} ${selector}`;
        }
      }
    }
  });
};

module.exports = postcss.plugin("postcss-add-prefix", (options) => {
  options = options || { selector: "#prefix" };
  return (postcss, result) => walkRules(postcss, result, options);
});
