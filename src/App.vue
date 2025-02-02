<script setup>
import { ref, watch, reactive } from 'vue'
import quoteData from './assets/quotes.js'
import letterDisplay from './components/letterDisplay.vue';
import nextMp3 from './assets/next.mp3'
import tobbyPic1 from '@/assets/tobysquare.jpg';


const isStarted = ref(false)
const startCode = ref("");
const phrase = reactive([]);
const quotes = reactive(quoteData);
const solved = ref(false);
const workingOnPuzzle = ref(false);
const finishedButtonClick = ref(false);
const unparsedSentence = ref("");
const isEnded = ref(false);
const audio = new Audio(nextMp3);
const currentPuzzle = reactive({type: "", content: "", rotation: 0, solved: false, completionMessage: ""});
const tobbyImages = [tobbyPic1];
const totalTobbySpins = ref(0);

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
    startUpPlay("I am sick of tech that pits us against each other ");
  }

  if(newCode == 'fear') {
    // Must end with a " " so the last word gets pushed.
    startUpPlay("I miss back when tech brought people together ");
  }
})

const PuzzleType = {
  QUOTE: "quote",
  QUOTE2: "quote",
  CLICK: "click",
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
    
  }
  letter.solved=true;
}

function completePuzzle() {
  currentPuzzle.puzzleType = "";
  currentPuzzle.content = "";
  currentPuzzle.rotation = 0;
  currentPuzzle.completionMessage = "";
  currentPuzzle.solved = false;
  workingOnPuzzle.value = false;
}

function rotateTobby() {
  let completionPhrases= ["You made him so dizzy! Shame on you.", "Hehe, Tobby go spin", "Same buddy, same."]
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
    <div v-if="isStarted && !workingOnPuzzle && !solved">
      <p>Grab some chalk and work together. Start clicking letters.</p>
      <div class="phrase">
        <div v-for="(word,index) in phrase" :key="index" class="words">
          <letter-display v-for="letter in word.letters" :letter="letter" :key="letter.index" @click="loadPuzzle(letter)"></letter-display>
        </div>
      </div>
     
      <button v-if="finishedButtonClick" @click="finishPuzzle()" class="mt-3 btn btn-primary">Only click this if everything is written in chalk.</button>
      <button @click="clickedFinishButton()" class="mt-3 btn btn-primary">{{ finishedButtonClick ?  "Cancel" : "We finished it!"}}</button>
      
    </div>

    <div v-if="isStarted && workingOnPuzzle">
      <div v-if="currentPuzzle.type == PuzzleType.QUOTE">
        <h2>{{ currentPuzzle.content.Header }}</h2>
        <p>{{ currentPuzzle.content.Body }}</p>

        
        <button @click="completePuzzle" class="btn btn-primary mt-2 d-block">Back</button>
      </div>

      <div v-if="currentPuzzle.type == PuzzleType.CLICK">
        <h2 v-if="!currentPuzzle.solved">Click Tobby. {{ currentPuzzle.rotation >= 360 ? "Again." : "" }}</h2>
        <img :src="currentPuzzle.content" alt="" class="tobbyPic" @click="rotateTobby" v-bind:style="{transform: `rotate(${currentPuzzle.rotation}deg)`}">

        <div v-if="currentPuzzle.solved">
          <p class="mt-2">{{currentPuzzle.completionMessage}}</p>
          <button @click="completePuzzle" class="btn btn-primary mt-2 d-block">Back</button>
        </div>
        
      </div>
    </div>

    <div class="solvedMessage" v-if="isStarted && solved && !isEnded">
      <h2>{{ unparsedSentence }}</h2>

      <p>Countdown from 5 outloud as a group and push this button when you reach 0.</p>
      <button @click="endPlay" class="btn btn-large btn-primary">?</button>
    </div>

    <div v-if="isEnded"><h1>Next.</h1></div>
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
</style>
