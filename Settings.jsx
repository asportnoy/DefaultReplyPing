const {React} = require('powercord/webpack');
const {TextInput, SwitchItem} = require('powercord/components/settings');

module.exports = class Settings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {opened: {main: false}};
	}
	render() {
		const {getSetting, updateSetting} = this.props;

		return (
			<div>
				<SwitchItem
					note="If the server doesn't have an override, this will be used."
					value={getSetting('default', true)}
					onChange={v => updateSetting('default', v)}
				>
					Default Setting
				</SwitchItem>
				<TextInput
					note="These servers will do the opposite of the default option. This should be a list of server IDs separated by spaces."
					value={getSetting('override', '')}
					onChange={v => updateSetting('override', v)}
				>
					Override list
				</TextInput>
			</div>
		);
	}
};
