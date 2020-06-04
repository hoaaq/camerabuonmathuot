export const state = () => ({
  listcam: [],
  selectedcam: []
})
export const mutations = {
  setcams(state, { data }) {
    state.listcam = data
  },
  selectcam(state, cam) {
    state.selectedcam = [...state.selectedcam, cam]
  },
  sortselect(state, newarr) {
    state.selectedcam = newarr
  },
  removecam(state, cam) {
    state.selectedcam = state.selectedcam.filter((item) => {
      if (item !== cam) return item
    })
  }
}

export const actions = {
  async getcams({ commit }, { input }) {
    try {
      const data = input
        ? await this.$axios.$get('/live/getcams', {
            params: {
              search: input
            }
          })
        : await this.$axios.$get('/live/getcams')
      commit('setcams', { data })
    } catch (error) {
      this.$router.app.error({ statusCode: 404 })
    }
  },
  selectcam({ commit }, cam) {
    commit('selectcam', cam)
  },
  sortselect({ commit }, newarr) {
    commit('sortselect', newarr)
  },
  removecam({ commit }, cam) {
    commit('removecam', cam)
  }
}
