(function() {
	const Tools = function () {};

	/**
	 * Object Merger
	 * @param base: Object - the base object
	 * @param fields: Object - an object with the additional fields
	 * @returns {Object}
	 */
	Tools.prototype.mergeObject = function (base, fields) {
		let newObj = JSON.parse(JSON.stringify(base));
		Object.keys(fields).forEach(k => { newObj[k] = fields[k]; });
		return newObj;

	};

	window.Tools = new Tools();

})();
