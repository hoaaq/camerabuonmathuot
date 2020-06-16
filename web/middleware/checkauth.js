import soc from '~/plugins/socket.io.js'

export default async function({ store, $auth, redirect }) {
  if (!$auth.loggedIn) {
    return redirect('/login')
  } else if (!soc.socket) {
    soc.socket = soc.io.connect(process.env.wsUrl, {
      transports: ['websocket', 'polling']
    })
  }
  if (store.state.menu.items.length === 0) {
    await store.dispatch('menu/getmenu')
  }
}
