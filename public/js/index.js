$(document).ready(function() {
    var lastTime = 0;
    var dialog = document.getElementById('dialog');
    dialog.showModal();

    $('#ingresarBtn').on('click', function() {
        dialog.close();
        $('#userName').text($('#userInput').val());
    });

    $('#tweet').on('click', function() {
        // hacer POST a /tweet
        // ejemplo de POST
        $.ajax({
            type: 'POST',
            url: '/tweet',
            data: JSON.stringify({ text:$('#tweetContent').val() }),//text es el objeto que esperaba el metodo stringify
            dataType: 'json',
            headers: { 'timestamp': Date.now(), 'user': $('#userName').val()},
            success: function() {
                console.log('el server respondió la petición.');
            }
        });
    });

    // Cada X cantidad de segundos, hacer un GET a /data
    // Por cada elemento de la lista que responda el servidor,
    // agregarlo haciendo $('#contenedor .centre').append(htmlDelTweet)
    // HINT: usar la function getHTMLforTweet, que recibe un objeto que representa
    // un tweet y devuelve un objeto que representa su HTML

//poner set interfval me conviene guardarme el tiempo en el success con variable lastlime que arranca en cero.....

    setInterval(function() {
        $.ajax({
            type: 'GET',
            url: '/data',
            dataType: 'json',
            headers: { 'timestamp': lastResponse, 'user': $('#userName').val()},  
            error: function (request, error) {
                console.log(arguments);
                //alert(" Can't do because: " + error);
            },
            success: function(data) {
                console.log('en cliente en get, el server respondió la petición.',data);
                data.forEach(function(curEl){
                    $('#contenedor.centre').append(getHTMLforTweet(curEl));
                    lastResponse = Date.now();
                });
            }
        }); //del ajax
    }, 5000);

    function getHTMLforTweet(tweet) {
        var elemHTML = $('<div></div>');
        elemHTML.html('User:' + tweet.user.name +
            '<br>' + tweet.text);
        return elemHTML;
    }
});
