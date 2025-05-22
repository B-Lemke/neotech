<script setup>
import { ref, onMounted, reactive, computed } from "vue";

const oliviaGlob = import.meta.glob("@/assets/oliviaPics/*", { eager: true });

const oliviaImages = Object.entries(oliviaGlob).map(
  ([key, value]) => value.default
);

const oliviaImagesVue = reactive(oliviaImages);
const finalOliviaImages = reactive([]);
const oliviaImage1 = ref("");
const oliviaImage2 = ref("");
const imageTransitioning = ref(false);
const cycle = ref(false);
const interval = ref(0);

onMounted(() => {
  pickOliviaImages();
});

function pickOliviaImages() {
  imageTransitioning.value = true;

  setTimeout(() => {
    imageTransitioning.value = false;
  }, 500);

  oliviaImage1.value = "";
  oliviaImage2.value = "";

  if (oliviaImagesVue.length >= 2) {
    oliviaImage1.value = randomImage();
    oliviaImage2.value = randomImage();
  }
}

function randomImage() {
  let randomIndex = Math.floor(Math.random() * oliviaImagesVue.length);
  let randomValue = oliviaImagesVue[randomIndex];
  oliviaImagesVue.splice(randomIndex, 1);
  return randomValue;
}

function selectOliviaPic(picNum) {
  if (picNum == 1) {
    finalOliviaImages.push(oliviaImage1.value);
  } else if (picNum == 2) {
    finalOliviaImages.push(oliviaImage2.value);
  }

  if (finalOliviaImages.length > 1) {
    cycle.value = true;
    interval.value = 2000;
  }

  pickOliviaImages();
}
</script>

<template>
  <div class="content">
  <div class="my-2 d-flex flex-column justify-content-center thirty-f-body">
    <Transition name="fly-down">
      <div
        class="tinderProfile my-4 bg-grey-lighten-5"
        v-if="finalOliviaImages.length > 0"
      >
        <v-carousel
          class="profileCarousel"
          :show-arrows="false"
          :cycle="cycle"
          :interval="interval"
          hide-delimiters
          height="auto"
		  
        >
          <v-carousel-item
            v-for="oliviaPic in finalOliviaImages"
            :key="oliviaPic"
            :src="oliviaPic"
            cover
			class="slideshow-pic"

          ></v-carousel-item>
        </v-carousel>
        
        <div class="tinderBio">
          <h6 class="text-h6">
            <span class="text-h6 text-grey-darken-4">Olivia Soliz</span>
            <span class="mx-2 font-weight-regular text-grey-darken-2">30</span>
            <span
              ><v-icon icon="verified" size="x-small" class="text-blue"
            /></span>
          </h6>
          <p class="bio-text">
            30F. Non Smoker, Social Drinker. 5’2” Bisexual. (No, I do not want to be your “third”) ya nasty. Recently lost the loml to a freak accident - ask me my favorite things about her.
          </p>
        </div>
        <div class="actions d-none justify-content-center">
          <div class="action">
            <v-icon icon="close" class="" />
          </div>
          <div class="action">
            <v-icon icon="star" class="" />
          </div>
          <div class="action">
            <v-icon icon="favorite" class="" />
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div
        class=" olivia-choice d-flex flex-row justify-content-around align-items-center my-5"
        v-if="oliviaImage1 && !imageTransitioning"
      >
        <img
          class="oliviaImageChoice"
          :src="oliviaImage1"
          alt=""
          @click="selectOliviaPic(1)"
        />

        <h3>OR</h3>
        <img
          class="oliviaImageChoice"
          :src="oliviaImage2"
          alt=""
          @click="selectOliviaPic(2)"
        />
      </div>
    </Transition>

    <Transition name="fly-up-next">
      <div
        class="text-center"
        v-if="
          oliviaImage1 == '' && oliviaImage2 == '' && oliviaImagesVue.length < 2
        "
      >
        <h1>Next!</h1>
      </div>
    </Transition>
  </div>
  </div>
</template>

<style scoped>

.content {
  max-width: 1200px;
  margin: auto;
}
/* Actions */
.actions {
  flex: auto;
  display: none;
  /*display: flex;*/
  align-items: center;
  margin: 1rem 0;
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  font-size: 2rem;
  box-shadow: 0 2px 6px 0 rgba(112, 125, 134, 0.14);
}

.actions .action:nth-child(1) {
  color: #fd5068;
}

.actions .action:nth-child(1):hover {
  height: 58px;
  width: 58px;
  font-size: 2.5rem;
}

.actions .action:nth-child(2) {
  height: 48px;
  width: 48px;
  font-size: 1.5rem;
  margin: 0 1rem;
  color: #2db1ff;
}

.actions .action:nth-child(2):hover {
  height: 58px;
  width: 58px;
  font-size: 2.5rem;
}

.actions .action:nth-child(3) {
  color: #1be4a1;
}

.actions .action:nth-child(3):hover {
  height: 58px;
  width: 58px;
  font-size: 2.5rem;
}

.oliviaImageChoice {
  max-height: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 10px 0 rgba(136, 136, 136, 0.77);
}

.olivia-choice {
  height: 30vh;
  max-width: 100vw;
  width: 60vw;
  margin: auto;
}

.tinderProfile {
  width: 30vh;
  margin: auto;
  max-width: 30vh;
  height: 60vh;
  border-radius: 10px;
  box-shadow: 0 2px 10px 0 rgba(136, 136, 136, 0.77);
}

.profileCarousel {
  width: 30vh;
  height: 30vh;
  border-radius: 10px 10px 0 0;
}



.tinderBio {
  padding: 10px;
  font-size: 0.7rem;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.fly-down-enter-active {
  transition: all 0.3s ease-out;
}

.fly-down-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.fly-down-enter-from,
.fly-down-leave-to {
  transform: translateY(-200px);
  opacity: 0;
}

.fly-up-next-enter-active {
  transition: all 0.3s ease-out 3s;
}

.fly-up-next-enter-from,
.fly-up-next-leave-to {
  transform: translateY(200px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.thirty-f-body {
  height: 100vh;
}

@media (max-width: 1200px) {

  .content {
    background:red;
  }

  .bio-text {
    font-size: 0.8rem;
  }
  .tinderProfile {
    width: 50%;
    height: 45vh;
    margin: auto;
    font-size: 0.2rem !important;
    border-radius: 10px;
    box-shadow: 0 2px 10px 0 rgba(136, 136, 136, 0.77);
  }

  .profileCarousel {
    max-height: 200px;
    height: 200px;
    width: 100%;
  }

  .profileCarousel .slideshow-pic {
    max-height: 200px;
    height: 200px;
    width: 100%;
  }

  .action {
    height: 20px;
    width: 20px;
    font-size: 1rem;
    padding: 2px;
  }

  .actions {
    margin: 0.5rem 0;
  }

  p {
    margin-bottom: 0;
  }
}
</style>
