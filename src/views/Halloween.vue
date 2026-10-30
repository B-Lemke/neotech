<link href="https://onlinewebfonts.com" rel="stylesheet"></link>
<script setup>
import { ref, watch, reactive, computed, onMounted } from "vue";

const images = ref([
  { name: "tobby1.jpg", alt: "Tobby Close Up" },
  { name: "tobby2.jpg", alt: "Tobby Skull Sweater" },
  { name: "tobby3.jpg", alt: "Tobby Screaming" },
  { name: "tobby4.jpg", alt: "Tobby Pumpkin" },
  { name: "tobby5.jpg", alt: "Tobby Field" },
  { name: "tobby6.jpg", alt: "Tobby Blanket" },
  { name: "tobby7.jpg", alt: "Tobby Panting" },
  { name: "tobby8.jpg", alt: "Tobby Prison" },
  { name: "tobby9.jpg", alt: "Tobby TobbyShirt" },
  { name: "tobby10.jpg", alt: "Tobby Shark" },
]);


const animationStep = ref(0);
const showcaseStep = ref(90);
const showcaseImageStepLength = ref(20);
const notEnoughTextStep = ref(showcaseStep.value + (showcaseImageStepLength.value * images.value.length + 1));
const secondShowcaseStep = ref(notEnoughTextStep.value + 80);
const fasterTobbyDivisior = ref(3);
const moreTobbiesTextStep = ref(secondShowcaseStep.value + ((showcaseImageStepLength.value) * images.value.length + 1) / fasterTobbyDivisior.value)
const moreTobbiesStep = ref(moreTobbiesTextStep.value + 80);
const animationStarted = ref(false);

const theEnd = ref(moreTobbiesStep.value + 100);

let timerInterval = null;

function getRandomImageName() {
  console.log(images.value[(Math.floor(Math.random() * images.value.length))].name);
  return images.value[(Math.floor(Math.random() * images.value.length))].name;
}

function getImageUrl(name) {
  return new URL(`../assets/halloween/${name}`, import.meta.url).href;
}

const startTimer = () => {
  //animationStep.value = 70;

  timerInterval = setInterval(() => {
    animationStep.value++;
  }, 100);
};

const reset = () => {
  animationStep.value = 0;

};

function startAnimation() {
  animationStarted.value = true;
  startTimer();
}

</script>

<template>
  <div class="content">
    <div v-if="!animationStarted">
      <button class="btn btn-dark" v-on:click="startAnimation"> Scare Me. </button>
    </div>

    <div v-if="animationStarted">
    <div class="text-screen" v-if="animationStep <= showcaseStep - 5">
      <Transition name="fade">
        <h2 v-if="animationStep <= showcaseStep">
          I couldn't come up with a costume.
        </h2>
      </Transition>

      <Transition name="fade">
        <h2
          v-if="animationStep >= 30 && animationStep <= showcaseStep"
          class="my-3"
        >
          So here are the spookiest pictures of my dog.
        </h2>
      </Transition>
    </div>

    <div
      v-if="
        animationStep >= showcaseStep &&
        animationStep < notEnoughTextStep
      "
      class="w-100 h-100"
    >
      <div
        class="showcase-pics"
        v-if="
          animationStep >= showcaseStep &&
          animationStep <=
            notEnoughTextStep
        "
      >
        <img
          v-if="
          animationStep >= showcaseStep &&
          animationStep <=
            notEnoughTextStep - 2
          "
          class="tobby-spotlight"
          :src="
            getImageUrl(
              images[
                Math.floor(
                  (animationStep - showcaseStep) / showcaseImageStepLength,
                )
              ].name,
            )
          "
        />
      </div>
    </div>



      <div class="text-screen" v-if="animationStep >= notEnoughTextStep + 5 && animationStep <= secondShowcaseStep -5">
      
        <Transition name="fade">
          <h2>
            Not spooky enough?
          </h2>
        </Transition>

        <Transition name="fade">
          <h2
            v-if="animationStep >= notEnoughTextStep + 30 && animationStep <= secondShowcaseStep"
            class="my-3"
          >
            Here they are, but faster.
          </h2>
        </Transition>
      </div>

    <div
      v-if="
        animationStep >= secondShowcaseStep &&
        animationStep <= moreTobbiesTextStep
      "
      class="w-100 h-100"
    >
      <div
        class="showcase-pics"
        v-if="
          animationStep >= secondShowcaseStep &&
        animationStep <= moreTobbiesTextStep
        "
      >

        <img
          v-if="
          animationStep >= secondShowcaseStep &&
          animationStep <=
            moreTobbiesTextStep - 2
          "
          class="tobby-spotlight"
          :src="
            getImageUrl(
              images[
                Math.floor(
                  ((animationStep - secondShowcaseStep) / showcaseImageStepLength) * fasterTobbyDivisior,
                )
              ].name,
            )
          "
        />
      </div>
    </div>

      <div class="text-screen" v-if="animationStep >= moreTobbiesTextStep + 5 && animationStep <= moreTobbiesStep - 5">
      
        <Transition name="fade">
          <h2>
            Fine. You've done this to yourself.
          </h2>
        </Transition>

        <Transition name="fade">
          <h2
            v-if="animationStep >= moreTobbiesTextStep + 30 && animationStep <= moreTobbiesStep"
            class="my-3"
          >
            More. Tobby.
          </h2>
        </Transition>
      </div>

      <div class="tobby-grid" v-if="animationStep >= moreTobbiesStep && animationStep <= theEnd">

        <div class="flex-grid">
          <img class="tobby-grid-pic" v-for="index in 16" :key="index" :src=" getImageUrl(
              getRandomImageName(),
            )">

        </div>
      </div>


    <div v-if="animationStep >= theEnd" >
      <h1>Terrifying, right?!</h1>

      <p class="end-text">Okay, maybe I knew all along that he wasn't scary, but you know what I <em>do</em> find really scary? The lack of accessible funding for local arts. <a href="https://neofuturists.org/donate/">Check out this local theater</a> that's doing a fundraiser and consider donating to keep Chicago art thriving.</p>

      <h3>Happy Halloween!!!</h3>


       <img
          class="tobby-spotlight w-100"
          :src="getImageUrl('tobby11.jpg')"
          
        />

      <button v-on:click="reset"  class="btn btn-dark d-block m-auto my-5">Scare me again!</button>
      
    </div>
     </div>
  </div>
</template>

<style scoped>
em {
  font-style: italic;
  border-bottom: 1px solid black;
}

.content {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Chiller W01", monospace;
}

.text-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

/* 2. Declare the starting enter state and final leave state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.showcase-pics {
  padding: 10px;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.tobby-spotlight {
  aspect-ratio: 1 / 1;
  max-width: 600px;
  height: auto;
  width: auto;
  max-height: 80vw;
  margin: auto;
  box-shadow:
    0 19px 38px rgba(0, 0, 0, 0.3),
    0 15px 12px rgba(0, 0, 0, 0.22);
}

.end-text {
  max-width: 600px;
}

.flex-grid {
  display: flex;
  flex-wrap: wrap;
  width: 100%; /* Set your desired total width */
}

.tobby-grid-pic {
  
  flex: 0 0 25%; /* Do not grow, do not shrink, 33.33% base width */
 aspect-ratio: 1 / 1; /* Makes each item a square */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
    width: 100%;
  height: 100%;
  object-fit: cover; /* Prevents stretching; clips edges if necessary */
  display: block;  
}
</style>
