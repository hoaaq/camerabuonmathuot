import { extend, setInteractionMode } from 'vee-validate'
import { required, integer, email } from 'vee-validate/dist/rules'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: 'Trường này không được trống'
})

extend('number', {
  ...integer,
  message: 'Chỉ được nhập kí tự số'
})

extend('email', {
  ...email,
  message: 'Email không hợp lệ'
})
