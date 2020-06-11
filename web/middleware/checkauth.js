import soc from '~/plugins/socket.io.js'

export default async function({ store, $auth, redirect }) {
  if (!$auth.loggedIn) {
    return redirect('/login')
  } else if (!soc.socket || !soc.socketStream) {
    soc.socket = soc.io(process.env.WS_URL)
    soc.socketStream = soc.ss(soc.socket)
  }
  if (store.state.menu.items.length === 0) {
    await store.dispatch('menu/getmenu')
  }
}
