
class TdoChannel {

	constructor () {
		this._id         = null;
		this._name       = null;
		this._msgsCount  = null;
		this._default    = null;
		this._updatedAt  = null;
		this._usersCount = null;
	}

	get id () {
		return this._id;
	}

	get name () {
		return this._name;
	}

	/**
	 *
	 * @param {object} data Example object from rocket { _id: 'GENERAL', ts: '2018-02-27T16:16:59.727Z', t: 'c', name: 'general', msgs: 294,default: true, _updatedAt: '2018-11-22T08:55:10.647Z',lm: '2018-11-16T11:57:15.072Z',usersCount: 0 }
	 */
	set fromList (data) {
		this._id         = data._id;
		this._name       = data.name;
		this._msgsCount  = data.msgs;
		this._default    = data.default;
		this._updatedAt  = data._updatedAt;
		this._usersCount = data.usersCount;
	}


	set fromCreate ({_id, name, msgs, usernames, usersCount}) {
		this._id         = _id;
		this._name       = name;
		this._msgsCount  = msgs;


		this._usersCount = usersCount ? usersCount : (Array.isArray(usernames) ? usernames.length : 0);
	}
}


module.exports = TdoChannel;

