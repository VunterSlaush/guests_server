const requireAll = require("require-all");
const mongoose = require("mongoose");

function executeAll(functions, params) {
	let result = params;
	for (var i in functions) {
		result = functions[i](...result);
	}
	return result;
}

function requireAllFolder(folder) {
	return requireAll({
		dirname: folder,
		filter: filename => {
			if (filename == "index.js") return;
			return filename.substring(0, filename.length - 3);
		}
	});
}

function mergeArrays(objOfArrays) {
	let merged = [];
	for (var key in objOfArrays) {
		merged = merged.concat(objOfArrays[key]);
	}
	return merged;
}

function isObjectId(value) {
	try {
		const { ObjectId } = mongoose.Types;
		const asString = value.toString(); // value is either ObjectId or string or anything
		const asObjectId = new ObjectId(asString);
		const asStringifiedObjectId = asObjectId.toString();
		return asString === asStringifiedObjectId;
	} catch (error) {
		return false;
	}
}

function removeDuplicates(arry, prop) {
	return arry.filter((obj, pos, arr) => {
		return (
			arr
				.map(mapObj => {
					return mapObj[prop].toString();
				})
				.indexOf(obj[prop].toString()) === pos
		);
	});
}

module.exports = {
	executeAll,
	requireAllFolder,
	mergeArrays,
	isObjectId,
	removeDuplicates
};
