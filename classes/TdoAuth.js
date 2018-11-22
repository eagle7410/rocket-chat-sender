class TdoAuth {
	constructor () {
		this._statusCode = null;
		this._authToken  = null;
		this._userId     = null;
		this._body       = null;
		this._userInfo   = null;
	}

	/**
	 *
	 * @return {{"X-Auth-Token": null|string, "X-User-Id": null|string}}
	 */
	get authHeader () {
		return {
			'X-Auth-Token' : this._authToken,
			'X-User-Id'    : this._userId
		};
	}

	/**
	 *
	 * @param {number} statusCode
	 * @param {object} body
	 *
	 * @return {*}
	 */
	set response ({statusCode, body}) {
		this._statusCode = statusCode;

		if (!this.isResponseStatusOk) {
			this._body = body;
			return false;
		}

		const {userId, authToken, me} = body.data;

		this._authToken = authToken;
		this._userId    = userId;
		this._userInfo  = me;
	}

	/**
	 *
	 * @return {*}
	 */
	get body () {
		return this.isHasAuthToken
			? {}
			: this._body;
	}

	/**
	 *
	 * @return {{isAuth: Boolean, body: Object}}
	 */
	get resultAuth() {
		return {
			isAuth : this.isHasAuthToken,
			body   : this.body
		};
	}

	/**
	 *
	 * @return {boolean}
	 */
	get isHasAuthToken () {
		return this._authToken !== null;
	}

	/**
	 *
	 * @return {boolean}
	 */
	get isResponseStatusOk () {
		return this.statusCode === 200;
	}

	/**
	 *
	 * @return {null|number}
	 */
	get statusCode() {
		return this._statusCode;
	}
}

module.exports = TdoAuth;
