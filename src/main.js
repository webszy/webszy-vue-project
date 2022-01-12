import Vue from 'vue'
import App from './App.vue'
import CompositionAPI from '@vue/composition-api'
import 'vue2-toast/lib/toast.css';
import 'windi.css'
import Toast from 'vue2-toast';

Vue.config.productionTip = false
Vue.use(CompositionAPI)
Vue.use(Toast, {
  type: 'bottom',
  duration: 4000,
  wordWrap:true
});
new Vue({
  render: h => h(App),
}).$mount('#app')
// eslint-disable-next-line no-undef
window._env = _env
