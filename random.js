exports.randomString = (length = 32) => {
    var string = 'asdfghjklzxcvbnmqwertyuiop123456789';
    var arr = [];
    for(var i = 0; i < length; i++){
        var random = parseInt(Math.random() * string.length);
        arr[i] = string[random];
    };
    return arr.join('');
};

exports.randomNumber = (min, max) =>{ //ko bao gồm max
    return Math.floor(Math.random() * (max - min)) + min;
}
