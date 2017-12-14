import Vue from 'vue'

import App from './App'

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
    components: {
        App
    },
    template: '<App/>',
    data: {
        currentRoute: window.location.pathname
    }
}).$mount('#app')
