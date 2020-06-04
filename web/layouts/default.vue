<template>
  <v-app>
    <v-navigation-drawer mini-variant fixed app>
      <div class="fill-height d-flex flex-column">
        <v-list class="flex-grow-1">
          <v-tooltip v-for="(item, i) in menu" :key="i" right>
            <template v-slot:activator="{ on }">
              <v-list-item :to="item.slug" router exact v-on="on">
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" />
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </v-list>
        <v-list>
          <v-tooltip right nudge-right="10">
            <template v-slot:activator="{ on }">
              <v-list-item @click="handleLogout" v-on="on">
                <v-list-item-action>
                  <v-icon>mdi-power</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="'Log out ' + user.name" />
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>Log out {{ user.name }}</span>
          </v-tooltip>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  async middleware({ store, params, $auth, redirect }) {
    if (!$auth.loggedIn) {
      return redirect('/login')
    }
    await store.dispatch('menu/getmenu')
  },
  data() {
    return {
      miniVariant: false
    }
  },
  computed: {
    user() {
      return this.$auth.user || {}
    },
    menu() {
      return this.$store.state.menu.items
    }
  },
  methods: {
    async handleLogout() {
      try {
        await this.$auth.logout()
        this.$router.go()
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    }
  }
}
</script>
