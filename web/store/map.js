export const state = () => ({
  listcam: [],
  selectedcam: null
})
export const mutations = {
  setcams(state, { data }) {
    state.listcam = data
  },
  selectcam(state, cam) {
    state.selectedcam = cam
  },
  clearCam(state) {
    state.selectedcam = null
  }
}

export const actions = {
  async getcams({ commit }, { input }) {
    try {
      const data = input
        ? await this.$axios.$get('/map/getcams', {
            params: {
              search: input
            }
          })
        : await this.$axios.$get('/map/getcams')
      commit('setcams', { data })
    } catch (error) {
      this.$router.app.error({ statusCode: 404 })
    }
  },
  selectcam({ commit }, cam) {
    commit('selectcam', cam)
  },
  clearCam({ commit }) {
    commit('clearCam')
  }
}
