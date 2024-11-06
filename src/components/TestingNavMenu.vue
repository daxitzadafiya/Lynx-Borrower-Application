<template>
  <v-card class="mx-auto index-1" max-width="280">
    <a class="text-center my-3 mt-4 d-block" @click="changeProgressModelActive">
      {{ progressModelActive ? "Disable" : "Enable" }} Loan Progress Routing
    </a>
    <v-list>
      <v-list-group
        v-for="item in items"
        :key="item.title"
        v-model="item.active"
        no-action
        class="scrolling-item"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title.replace(/([a-z])([A-Z])/g, "$1 $2") }}
            </v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="child in item.items"
          :key="child.title"
          :class="
            $route.name === child.route ? 'pl-10 list-item-shadowed' : 'pl-10'
          "
        >
          <v-list-item-content class="link-item">
            <router-link :to="{ name: child.route }" class="text-black--text">
              <v-list-item-title>
                {{ child.title.replace(/([a-z])([A-Z])/g, "$1 $2") }}
              </v-list-item-title>
            </router-link>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
import navItems from "@/helpers/testingNavHelper.js";
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    items: [
      {
        items: [
          {
            title: "List Item"
          }
        ],
        title: "Attractions"
      },
      {
        items: [
          {
            title: "Breakfast & brunch"
          },
          {
            title: "New American"
          },
          {
            title: "Sushi"
          }
        ],
        title: "Dining"
      },
      {
        items: [
          {
            title: "List Item"
          }
        ],
        title: "Education"
      },
      {
        items: [
          {
            title: "List Item"
          }
        ],
        title: "Family"
      },
      {
        items: [
          {
            title: "List Item"
          }
        ],
        title: "Health"
      },
      {
        items: [
          {
            title: "List Item"
          }
        ],
        title: "Office"
      },
      {
        items: [
          {
            title: "List Item"
          }
        ],
        title: "Promotions"
      }
    ]
  }),
  created() {
    this.items = navItems;
  },
  computed: {
    ...mapGetters({
      progressModelActive: "getProgressModelActive"
    })
  },
  methods: {
    ...mapActions(["toggleProgressModelActive"]),
    changeProgressModelActive() {
      this.toggleProgressModelActive();
    }
  }
};
</script>

<style lang="scss" scoped>
.index-1 {
  z-index: 1;
}

.scrolling-item {
  &:deep(.v-list-group__items) {
    max-height: 250px;
    overflow-y: auto;
  }
}

.list-item-shadowed {
  background-color: #ededed;
}

.link-item {
  a {
    text-decoration: none;
  }
  .router-link-exact-active {
    font-weight: 600;
  }
}
</style>
