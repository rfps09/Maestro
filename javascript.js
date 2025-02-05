function copyText(id) {
    // Get the text field
    var copyText = document.getElementById(id);

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.innerText);

    // Alert the copied text
    // alert("Copied the text: " + copyText.innerText);
    copied(id+'-copied');
}

function copied(id) {
    var notification = document.getElementById(id);
    notification.hidden = false;

    setTimeout(() => {
        notification.hidden = true;
    }, 1000);
}

function strip_deque(deque) {
    while(deque && deque[0] == ' ')
        deque.shift();
    while(deque && deque[deque.length - 1] == ' ')
        deque.pop();
}

function descarga(buffer) {
    regex = '';
    strip_deque(buffer);
    if(buffer.length) {
        regex = '(?=.*('.concat(buffer.join(''), '))')
    }
    return regex;
}

function myFunction() {
    var termos = document.getElementById("entrada").value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    var agrupadores = [ '(' , ')' ];
    var sigla = [ '{' , '}' ];
    var operadores = [ ',' , '&' ];
    var coringas = [ '%' , '_' ];
    var pilha = [];
    var deque = [];
    var regex = '';

    for(let i = 0; i < termos.length; i++) {
        var char = termos[i];

        if(operadores.includes(char)) {
            if(deque) regex = regex.concat(descarga(deque));
            deque = [];
            if(char == ',') regex = regex.concat('|');
        }
        else if(agrupadores.includes(char)) {
            if(char == '(') {
                pilha.push('(');
                regex = regex.concat('(');
            }
            else if(char == ')' && pilha[pilha.length - 1] == '(') {
                pilha.pop();
                if(deque) regex = regex.concat(descarga(deque));
                deque = [];
                regex = regex.concat(')');
            }
        }
        else if(sigla.includes(char)) {
            if(char == '{') pilha.push('{');
            else if(char == '}' && pilha[pilha.length - 1] == '{') {
                pilha.pop();
                strip_deque(deque);
                // deque = ['(', '^', '|', ',', '|', '\\', '.', '|', ' ', '|', '\\', '(', '|', '"', ')'].concat(deque);
                // deque = deque.concat(['(', '$', '|', ',', '|', '\\', '.', '|', ' ', '|', '\\', ')', '|', '"', ')']);
                deque = ['(', '\\', 'W', '|', '^', ')'].concat(deque);
                deque = deque.concat(['(', '\\', 'W', '|', '$', ')']);
            }
        }
        else if(coringas.includes(char)) {
            if(char == '%') deque = deque.concat(['.','*']);
            if(char == '_') deque = deque.concat(['.','?']);
        }
        else {
            if(char.match(/^[0-9a-zA-Z]+$/) || char == ' ') deque.push(char);
            else deque = deque.concat(['.', '?']);
        }
    }

    if(deque) regex = regex.concat(descarga(deque));
    deque = [];
    regex = '^('.concat(regex, ')');
    if(pilha.length > 0 || regex.length <= 3) document.getElementById("saida").innerHTML = "<strong>Erro:</strong> Entrada mal formatada";
    else document.getElementById("saida").innerHTML = "<strong>REGEX:</strong> <span id='regex'>" + regex + '</span>';
}