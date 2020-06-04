export const state = () => ({
  recursivelist: [],
  selecteditem: {}
})
export const mutations = {
  fetchTree(state, { data }) {
    state.recursivelist = data
  },
  fetchCamsByLocation(state, { item, data }) {
    item.camera = data
    state.selecteditem = item
  }
}

export const actions = {
  async fetchTree({ commit }) {
    try {
      const data = await this.$axios.$get('/cameramanagement')
      commit('fetchTree', { data })
    } catch (error) {
      this.$router.app.error({ statusCode: 404 })
    }
  },
  async fetchCamsByLocation({ commit }, { item }) {
    try {
      const data = await this.$axios.$get('/cameramanagement/findbylocation', {
        params: {
          id: item.id
        }
      })
      commit('fetchCamsByLocation', { item, data })
    } catch (error) {
      this.$router.app.error({ statusCode: 404 })
    }
  }
}
