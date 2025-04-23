<script setup>
import { ref, watch, reactive, computed } from 'vue'
import stuckData from '../assets/stuck.js'

class Challenge {
  constructor(id, inspo, type, challenge, date, notes, author) {
    this.Id = id;
    this.Inspiration = inspo;
    this.Type = type;
    this.Challenge = challenge;
    this.Date = date;
    this.Notes = notes;
    this.Author = author;
  }
}

const challenges = reactive([]);
let challengeId = 0;

stuckData.forEach((piece) => {
    piece.Challenges.forEach((chal) => {
        if(chal != "") {
            challenges.push(new Challenge(challengeId, piece.Inspiration, piece.Type, chal, piece.Date, piece.Notes, piece.Author))
            challengeId++;
        }
    })
});

let currentChallenge = ref(null);
let showMoreInfo = ref(false);

function getNewChallenge() {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    currentChallenge.value = challenges[randomIndex];
}

function toggleShowMoreInfo() {
    showMoreInfo.value = !showMoreInfo.value;
}
</script>

<template>
    <div class="content p-4">
        <button @click="getNewChallenge" class="my-3 mx-1 btn btn-secondary">Inspire Me</button>

        <div v-if="currentChallenge != null">
            <h2>{{ currentChallenge.Challenge }}</h2>

            <div v-if="showMoreInfo"> 
                <hr>
                <p>Inspiration: {{ currentChallenge.Inspiration }}</p>
                <p>Type: {{ currentChallenge.Type }}</p>
                <p>Notes: {{ currentChallenge.Notes ? currentChallenge.Notes : "None"}}</p>
                <p>Author: {{ currentChallenge.Author }}</p>
                <p>Date: {{ currentChallenge.Date }}</p>
                <p>Id: {{ currentChallenge.Id }}</p>

            </div>
            <button @click="toggleShowMoreInfo" class="mt-3 mx-1 btn btn-secondary">
                {{ showMoreInfo ? "Hide More Info" : "Show More Info" }}
            </button>
        </div>

    </div>
  </template>

  <style scoped></style>