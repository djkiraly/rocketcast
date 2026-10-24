// CommonJS on purpose: Metro/Babel load this file with require().
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
