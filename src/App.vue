<script setup>
import { ref, watch, reactive, computed } from 'vue'
import { filename } from 'pathe/utils'
import quoteData from './assets/quotes.js'
import letterDisplay from './components/letterDisplay.vue';
import nextMp3 from './assets/next.mp3'

const tobbyGlob = import.meta.glob('@/assets/tobbyPics/*', { eager: true })
const quoteGlob = import.meta.glob('@/assets/quoteImages/*', { eager: true })

const tobbyImages = 
  Object.entries(tobbyGlob).map(([key, value]) => value.default)
const quoteImages = 
Object.fromEntries(
  Object.entries(quoteGlob).map(([key, value]) => [filename(key), value.default])
)

const partnerCodes = reactive({
  101: "terrifying",
  202: "fascinating",
  303: "unifying",
  404: "dividing",
  505: "dangerous",
  606: "accelerating",
  707: "overwhelming",
  808: "magical",
  909: "fun"
})


const isStarted = ref(false)
const startCode = ref("");
const phrase = reactive([]);
const quotes = reactive(quoteData);
const solved = ref(false);
const workingOnPuzzle = ref(false);
const finishedButtonClick = ref(false);
const unparsedSentence = ref("");
const isEnded = ref(false);
const partnerLookupOpen = ref(false);
const audio = new Audio(nextMp3);
const currentPuzzle = reactive({type: "", content: "", rotation: 0, solved: false, completionMessage: ""});
const totalTobbySpins = ref(0);
const partnerCodeInput = ref("");
const isShortPlay = ref(false);

function partnerLookupToggle() {
  partnerLookupOpen.value = !partnerLookupOpen.value;
}

function finishPuzzle() {
  phrase.forEach(word => {
   word.letters.forEach(letter => {
    letter.solved = true;
   })

  });
  solved.value = true;
}

function endPlay() {
  isEnded.value = true;
  audio.play();
}

watch(startCode, (newCode) => {
  let lowerCode = newCode.toLowerCase();

  if(lowerCode == 'social') {
    // Must end with a " " so the last word gets pushed.
    startUpPlay("I miss when tech brought people together ");
  }

  if(lowerCode == 'lonely') {
    // Must end with a " " so the last word gets pushed.
    startUpPlay("I miss when tech united people ");
    isShortPlay.value = true;
  }
})

watch(partnerCodeInput, (newInput) => {
  if(newInput.toLowerCase() == partnerCodes[currentPuzzle.content]) {
    currentPuzzle.solved = true;
  }
})

// Real cheap enum to balance the load
const PuzzleType = {
  QUOTE: "quote",
  QUOTE2: "quote",
  QUOTE3: "quote",
  CLICK: "click",
  PARTNER: "partner"
}

function clickedFinishButton() {
  finishedButtonClick.value = !finishedButtonClick.value;
}

function startUpPlay(phraseString) {
  unparsedSentence.value = phraseString
  isStarted.value = true;
  let phraseLetters = phraseString.split('');
  let letterCount = 0;
  let newWord = [];
  let quoteIndex = -1; // Helpful way not to skip any quotes
  
  let numPuzzleTypes = Object.keys(PuzzleType).length;

  phraseLetters.forEach(letter => {
    let puzzleType = "";

    if(letter == " ") {
      phrase.push(new Word(newWord));
      newWord = [];
      return
    }

    if(letterCount % numPuzzleTypes == 1 ) {
      puzzleType = PuzzleType.CLICK;
    } else if(letterCount % numPuzzleTypes == 3 ) {
      puzzleType = PuzzleType.PARTNER;
    } else {
      puzzleType = PuzzleType.QUOTE; 
      quoteIndex++;
    }

    newWord.push(new Letter(letter, puzzleType, letterCount, puzzleType == PuzzleType.QUOTE ? quoteIndex : 0, false));
    
    letterCount++;
  });
}

const filteredQuotes = computed(() => {
  console.log(isShortPlay, quotes.filter((quote) => {return quote.OmitInShortPlay == null || !quote.OmitInShortPlay }), quotes);
  return isShortPlay.value ? quotes.filter((quote) => {return quote.OmitInShortPlay == null || !quote.OmitInShortPlay }) : quotes;
})


function loadPuzzle(letter) {
  if(!letter.solved) { // Prevent duplicates
    workingOnPuzzle.value = true;
    currentPuzzle.type = letter.type;
    console.log("TEST");
    if(letter.type == PuzzleType.QUOTE) {
      console.log("TEST2");
      console.log(filteredQuotes.value.length);

      // If not enough quotes pick a random one
      if(letter.quoteIndex >= filteredQuotes.value.length) {
        letter.quoteIndex = Math.floor(Math.random()*filteredQuotes.value.length);
      }

        currentPuzzle.content = filteredQuotes.value[letter.quoteIndex]      
    }

    if(letter.type == PuzzleType.CLICK) {
      // Assign a random image of tobby
      currentPuzzle.content = tobbyImages[Math.floor(Math.random()*tobbyImages.length)];
    }

    if(letter.type == PuzzleType.PARTNER) {
      // Assign a random code
      partnerCodeInput.value = "";
      currentPuzzle.content = randomKey(partnerCodes);
    }
    
  }
  letter.solved=true;
}

var randomKey = function (obj) {
    var keys = Object.keys(obj);
    return keys[ keys.length * Math.random() << 0];
};

function completePuzzle() {
  currentPuzzle.puzzleType = "";
  currentPuzzle.content = "";
  currentPuzzle.rotation = 0;
  currentPuzzle.completionMessage = "";
  currentPuzzle.solved = false;
  workingOnPuzzle.value = false;
}

function rotateTobby() {
  let completionPhrases= ["You made him so dizzy! Shame on you.", "Hehe, Tobby go spin", "Same buddy, same.",  "I find this really funny for some reason", "I'm trying to find fun in programming again."]
  currentPuzzle.rotation += 360;

  if(currentPuzzle.rotation >= 3600) {
    if(currentPuzzle.completionMessage == "") {
      currentPuzzle.completionMessage = completionPhrases[Math.floor(Math.random()*completionPhrases.length)]
    }
    currentPuzzle.solved = true;
  }

  totalTobbySpins.value++;
}

class Letter {
  constructor(letter, type, index, quoteIndex = 0, solved = false) {
    this.name = letter;
    this.solved = solved;
    this.type = type;
    this.index = index;
    this.quoteIndex = quoteIndex;
  }
}

class Word {
  constructor(letters) {
    this.letters = letters;
  }
}

</script>

<template>
  <div class="content">
    <div v-if="!isStarted">
      <p>Enter code to begin:</p>
      <input type="text" v-model="startCode" class="form-control"/>
    </div>
    <div v-if="isStarted && !workingOnPuzzle && !solved && !partnerLookupOpen">
      <p>Grab some chalk and work together. Start clicking spaces and write the revealed letters on the board. Divide and conquer. Order does not matter.</p>
      <div class="phrase bg-dark">
        <div v-for="(word,index) in phrase" :key="index" class="words">
          <letter-display v-for="letter in word.letters" :letter="letter" :key="letter.index" @click="loadPuzzle(letter)"></letter-display>
        </div>
      </div>
     
      <button @click="partnerLookupToggle()" class="mt-3 mx-1 btn btn-secondary" v-if="!finishedButtonClick">Partner Lookup</button>
      <button v-if="finishedButtonClick" @click="finishPuzzle()" class="mt-3 mx-1 btn btn-secondary">Only click if full quote is written in chalk so everyone can see it.</button>
      <button @click="clickedFinishButton()" class="mt-3 btn btn-secondary">{{ finishedButtonClick ?  "Cancel" : "We finished it!"}}</button>
      
    </div>

    <div v-if="isStarted && workingOnPuzzle">
      <div v-if="currentPuzzle.type == PuzzleType.QUOTE" class="quote-card">
        <h2 class="quote-header" v-if="currentPuzzle.content.Header">{{ currentPuzzle.content.Header }}</h2>
        
        <p class="quote-body">{{ currentPuzzle.content.Body }}</p>
        <img v-if="currentPuzzle.content.ImageKey != null" :src="quoteImages[currentPuzzle.content.ImageKey]" alt="" class="w-100 m-auto">

        
        <button @click="completePuzzle" class="btn btn-secondary mt-2 mx-auto d-block ">Back</button>
      </div>

      <div v-if="currentPuzzle.type == PuzzleType.CLICK">
        <h2 v-if="!currentPuzzle.solved">Click Tobby. {{ currentPuzzle.rotation >= 360 ? "Again." : "" }} {{ currentPuzzle.rotation >= 720 ? "More." : "" }}</h2>
        <img :src="currentPuzzle.content" alt="" class="tobbyPic" @click="rotateTobby" v-bind:style="{transform: `rotate(${currentPuzzle.rotation}deg)`}">


        
        <button @click="completePuzzle" class="btn btn-secondary mt-2 d-block mx-2" v-if="currentPuzzle.rotation == 0">Click here if Tobby doesn't load after a few seconds.</button>
        <div v-if="currentPuzzle.solved">
          <p class="mt-2">{{currentPuzzle.completionMessage}}</p>
          <button @click="completePuzzle" class="btn btn-secondary mt-2 d-block">Back</button>
        </div>
        
      </div>

      <div v-if="currentPuzzle.type == PuzzleType.PARTNER">
        <h2>Partner Code</h2>
        <p>Ask someone to click the "Partner Lookup" button on the main page. Match the following code to finish the sentence:</p>

        <h3>Code: {{ currentPuzzle.content }}</h3>

        <h3 class="mt-4">Technology is:</h3>
        <input type="text" v-model="partnerCodeInput" /> 

        <div v-if="currentPuzzle.solved">
          <button @click="completePuzzle" class="btn btn-secondary mt-2 d-block">Submit</button>
        </div>
      </div>
    </div>

    <div v-if="partnerLookupOpen">
      
      <table class="table">
        <thead>
          <tr>
            <th scope="col" class="font-weight-bold">Code</th>
            <th scope="col" class="font-weight-bold">Word</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key, index) in partnerCodes" :key="index">
            <td>{{ key }}</td>
            <td>{{value}}</td>
          </tr>
        </tbody>
      </table>
      <button @click="partnerLookupToggle" class="btn btn-secondary">Close Partner Lookup</button>
    </div>

    <div class="solvedMessage quote-card" v-if="isStarted && solved && !isEnded">
      <h2 class="quote-header">{{ unparsedSentence }}</h2>

      <p class="quote-body">Countdown together from 5 and then push this button.</p>
      <button @click="endPlay" class="btn btn-large mx-auto btn-secondary d-block">?</button>
    </div>

    <div v-if="isEnded">
    <p class="quote-card">Fun Fact: You spun tobby {{ totalTobbySpins }} times.</p>
    <h1 class="next1">Next.</h1>
    <h1 class="next2">Next.</h1>
    <h1 class="next3">Next.</h1>
    <h1 class="next4">Next.</h1>
    <h1 class="next5">Next.</h1>
  
  </div>
  </div>
</template>


<style scoped>
.phrase {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  border-radius: 10px;
  border: 3px #71BBB2 solid 
}

.words {
  display:flex;
  flex-direction: row;
  margin-right: 3em;
}

.solvedMessage{
  display: block;
}

.content {
  width:100%;
  margin: auto;
  padding: 10px;
}

.tobbyPic {
  width:95%;
  margin: auto;
  border-radius: 100%;
  transition: transform 0.5s ease-in-out;
  
}

img {
  max-width: 300px;
}

.quote-card {
  background-color: var(--dark-bg-color);
  color: var(--light-bg-color);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 10px 5px 5px #71BBB2;
}

.btn-secondary {
  background-color: #497D74;
}

.quote-header {
  padding:10px;
  text-align: center;
  border-bottom: 1px var(--light-bg-color) solid;
}

.quote-body {
  text-align: center;
}

table {
  border-radius: 10px;
}

th {
  background-color: var(--dark-bg-color);
  color: var(--light-bg-color)
}

.next1 {
  color:#000000;
  text-shadow: 1px 1px 2px #27445D;
  animation: blinkAnimation 2.5s linear infinite;
  animation-delay: -2.5s;
}
.next2 {
  color:#27445D;
  text-shadow: 1px 1px 2px #497D74;
  animation: blinkAnimation 2.5s linear infinite;
  animation-delay: -2s;
}
.next3 {
  color:#497D74;
  text-shadow: 1px 1px 2px #71BBB2;
  animation: blinkAnimation 2.5s linear infinite;
  animation-delay: -1.5s;
}
.next4 {
  color:#71BBB2;
  text-shadow: 1px 1px 2px #EFE9D5;
  animation: blinkAnimation 2.5s linear infinite;
  animation-delay: -1s;
}
.next5 {
  color:#EFE9D5;
  text-shadow: 1px 1px 2px #000000;
  animation: blinkAnimation 2.5s linear infinite;
  animation-delay: -0.5s;
}

@keyframes blinkAnimation {
  0% {
    opacity: 0%;
  }
  20% {
    opacity: 100%;
  }
  40%{
    opacity: 0%;
  }
  100% {
    opacity: 0%;
  }

}

</style>
