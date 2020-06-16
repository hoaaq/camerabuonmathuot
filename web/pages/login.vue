<template>
  <div style="height: 100%;" class="d-flex justify-center align-center">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" offset-md="4">
          <v-card class="ma-auto py-5 rounded-0">
            <h1 class="headline text-center nuxtlink--text">Camera AI</h1>
            <ValidationObserver ref="observer">
              <ValidationProvider
                v-slot="{ errors }"
                name="username"
                rules="required"
              >
                <v-text-field
                  v-model="username"
                  label="Username"
                  class="px-12"
                  :error-messages="errors"
                  required
                  @keyup.enter.native="submit"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="password"
                rules="required"
              >
                <v-text-field
                  v-model="password"
                  label="Password"
                  class="px-12"
                  :error-messages="errors"
                  type="password"
                  required
                  @keyup.enter.native="submit"
                ></v-text-field>
              </ValidationProvider>
              <div class="d-flex justify-center mt-5 px-5">
                <v-btn color="accent" block tile elevation="0" @click="submit">
                  Đăng nhập
                </v-btn>
              </div>
            </ValidationObserver>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import soc from '~/plugins/socket.io.js'
export default {
  middleware({ $auth, redirect }) {
    if ($auth.loggedIn) {
      return redirect('/')
    }
  },
  layout: 'blank',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async submit() {
      if (await this.$refs.observer.validate()) {
        try {
          await this.$auth.loginWith('local', {
            data: {
              username: this.username,
              password: this.password
            }
          })
          soc.socket = soc.io.connect(process.env.wsUrl, {
            transports: ['websocket', 'polling']
          })
          await this.$auth.setUser(await this.$axios.get('/user/me'))
          this.$router.push('/')
        } catch (error) {
          this.$toast.error(error.response.data.message)
        }
      }
    }
  }
}
</script>
