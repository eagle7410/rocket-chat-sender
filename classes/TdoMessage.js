class TdoMessage {
	constructor() {
		this._id       = null;
		this._rid      = null;
		this._text     = null;
		this._channels = null;
	}

	set fromChantSend({rid, _id, msg, channels}) {
		this._id       = _id;
		this._rid      = rid;
		this._text     = msg;
		this._channels = channels;
	}

	get isInit () {
		return this._id !== null;
	}
}

module.exports = TdoMessage;

