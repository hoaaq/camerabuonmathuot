export const state = () => ({
  items: []
})
export const mutations = {
  setmenu(state, { data }) {
    state.items = data
  }
}

export const actions = {
  async getmenu({ commit }) {
    try {
      const data = await this.$axios.$get('/menu')
      commit('setmenu', { data })
    } catch (error) {
      this.$router.app.error({ statusCode: 404 })
    }
  }
}
