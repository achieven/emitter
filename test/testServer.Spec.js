define(['server/serverUtil'], function (util) {
    describe('calculateMantisExponentDecimal', function () {
        it('should return the number itself and exponent 0 for numbers that dont divide in 10', function () {
            var number = 1234;
            var numberExponent = 0;
            var numberMantis = number/Math.pow(10, numberExponent);
            var mantisExponentDecimal = util.calculateMantisExponentDecimal(number);
            var mantisDecimal = mantisExponentDecimal.mantisDecimal;
            var exponentDecimal = mantisExponentDecimal.exponentDecimal;
            expect(mantisDecimal).toEqual(numberMantis);
            expect(exponentDecimal).toEqual(numberExponent);
        });
        it('should return correct mantis and the correct exponent when number does divide in 10', function(){
            var number = 123400010000;
            var numberExponent = 4;
            var numberMantis = number/Math.pow(10, numberExponent);
            var mantisExponentDecimal = util.calculateMantisExponentDecimal(123400010000);
            var mantisDecimal = mantisExponentDecimal.mantisDecimal;
            var exponentDecimal = mantisExponentDecimal.exponentDecimal;
            expect(mantisDecimal).toEqual(numberMantis);
            expect(exponentDecimal).toEqual(numberExponent);
        });
        it('should return the mantis as the number itself and exponent 0 when number <= 31, even if divides in 10', function(){
            var number = 10;
            var numberExponent = 0;
            var numberMantis = number/Math.pow(10, numberExponent);
            var mantisExponentDecimal = util.calculateMantisExponentDecimal(number);
            var mantisDecimal = mantisExponentDecimal.mantisDecimal;
            var exponentDecimal = mantisExponentDecimal.exponentDecimal;
            expect(mantisDecimal).toEqual(numberMantis);
            expect(exponentDecimal).toEqual(numberExponent);
        });
        it('should return mantis 0 and exponent 0 when number is 0', function(){
            var number = 0;
            var numberExponent = 0;
            var numberMantis = number/Math.pow(10, numberExponent);
            var mantisExponentDecimal = util.calculateMantisExponentDecimal(number);
            var mantisDecimal = mantisExponentDecimal.mantisDecimal;
            var exponentDecimal = mantisExponentDecimal.exponentDecimal;
            expect(mantisDecimal).toEqual(numberMantis);
            expect(exponentDecimal).toEqual(numberExponent);
        });
        it('should return mantis 1 and exponent 16 when number is 10^16 (highest available)', function(){
            var number = 10000000000000000;
            var numberExponent = 16;
            var numberMantis = number/Math.pow(10, numberExponent);
            var mantisExponentDecimal = util.calculateMantisExponentDecimal(number);
            var mantisDecimal = mantisExponentDecimal.mantisDecimal;
            var exponentDecimal = mantisExponentDecimal.exponentDecimal;
            expect(mantisDecimal).toEqual(1);
            expect(exponentDecimal).toEqual(16);
        });
    });

    describe('significantDigitsInTable', function(){
        it('should return 0-31 when number <= 31', function(){
            var number = 20;
            var significantDigitsInTable = util.significantDigitsInTable(number, number);
            expect(significantDigitsInTable).toEqual('0-31');
        });
        it('should return 2 when number of significant digits is 1 and number > 31', function(){
            var number = 1000000;
            var mantis = number/Math.pow(10,6);
            var significantDigitsInTable = util.significantDigitsInTable(mantis, number);
            expect(significantDigitsInTable).toEqual('2');
        });
        it('should return the number of significant digits when number of significant digits is an exact key in the table', function(){
            var number = 12345670000;
            var mantis = number/Math.pow(10,4);
            var significantDigitsInTable = util.significantDigitsInTable(mantis, number);
            expect(significantDigitsInTable).toEqual('7');
        });
        it('should return the first key in the table that is bigger than number of significant digits when number of significant digits is not an exact key in the table', function(){
            var number = 123456780000;
            var mantis = number/Math.pow(10,4);
            var significantDigitsInTable = util.significantDigitsInTable(mantis, number);
            expect(significantDigitsInTable).toEqual('10');
        });
    });

    describe('appendZerosToPrefix', function(){
        it('should return empty string when required bits is 0', function(){
            var number = '11111';
            var bits = 0;
            var numberWithAppendedPrefix = util.appendZerosToPrefix(number, bits);
            expect(numberWithAppendedPrefix).toEqual('');
        });
        it('should not append any zeros in prefix when binary number length is exactly number of required bits', function(){
            var number = '11000011010011111';
            var bits = number.length;
            var numberWithAppendedPrefix = util.appendZerosToPrefix(number, bits);
            expect(numberWithAppendedPrefix).toEqual(number);
        });
        it('should append zeros to prefix until number length equals number of required bits', function(){
            var number = '111111';
            var bits = 9;
            var expectedPrefix='';
            var i = 0;
            while(expectedPrefix.length < bits-number.length){
                expectedPrefix+='0';
            }
            var numberWithAppendedPrefix = util.appendZerosToPrefix(number, bits);
            expect(numberWithAppendedPrefix).toEqual(expectedPrefix+number);
        });
    });
});

