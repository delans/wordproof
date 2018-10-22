import React, { Component } from 'react'
import Eos from 'eosjs';
import History from './History'
import Login from './Login'
import HistoryOther from './HistoryOther'

class Board extends Component {

	constructor(props) {
		super(props)
		this.state = {
			historyRecords: [
				// {
				// 	id: 0,
				// 	note: "Call my Mircoon"
				// }
			]
		}
		this.add = this.add.bind(this)
	}

	componentWillMount() {
		// 	var self = this
		// 	if (this.props.count) {
		// 		console.log(`https://baconipsum.com/api/?type=all-meat&sentences=${this.props.count}`)
		// 		fetch(`https://baconipsum.com/api/?type=all-meat&sentences=${this.props.count}`)
		// 			.then(response => response.json())
		// 			.then(json => json[0]
		// 							.split('. ')
		// 							.forEach(sentence => self.add(sentence.substring(0,25))))
		// } else {
		// 	alert('no amount')
		// }
		//
		// console.log(this.self)
	}

	add() {

	}

	render() {

		return (
			<div className="board">
				<Login/>
				<p>Formulier hier</p>

				<h2>WordProof Geschiedenis</h2>
				<a href="#">Complete geschiendenis</a> | <a href="#">Alleen mijn geschiedenis</a>
				<History/>
				<h2>En de wedgeschiedenis</h2>
				<HistoryOther/>
			</div>
		)
	}
}

export default Board
