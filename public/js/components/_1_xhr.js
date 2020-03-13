(function() {
	const XHR = function () {};

	/**
	 * @param {String} method
	 * @param {String} url
	 * @param {Function} doneStateHandler
	 */
	XHR.prototype.create = function(method, url, doneStateHandler) {
		const xhr = new XMLHttpRequest();
		xhr.open(method, url);
		if (doneStateHandler !== undefined && doneStateHandler !== null) {
			xhr.onreadystatechange = e => {
				if (xhr.readyState === 4) {
					doneStateHandler(xhr, e);
				}
			};
		}
		return xhr;
	};

	/**
	 * @param {String} method
	 * @param {String} url
	 * @param {Function} doneStateHandler
	 * @param {*} data
	 */
	XHR.prototype.createAndSend = function (method, url, doneStateHandler, data) {
		this.create(method, url, doneStateHandler).send(data);
	};

	window.XHR = new XHR();

})();
