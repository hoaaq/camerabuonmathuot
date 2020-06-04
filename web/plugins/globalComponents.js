import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import draggable from 'vuedraggable'
import TopTitle from '~/components/TopTitle'

const components = {
  TopTitle,
  draggable,
  ValidationProvider,
  ValidationObserver
}

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
