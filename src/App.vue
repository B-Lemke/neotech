<script setup>
import { ref, watch, reactive } from 'vue'
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
  console.log(quoteImages, tobbyImages, tobbyGlob);

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
  if(newCode == 'frustration') {
    // Must end with a " " so the last word gets pushed.
    startUpPlay("I miss when tech brought people together ");
  }

  if(newCode == 'lonely') {
    // Must end with a " " so the last word gets pushed.
    startUpPlay("I miss when tech united people ");
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

function loadPuzzle(letter) {
  if(!letter.solved) { // PRevent duplicates
    workingOnPuzzle.value = true;
    currentPuzzle.type = letter.type;

    if(letter.type == PuzzleType.QUOTE) {
      // If not enough quotes pick a random one
      if(letter.quoteIndex >= quotes.length) {
        letter.quoteIndex = Math.floor(Math.random()*quotes.length);
      }

      //Assign quote
      currentPuzzle.content = quotes[letter.quoteIndex]
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
      <p>Grab some chalk and work together. Start clicking letters. Divide and conquer or this will take a long time.</p>
      <div class="phrase">
        <div v-for="(word,index) in phrase" :key="index" class="words">
          <letter-display v-for="letter in word.letters" :letter="letter" :key="letter.index" @click="loadPuzzle(letter)"></letter-display>
        </div>
      </div>
     
      <button @click="partnerLookupToggle()" class="mt-3 mx-1 btn btn-primary" v-if="!finishedButtonClick">Partner Lookup</button>
      <button v-if="finishedButtonClick" @click="finishPuzzle()" class="mt-3 btn btn-primary">Only click if full quote is written in chalk so everyone can see it.</button>
      <button @click="clickedFinishButton()" class="mt-3 btn btn-primary">{{ finishedButtonClick ?  "Cancel" : "We finished it!"}}</button>
      
    </div>

    <div v-if="isStarted && workingOnPuzzle">
      <div v-if="currentPuzzle.type == PuzzleType.QUOTE">
        <h2>{{ currentPuzzle.content.Header }}</h2>
        <p>{{ currentPuzzle.content.Body }}</p>
        <img v-if="currentPuzzle.content.ImageKey != null" :src="quoteImages[currentPuzzle.content.ImageKey]" alt="" class="w-100 m-auto">

        
        <button @click="completePuzzle" class="btn btn-primary mt-2 d-block">Back</button>
      </div>

      <div v-if="currentPuzzle.type == PuzzleType.CLICK">
        <h2 v-if="!currentPuzzle.solved">Click Tobby. {{ currentPuzzle.rotation >= 360 ? "Again." : "" }} {{ currentPuzzle.rotation >= 720 ? "More." : "" }}</h2>
        <img :src="currentPuzzle.content" alt="" class="tobbyPic" @click="rotateTobby" v-bind:style="{transform: `rotate(${currentPuzzle.rotation}deg)`}">

        <div v-if="currentPuzzle.solved">
          <p class="mt-2">{{currentPuzzle.completionMessage}}</p>
          <button @click="completePuzzle" class="btn btn-primary mt-2 d-block">Back</button>
        </div>
        
      </div>

      <div v-if="currentPuzzle.type == PuzzleType.PARTNER">
        <h2>Partner Code</h2>
        <p>Ask someone to click the "Partner Lookup" button on the main page. Match the following code to finish the sentence:</p>

        <h3>Code: {{ currentPuzzle.content }}</h3>

        <h3 class="mt-4">Technology is:</h3>
        <input type="text" v-model="partnerCodeInput" /> 

        <div v-if="currentPuzzle.solved">
          <button @click="completePuzzle" class="btn btn-primary mt-2 d-block">Submit</button>
        </div>
      </div>
    </div>

    <div v-if="partnerLookupOpen">
      
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Word</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key, index) in partnerCodes" :key="index">
            <th>{{ key }}</th>
            <td>{{value}}</td>
          </tr>
        </tbody>
      </table>
      <button @click="partnerLookupToggle" class="btn btn-primary">Close Partner Lookup</button>
    </div>

    <div class="solvedMessage" v-if="isStarted && solved && !isEnded">
      <h2>{{ unparsedSentence }}</h2>

      <p>Countdown together from 5 and then push this button.</p>
      <button @click="endPlay" class="btn btn-large btn-primary">?</button>
    </div>

    <div v-if="isEnded">
    <p>Fun Fact: You spun tobby {{ totalTobbySpins }} times.</p>
    <h1>Next.</h1></div>
  </div>
</template>


<style scoped>
.phrase {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
</style>
