import React, { Component } from 'react';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

class Login extends Component {
    constructor(props) {
        super(props)

		this.eosjs = null;
        this.scatter = null;


		// Don't forget to tell ScatterJS which plugins you are using.
		ScatterJS.plugins( new ScatterEOS() );


		const network = {
		    blockchain: 'eos',
		    protocol: 'https',
		    host: 'api.eosnewyork.io',
		    port: 443,
		    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'  // kylin net
		}


		// First we need to connect to the user's Scatter.
		ScatterJS.scatter.connect('Word_Proof_test').then(connected => {

		    // If the user does not have Scatter or it is Locked or Closed this will return false;
		    if(!connected) return false;

		    const scatter = ScatterJS.scatter;

		    // Now we need to get an identity from the user.
		    // We're also going to require an account that is connected to the network we're using.
		    const requiredFields = {
				personal:['firstname', 'lastname'],
				accounts:[network] };

		});

		this.playerLoginLogout = this.playerLoginLogout.bind(this)

    }


    componentDidMount = () => {


    }

    playerLoginLogout () {

				    this.scatter.getIdentity(this.requiredFields).then(() => {

				        // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
				        // the user for their account name beforehand. They could still give you a different account.
				        const account = this.scatter.identity.accounts.find(x => x.blockchain === 'eos');

				        // You can pass in any additional options you want into the eosjs reference.
				        const eosOptions = { expireInSeconds:60 };

				        // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
				        const eos = this.scatter.eos(this.network, Eos, eosOptions);

				        // ----------------------------
				        // Now that we have an identity,
				        // an EOSIO account, and a reference
				        // to an eosjs object we can send a transaction.
				        // ----------------------------


				        // Never assume the account's permission/authority. Always take it from the returned account.
				        const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };

				        eos.transfer(account.name, 'helloworld', '1.0000 EOS', 'memo', transactionOptions).then(trx => {
				            // That's it!
				            console.log(`Transaction ID: ${trx.transaction_id}`);
				        }).catch(error => {
				            console.error(error);
				        });

				    }).catch(error => {
				        // The user rejected this request, or doesn't have the appropriate requirements.
				        console.error(error);
				    });


    }

	getPlayerAsset = () => {
		if ( !this.state.is_login || 'Login' === this.state.player_account ) {
			return;
		}

		this.eosjs.getTableRows({
			json: true,
			code: 'eosio.token',
			scope: this.state.player_account,
			table: 'accounts'
		}).then(eosBalance => {
			if ( this.state.is_login && eosBalance.rows[0] ) {  // check if is valid now
				let _player_asset = this.state.player_asset;
				_player_asset.eos = eosBalance.rows[0].balance;
				this.setState({ player_asset: _player_asset });
			}
		}).catch(e => {
			console.error(e);
		})
	}

    render() {

        return (
            <p><a href="#" onClick={this.playerLoginLogout.bind(this)} className='login-logout'>Verbinden met Scatter</a> | Account: accountnaam</p>
        );
    }
}

export default Login;
