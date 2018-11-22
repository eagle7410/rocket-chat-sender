const request = require('request');

class Request {
	constructor ({protocol, host}) {
		this._host     = host;
		this._protocol = protocol;
	}

	send ({url, method, body, headers, json}) {
		return new Promise((ok, bad)=> {
			request(
				{url, headers, method, body, json},
				(err, result) => {
					if (err) return bad(err);

					const {statusCode, body} = result;

					ok({statusCode, body});
				}
			)
		});
	}

	/**
	 *
	 * @param {string} apiPath
	 * @param {object} data
	 *
	 * @return {string}
	 */
	url (apiPath, data) {
		let queryString = '';

		if (data && typeof data === 'object') queryString = '?' + (new URLSearchParams(data || {})).toString();

		return `${this.urlBaseApi}/${apiPath + queryString}`;
	}

	post (apiPath, data, headers) {
		return this.send({
			url    : this.url(apiPath),
			method : 'post',
			body   : data,
			json   : true,
			headers,
		})
	}

	get (apiPath, data, headers) {
		return this.send({
			url    : this.url(apiPath, data),
			method : 'get',
			headers,
		})
	}
	get urlBase () {
		return `${this._protocol}://${this._host}`;
	}

	get urlBaseApi () {
		return `${this.urlBase}/api/v1`;
	}
}

module.exports = Request;
