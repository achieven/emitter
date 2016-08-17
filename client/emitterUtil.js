'use strict'
const React = require('react');

let Number = React.createClass({
    propTypes: {
        number: React.PropTypes.number,
        encodedNumber: React.PropTypes.string
    },
    render: function () {
        return (
            <tr>
                <td>Number: {this.props.number}, Encoded Number: {this.props.encodedNumber}</td>
            </tr>
        );
    }
});

let Util = {
    ticker: {
        updateStateWithoutRendering: function (data) {
            let last20Numbers = JSON.parse(JSON.stringify(this.state.last20Numbers));
            if (last20Numbers.length === 20) {
                last20Numbers.shift();
            }
            last20Numbers.push({timestamp: data.timestamp, number: data.number, encodedNumber: data.encodedNumber});
            return last20Numbers;
        },
        buildNumbersToRender: function () {
            let last20NumbersDomElements = [];
            let thisComponent = this;
            this.state.last20Numbers.forEach(function (data) {
                let uniqueChildKey = data.timestamp.toString() + thisComponent.state.numberOfIncomingEmits;
                last20NumbersDomElements.push(
                    <Number key={uniqueChildKey} number={data.number} encodedNumber={data.encodedNumber}/>);
            });
            return last20NumbersDomElements;
        }
    },
    chart: {
        updateStateWithoutRendering: function (data) {
            let emittedTimestamp = data.timestamp;
            let emittedNumber = data.number;
            let last100Timestamps = this.state.last100Timestamps.slice();
            let last100Numbers = this.state.last100Numbers[0].slice();
            if (last100Timestamps.length >= 100) {
                last100Timestamps.shift();
                last100Numbers.shift();
            }
            last100Timestamps.push(emittedTimestamp);
            last100Numbers.push(emittedNumber);
            return {
                last100Timestamps: last100Timestamps,
                last100Numbers: [last100Numbers]
            }
        }
    }

};

module.exports = Util;


