<template>
<div id="app">
    <div class="row" style="height:100%;    margin-bottom:0px;">
        <div class="col s12 m4 l3">
            <div class="left-menu-authorized collection" v-if="flags.authorized">
                <a v-for="i in authorizedMenu" href="item.item" class="collection-item">{{ i.label }}</a>
            </div>
            <div class="left-menu-authorized collection" v-if="!flags.authorized">
                <a v-for="i in unauthorizedMenu" href="#" @click="link(i.item)" class="collection-item">{{ i.label }}</a>
            </div>
        </div>

        <div class="workplace col s12 m8 l9 grey darken-4">
            <Home v-if="currentComponent=='home'"></Home>
            <Settings v-if="currentComponent=='settings'" v-on:wex-auth="onAuth"></Settings>
        </div>

    </div>
</div>
</template>

<script>
import 'materialize-css/dist/css/materialize.css'
import strings from "./strings.json"
import Home from '@/components/Home/Home'
import Settings from '@/components/Settings/Settings'
import VueLocalStorage from 'vue-ls';
import Vue from 'vue';
Vue.use(VueLocalStorage);

export default {
    name: 'wex',
    created: function() {
        Vue.ls.set('wex-auth',false);
    },
    data: function() {
        return {
            flags : {
                authorized : false
            },
            authorizedMenu: strings.authLeftMenu,
            unauthorizedMenu: strings.unauthLeftMenu,
            currentComponent : 'home'
        }
    },
    methods: {
        link : function(component){
            console.log(component);
            this.currentComponent = component
        },
        onAuth : function(data) {
            this.flags.authorized = true;
        }
    },
    components: {
        Home, Settings
    }
}
</script>

<style lang="scss" src="./assets/app.scss"></style>
