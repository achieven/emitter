'use strict';
let emitter;
const React = require('react');

const util = require('./emitterUtil.js');
let tickerComponent, chartComponent;
let emitFrequency, throttleBufferSize;
const maxRendersPerSecond = 2;

let Form = React.createClass({
    render: function () {
        return (
            <form id="emitFrequencyForm">
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4 col-xs-8">
                            <label>Insert Emit Frequency Here: </label>
                            <input className="form-control" type='number' placeholder='use only positive integers'/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-4 col-xs-8">
                        <button className="btn btn-default col-xs-12" type='submit'>Change emit frequency</button>
                    </div>
                </div>
            </form >
        );
    }
});

let Ticker = React.createClass({
    propTypes: {
        last20Numbers: React.PropTypes.array
    },
    getInitialState: function () {
        tickerComponent = this;
        this.elementsInsideBuffer = 0;
        return {
            last20Numbers: (this.props.last20Numbers || []),
            numberOfIncomingEmits: (this.props.numberOfIncomingEmits || 0)
        };
    },
    handleIncomingEmit: function (data) {
        let thisComponent = this;
        let last20Numbers;

        last20Numbers = util.ticker.updateStateWithoutRendering.call(thisComponent, data);
        this.elementsInsideBuffer++;
        this.setState({
            last20Numbers: last20Numbers,
            numberOfIncomingEmits: this.state.numberOfIncomingEmits + 1
        });
    },
    shouldComponentUpdate: function () {
        if (this.elementsInsideBuffer >= throttleBufferSize) {
            return true;
        }
        else {
            return false;
        }
    },
    render: function () {
        this.last20NumbersDomElements = util.ticker.buildNumbersToRender.call(this);
        return (
            <table className="table">
                <tbody>
                {this.last20NumbersDomElements || []}
                </tbody>
            </table>
        );
    },
    componentDidUpdate: function () {
        this.elementsInsideBuffer = 0;
    },
});

let Chart = React.createClass({
    propTypes: {
        last100Timestamps: React.PropTypes.arrayOf(React.PropTypes.number),
        last100Numbers: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number))
    },
    getInitialState: function () {
        chartComponent = this;
        this.elementsInsideBuffer = 0;
        return {
            last100Timestamps: (this.props.last100Timestamps || []),
            last100Numbers: (this.props.last100Numbers || [[]])
        };
    },
    handleIncomingEmit: function (data) {
        let thisComponent = this;
        let last100Data = util.chart.updateStateWithoutRendering.call(this, data);
        this.elementsInsideBuffer++;
        this.setState({
            last100Timestamps: last100Data.last100Timestamps,
            last100Numbers: last100Data.last100Numbers
        });
    },
    shouldComponentUpdate: function () {
        if (this.elementsInsideBuffer >= throttleBufferSize) {
            return true;
        }
        else {
            return false;
        }
    },
    render: function () {
        return (<div className="chart"></div>);
    },
    componentDidUpdate: function () {
        this.elementsInsideBuffer = 0;
        new Chartist.Line(
            '.chart',
            {
                labels: this.state.last100Timestamps,
                series: this.state.last100Numbers
            }
        );
    }
});

let Emitter = React.createClass({
    propTypes: {
        ticker: React.PropTypes.array,
        chart: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            ticker: (this.props.ticker || []),
            chart: (this.props.chart || {timestamps: [], numbers: [[]]})
        };
    },
    componentDidMount: function () {
        let socket = io.connect('/emitterPage');
        $('#emitFrequencyForm').submit(function (event) {
            event.preventDefault();
            if ($('#emitFrequencyForm :input').val() > 0) {
                emitFrequency = $('#emitFrequencyForm :input').val();
                throttleBufferSize = emitFrequency / maxRendersPerSecond;
                socket.removeAllListeners('/showEmittedJson');
                socket.emit('/startEmitter', {emitFrequency: emitFrequency});
                socket.on('/showEmittedJson', function (data) {
                    tickerComponent.handleIncomingEmit(data);
                    chartComponent.handleIncomingEmit(data);
                });
            }
        });
    },
    render: function () {
        return (
            <div>
                <div className="container">
                    <Form ></Form>
                    <Ticker last20Numbers={this.props.ticker} numberOfIncomingEmits={0}></Ticker>
                    <Chart last100Timestamps={this.props.chart.timestamps}
                           last100Numbers={this.props.chart.numbers}>
                    </Chart>
                </div>
                <script src="./node_modules/socket.io/node_modules/socket.io-client/socket.io.js"></script>
                <script src="./node_modules/jquery/dist/jquery.min.js"></script>
                <script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
                <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.min.css"/>
                <script src="./node_modules/chartist/dist/chartist.min.js"></script>
                <link rel="stylesheet" href="./node_modules/chartist/dist/chartist.min.css"/>
                <script src="/bundle.js"></script>
            </div>
        )
    }
});
module.exports = Emitter;
