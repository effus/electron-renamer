<template>
<section class="welcome">
    <div class="row">
        <div class="col s12">
            <h4 class="blue-grey-text">Settings</h4>
        </div>
    </div>
    <div class="row">
        <form class="col s12">
            <div class="input-field col s6">
                <input v-model="secrets.api" id="api-key" type="text" class="validate blue-grey-text">
                <label class="active" for="first_name2">API Key</label>
            </div>
            <div class="input-field col s6">
                <input v-model="secrets.key" id="api-secret" type="text" class="validate blue-grey-text">
                <label class="active" for="first_name2">API Secret</label>
            </div>
            <a class="btn" @click="saveAccess">Save to local storage</a>
            <a class="btn blue-grey" @click="tryAccess">Try</a>
            <span class="badge green lighten-4" v-if="attempt">Success</span>
        </form>
    </div>
</section>
</template>

<script>
import Vue from 'vue';
import VueLocalStorage from 'vue-ls';
import WEX from 'node-wex';

Vue.use(VueLocalStorage);
export default {
    name: 'Settings',
    data : function() {
        return {
            secrets: {
                api: '',
                key: ''
            },
            attempt: false
        }
    },
    methods : {
        saveAccess : function() {
            Vue.ls.set('wex-secret', {api:this.secrets.api,key:this.secrets.key});
            console.log('saved', this.secrets);
        },
        getSecrets : function() {
            return Vue.ls.get('wex-secret')
        },
        tryAccess : function() {
            const secrets = this.getSecrets();
            const wexPublic = new WEX(secrets.api,secrets.key);
            this.attempt=false;
            let $this = this;
            wexPublic.getInfo(function(err, info) {
              if (info.return.server_time) {
                  $this.attempt = true;
                  Vue.ls.set('wex-auth', true);
                  $this.$emit('wex-auth');
              }
            });
        }
    }
}
</script>
