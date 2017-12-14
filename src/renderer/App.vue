<template>
<div id="app">
    <div class="row" style="height:100%;    margin-bottom:0px;">
        <div class="col s12 m4 l3">
            <div class="left-menu-authorized collection" v-if="flags.authorized">
                <a v-for="item in authorizedMenu" href="item.item" class="collection-item">{{ item.label }}</a>
            </div>
            <div class="left-menu-authorized collection" v-if="!flags.authorized">
                <v-link v-for="item in unauthorizedMenu" href="/settings" class="collection-item">Settings</v-link>
            </div>
        </div>

        <div class="workplace col s12 m8 l9 grey darken-4">
            <Home></Home>
        </div>

    </div>
</div>
</template>

<script>
import Home from '@/components/Home/Home'
import 'materialize-css/dist/css/materialize.css'
import strings from "./strings.json"
import VLink from '@/components/VLink.vue'

export default {
    name: 'wex',
    created: function() {
        //console.log('Salam popolam');
    },
    data: function() {
        return {
            flags : {
                authorized : false
            },
            authorizedMenu: strings.authLeftMenu,
            unauthorizedMenu: strings.unauthLeftMenu
        }
    },
    methods: {

    },
    components: {
        Home,
        VLink
    }
}
</script>

<style lang="scss" src="./assets/app.scss"></style>
