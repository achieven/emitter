This project is a web page that displays numbers also in a table and also in a highcharts chart.  
The client tells the server how many times per seconds to emit, the server then generates a random number and encodes it according to the colored coins protocol (has similarity to double percision IEEE-754) and emits it back to the client which renders not more than twice per second.

Instructions:

Setup:    
1. git clone https://github.com/achieven/emitter.git    
2. cd emitter    
3. npm install    

To run app:

1. node index.js
2. Open browser at http://localhost:3333

To run tests:    

1. Right click on test/karma.conf.js and run it    
2. Click on the link that is opened for http://localhost:9876 (maybe a different port to open in browser  - 9878 or similar)
