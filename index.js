const {getModule} = require('powercord/webpack');
const {inject, uninject} = require('powercord/injector');
const {Plugin} = require('powercord/entities');

module.exports = class DefaultReplyPing extends Plugin {
	async startPlugin() {
		this.injectReplies();

		powercord.api.settings.registerSettings('DRP', {
			category: this.entityID,
			label: 'Default Reply Ping',
			render: require('./Settings.jsx'),
		});
	}

	pluginWillUnload() {
		uninject('drp-pending-reply');
		powercord.api.settings.unregisterSettings('DRP');
	}

	async injectReplies() {
		const module = await getModule(['createPendingReply']);
		const guildStoreModule = await getModule(['getLastSelectedGuildId']);
		const currentUserModule = await getModule(['getCurrentUser']);

		inject(
			'drp-pending-reply',
			module,
			'createPendingReply',
			reply => {
				if (!reply || !reply[0]) return;

				const currentGuild = guildStoreModule.getGuildId();
				const currentUser = currentUserModule.getCurrentUser().id;

				const replyUser = reply[0].message?.author?.id;

				const defaultSetting = this.settings.get('default', true);
				const isGuildOverride =
					currentGuild &&
					this.settings
						.get('override', '')
						.split(' ')
						.includes(currentGuild);
				const isCurrentUser = currentUser == replyUser;

				let result = defaultSetting;
				if (isCurrentUser) {
					result = false;
				} else {
					if (isGuildOverride) {
						result = !defaultSetting;
					}
				}

				reply[0].shouldMention = result;

				return reply;
			},
			true,
		);
	}
};
