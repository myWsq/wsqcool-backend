import * as requireContext from 'require-context';
import * as merge from 'deepmerge';
const files = requireContext(__dirname, true, /\.ts$/);

let module = {};

files.keys().forEach((key) => {
	module = merge(module, files(key));
});

export default module;
