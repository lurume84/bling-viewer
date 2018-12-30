function round(value, numDec)
{
    var dec = Math.pow(10, numDec);
    return Math.round(value * dec) / dec;
}