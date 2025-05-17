<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const password = ref("");
const unlocked = ref(false);
const showPass = ref(false);

class Page {
  constructor(name, author, pass, route) {
    this.name = name;
    this.author = author;
    this.pass = pass;
    this.route = route;

  }
}

const authors = {
  BroderickLemke: "Broderick Lemke",
  OliviaSoliz: "Olivia Soliz",
};

const pages = reactive([
  new Page("_unity", authors.BroderickLemke, ["unity", "_unity"], "/unity"),
  new Page(
    "30F. Non Smoker, Social Drinker. 5’2” Bisexual. ",
    authors.OliviaSoliz,
    ["thirtyf", "30f"],
    "/thirtyf"
  ),
  new Page(
    "Playwriting Idea Generator",
    authors.BroderickLemke,
    ["inspiration", "stuck"],
    "/stuck"
  ),
]);

watch(password, async (newPass, oldPass) => {
  if (newPass.toLowerCase() == "insecure") {
    unlocked.value = true;
  }

  pages.forEach((page) => {
    if (Array.isArray(page.pass)) {
      page.pass.forEach((pass) => {
        if (newPass.toLowerCase() == pass) {
          router.push(page.route);
        }
      });
    } else {
      if (newPass.toLowerCase() == page.pass) {
        router.push(page.route);
      }
    }
  });
});
</script>

<template>
  <div class="p-5">
    <div class="row bg-lime-lighten-5 rounded elevation-3 p-2">
      <h2 class="my-2">
        Digital Theater Hub! <v-icon icon="rebase_edit" class="" />
      </h2>

      <v-text-field
        v-model="password"
        :append-icon="showPass ? 'visibility' : 'visibility_off'"
        :type="showPass ? 'text' : 'password'"
        name="input-10-1"
        @click:append="showPass = !showPass"
      ></v-text-field>

      <div v-if="unlocked">
        <h3>Navigation:</h3>
        <v-data-table :items="pages">
          <template v-slot:item.route="{ item }">
            <RouterLink :to="item.route">{{item.route}}</RouterLink>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
