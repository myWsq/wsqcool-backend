var requireContext = require('require-context');
var merge = require('deepmerge');
const files = requireContext(__dirname, true, /\.ts$/);

var module = {};

files.keys().forEach((key) => {
	module = merge(module, files(key));
});

export default module;
