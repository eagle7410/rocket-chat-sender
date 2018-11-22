const Request    = require('./Request');
const TdoAuth    = require('./TdoAuth');
const TdoChannel = require('./TdoChannel');
const TdoMessage = require('./TdoMessage');

class RocketAgent {
	/**
	 *
	 * @param {string} host
	 * @param {string} login
	 * @param {string} password
	 * @param {string} protocol
	 */
	constructor ({host, login, password, protocol = 'https'}) {
		this._host       = host;
		this._login      = login;
		this._password   = password;
		this._protocol   = protocol;
		this._provider   = new Request(this._requestData);
		this._authData   = new TdoAuth();
	}


	get _requestData () {
		return {
			protocol : this._protocol,
			host     : this._host
		};
	}

	get _authBody () {
		return {
			user     : this._login,
			password : this._password,
		};
	}

	/**
	 *
	 * @return {Promise<{isAuth: Boolean, body: Object}>}
	 */
	async auth() {
		this._authData.response = await this._provider.post('login', this._authBody);

		return this._authData.resultAuth;
	}

	/**
	 *
	 * @return {{"X-Auth-Token": (null|string), "X-User-Id": (null|string)} & {"Content-Type": string}}
	 */
	get authJsonHeads () {
		return Object.assign(this._authData.authHeader, {'Content-Type' : 'application/json'});
	}


	/**
	 *
	 * @return {Promise<TdoChannel[]>}
	 */
	async channelListJoined() {
		//
		let {statusCode, body} = await this._provider.get(
			'channels.list.joined',
			null,
			this._authData.authHeader
		);

		body = JSON.parse(body);

		if (statusCode !== 200 || !body.success) throw new Error(`Bad response from server \n ${JSON.stringify(body, null, '\t')}`);

		return body.channels.map(ch => {
			const channel = new TdoChannel();
			channel.fromList = ch;

			return channel;
		});

	}

	/**
	 *
	 * @param {TdoChannel} channel
	 * @return {Promise<void>}
	 */
	async channelDelete(channel) {
		if (!(channel instanceof TdoChannel)) throw new Error(`Channel must be TdoChannel`);

		const {statusCode, body} = await this._provider.post(
			'channels.delete',
			{roomId : channel.id},
			this.authJsonHeads
		);

		if (statusCode !== 200) throw new Error(`Bad response from server \n ${JSON.stringify(body, null, '\t')}`);

		return body.success;
	}

	/**
	 *
	 * @param {string} name
	 *
	 * @return {Promise<TdoChannel>}
	 */
	async channelCreate({name}) {
		let {statusCode, body} = await this._provider.post(
			'channels.create',
			{name, members : [this._login]},
			this.authJsonHeads
		);

		if (statusCode !== 200 || !body.success) throw new Error(`Bad response from server \n ${JSON.stringify(body, null, '\t')}`);

		const channel = new TdoChannel();

		channel.fromCreate = body.channel;

		return channel;
	}

	/**
	 *
	 * @param {TdoChannel} channel
	 * @param {string} message
	 *
	 * @return {Promise<TdoMessage>}
	 */
	async channelSend(channel, message) {
		let {statusCode, body} = await this._provider.post(
			'chat.sendMessage',
			{ message : {rid: channel.id, msg :message }},
			this.authJsonHeads
		);

		if (statusCode !== 200) throw new Error(`Bad response from server \n ${JSON.stringify(body, null, '\t')}`);

		const result = new TdoMessage();

		if (body.success) result.fromChantSend = body.message;

		return result;
	}

}

module.exports = RocketAgent;
