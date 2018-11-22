const assert = require('assert');
const RocketAgent = require('../classes/RocketAgent');

const {
	protocol,
	host,
	login,
	password
} = require('../configs/connect');

const agent = new RocketAgent({protocol, host, login, password});
const channelTestName = 'test_channel';

describe('Test RocketAgent', function () {

	before(async () => {
		const authResult = await agent.auth();
		assert.ok(authResult.isAuth);

		const list = await agent.channelListJoined();
		assert.ok(Array.isArray(list));

		const channel = list.find(ch => ch.name === channelTestName);

		if (channel) await agent.channelDelete(channel);
	});

	it('test channel create', async () => {
		let channelTest = await agent.channelCreate({name: channelTestName});
		assert.ok(Boolean(channelTest.id));
	});

	it('test send to channel', async () => {
		const list = await agent.channelListJoined();
		const channel = list.find(ch => ch.name === channelTestName);

		const result = await agent.channelSend(channel, 'Test programm message');

		assert.ok(result.isInit);
	});

	it('test channel delete', async () => {
		let list = await agent.channelListJoined();

		let channel = list.find(ch => ch.name ===channelTestName);

		let isDeleted = await agent.channelDelete(channel);

		assert.ok(isDeleted);

		list = await agent.channelListJoined();
		channel = list.find(ch => ch.name ===channelTestName);

		assert.ok(!channel);
	});
});

