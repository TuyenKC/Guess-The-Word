let wordP = document.querySelector('.game--word p')
let btnRandom = document.querySelector('.game--btn__random')
let btnReset = document.querySelector('.game--btn__reset')
let triesText = document.querySelector('.game--status__tries p')
let triesSpan = document.querySelectorAll('.game--status__tries span')
let misTakesSpan = document.querySelector('.game--status__mistakes span')
let gameGuessing = document.querySelector('.game--guessing')
let scoreText = document.querySelector('.game--score span')
let currentTries = 0;
let maxTries = 5;
let maxLength = 6;
let resultWord = "";
let mistakesHistory = [];
let currentPosition = 0;
let score = 0;
function randomWord(word){
    let marks = [];
    let res = ''
    while(res.length != word.length){
        let randomPos = Math.round(Math.random()* (word.length - 1))
        if(!marks.includes(randomPos)){
            marks.push(randomPos);
            res += word.substr(randomPos, 1)
        }
    }
    return res;
}
function getNewSpace(){
    gameGuessing.innerHTML = '';
    for(let i = 0; i < resultWord.length; i++){
        var spanElement = document.createElement('span')
        gameGuessing.appendChild(spanElement)
    }
}
function updateTries(){
    triesText.innerHTML = `Tries (${currentTries}/${maxTries}): `;
    for(let i = 0; i < maxTries; i++){
        triesSpan[i].classList.remove('active');
    }
    for(let i = 0; i < currentTries; i++){
        triesSpan[i].classList.add('active');
    }
}
function updateMistakesSpan(){
    misTakesSpan.innerHTML = mistakesHistory.join(", ");
}
function updateCurrentSpace(){
    let gameGuessingSpaceList = gameGuessing.querySelectorAll('span')
    if(currentPosition != 0){
        gameGuessingSpaceList[currentPosition-1].classList.toggle('current')
        gameGuessingSpaceList[currentPosition-1].innerHTML = resultWord[currentPosition-1]
    }
    if(currentPosition != gameGuessingSpaceList.length){
        gameGuessingSpaceList[currentPosition].classList.add('current')
        gameGuessingSpaceList[currentPosition].innerHTML = '_'
    }
}
function updateScore(){
    console.log(scoreText);
    scoreText.innerHTML = score;
}
async function getNewWord(){
    let response = await fetch(`https://random-word-api.herokuapp.com/word?length=${Math.round(3+ Math.random()*(maxLength - 3))}`);
    let data = await response.json();
    resultWord = data[0];
    wordP.innerHTML = randomWord(data[0]);
    mistakesHistory = [];
    currentPosition = 0;
    getNewSpace();
    updateCurrentSpace();
    updateMistakesSpan();
}
btnRandom.addEventListener('click', function(e){
    e.preventDefault();
    getNewWord();
})
btnReset.addEventListener('click', function(e){
    e.preventDefault();
    getNewWord();
    currentTries = 0;
    score = 0;
    mistakesHistory = [];
    updateMistakesSpan();
    updateScore();
    updateTries();
})
document.addEventListener('keydown', function(e){
    if(e.key >= 'a' && e.key <= 'z'){
        if(resultWord[currentPosition] != e.key){
            currentTries += 1;
            if(currentTries > 5){
                alert(`Bạn đã thua với số điểm: ${score}`)
                currentTries = 0;
                score = 0;
                mistakesHistory = [];
                getNewWord();
                updateMistakesSpan();
                updateScore();
                updateTries();
            }else{
                mistakesHistory.push(e.key);
                updateTries();
                updateMistakesSpan();
            }
        }else{
            currentPosition += 1;
            updateCurrentSpace();
            mistakesHistory = [];
            updateMistakesSpan();
            if(currentPosition == resultWord.length){
                score += 1;
                currentTries = 0;
                updateScore();
                updateTries();
                getNewWord();
            }
        }
    }
})
function init(){
    triesText.innerHTML = `Tries (${currentTries}/${maxTries}): `;
    getNewWord();
    misTakesSpan.innerHTML = mistakesHistory.join(", ");
    getNewSpace();
    updateScore();
}
init()