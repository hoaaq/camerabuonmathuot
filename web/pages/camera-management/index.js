export default {
  async middleware({ store }) {
    await store.dispatch('cameramanagement/fetchTree')
  },
  data() {
    return {
      title: 'Quản lý camera',
      dialog: false,
      dialogFile: false,
      dialogDvr: false,
      modalTitle: '',
      modalItem: {},
      editedIndex: -1,
      fileUpload: null,
      fileLocation: null,
      dvrlink: null
    }
  },
  computed: {
    recursivelist() {
      return this.$store.state.cameramanagement.recursivelist
    },
    selecteditem() {
      return this.$store.state.cameramanagement.selecteditem
    }
  },
  methods: {
    async selectLocation(item) {
      if (item[0]) {
        await this.$store.dispatch('cameramanagement/fetchCamsByLocation', {
          item: item[0]
        })
      }
    },

    addcam() {
      this.modalTitle = 'Thêm mới camera'
      this.editedIndex = -1
      this.modalItem = {}
      this.dialog = true
    },
    async editcam(item) {
      this.modalTitle = 'Chỉnh sửa camera'
      this.editedIndex = item.id
      try {
        this.modalItem = await this.$axios.$get(
          '/cameramanagement/findbycamid',
          {
            params: {
              id: item.id
            }
          }
        )
        this.dialog = true
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    },
    async del(item) {
      if ((await this.$swal()).value === true) {
        try {
          await this.$axios.$delete('/cameramanagement', {
            params: {
              id: item.id
            }
          })
          this.$toast.success('Xóa thành công')
          await this.refresh()
        } catch (error) {
          this.$toast.error(error.response.data.message)
        }
      }
    },
    async saveChange() {
      if (await this.$refs.observer.validate()) {
        try {
          if (this.editedIndex > -1) {
            await this.$axios.$put('/cameramanagement', {
              id: this.editedIndex,
              ...this.modalItem
            })
            this.dialog = false
            this.$toast.success('Cập nhật thành công')
          } else {
            await this.$axios.$post('/cameramanagement', {
              ...this.modalItem,
              location_id: this.selecteditem.id
            })
            this.dialog = false
            this.$toast.success('Thêm mới thành công')
          }
          await this.refresh()
        } catch (error) {
          this.$toast.error(error.response.data.message)
        }
      }
    },

    async refresh() {
      await this.$store.dispatch('cameramanagement/fetchTree')
      if (this.selecteditem) {
        await this.$store.dispatch('cameramanagement/fetchCamsByLocation', {
          item: this.selecteditem
        })
      }
    },

    upload() {
      this.fileUpload = null
      this.fileLocation = this.selecteditem.id
      this.dialogFile = true
    },
    async submitFile() {
      if (await this.$refs.observerFile.validate()) {
        try {
          const formData = new FormData()
          formData.append('file', this.fileUpload)
          formData.append('location_id', this.fileLocation)
          await this.$axios.$post('/cameramanagement/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          this.dialogFile = false
          this.$toast.success('Thêm mới thành công')
          await this.refresh()
        } catch (error) {
          this.$toast.error(error.response.data.message)
        }
      }
    },

    addbydvr() {
      this.dvrlink = null
      this.dialogDvr = true
    },
    async submitDvr() {
      if (await this.$refs.observerDvr.validate()) {
        try {
          await this.$axios.$post('/cameramanagement/addbydvr', {
            dvrlink: this.dvrlink
          })
          this.dialogDvr = false
          this.$toast.success('Thêm mới thành công')
          await this.refresh()
        } catch (error) {
          this.$toast.error(error.response.data.message)
        }
      }
    }
  }
}
