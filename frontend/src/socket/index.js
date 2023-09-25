import Echo from "laravel-echo";
import Pusher from "pusher-js";
window.Pusher = Pusher;

const laravelEcho = new Echo({
  broadcaster: "pusher",
  key: "ea38f6d859801e337591",
  wsHost: "165.232.142.3",
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  cluster: "ap1",
  enabledTransports: ["ws", "wss"],
});

export default laravelEcho;
