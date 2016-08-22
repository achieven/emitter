'use strict';
const requirejs = require('requirejs');

requirejs([
    'express',
    'http',
    'socket.io',
    'react',
    'react-dom/server',
    'browserify',
    'node-jsx',
    'server/serverUtil.js',
], function (express,
             http,
             socketio,
             React,
             ReactDOMServer,
             browserify,
             jsx,
             util) {
    const app = express();
    const server = http.Server(app);
    const io = socketio(server);
    jsx.install();

    server.listen(3333, function () {
        console.log('listening on localhost:3333')
    });

    app.use(express.static(__dirname + '/'));
    app.use('/bundle.js', function (req, res) {
        browserify('./server/app.js').transform('reactify').bundle().pipe(res);
    });

    app.get('/', function (req, res) {
        const Emitter = require('./client/emitterView.jsx');
        res.setHeader('Content-Type', 'text/html');
        res.end(ReactDOMServer.renderToStaticMarkup(
            React.DOM.body(
                null,
                React.DOM.div({
                    id: 'main',
                    dangerouslySetInnerHTML: {
                        __html: ReactDOMServer.renderToString(React.createElement(Emitter, {
                            ticker: [],
                            chart: {timestamps: [], numbers: [[]]}
                        }))
                    }
                })
            )
        ));
    });

    io.of('/emitterPage').on('connection', function (socket) {
        socket.on('/startEmitter', function (data) {
            if (socket.emitJsonIntervalId) {
                clearInterval(socket.emitJsonIntervalId);
            }
            socket.emitJsonIntervalId = setInterval(function () {
                let jsonObjectToEmit = util.generateJson();
                socket.emit('/showEmittedJson', jsonObjectToEmit);
            }, 1000 / data.emitFrequency);
        });
        socket.on('disconnect', function () {
            clearInterval(socket.emitJsonIntervalId);
        })
    });
})






