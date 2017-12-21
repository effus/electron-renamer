<template>
<section class="welcome">
    <div class="row">
        <div class="col s12">
            <h4 class="blue-grey-text">Welcome to WEX client!</h4>
        </div>
    </div>
    <div class="row" v-if="loginbtn && authbtn">
        <div class="col s12">
            <a class="btn" @click="auth">Login with stored keys</a>
        </div>
    </div>
    <div class="row">
        <div class="col s12">
            <div>
                <a class="btn" v-bind:class="[current=='BTCUSD' ? 'red' : 'blue']" @click="showGraph('BTCUSD')">BTC/USD</a>
                <a class="btn" v-bind:class="[current=='BTCRUR' ? 'red' : 'blue']" @click="showGraph('BTCRUR')">BTC/RUR</a>
                <a class="btn" v-bind:class="[current=='BTCEUR' ? 'red' : 'blue']" @click="showGraph('BTCEUR')">BTC/EUR</a>
                <a class="btn" v-bind:class="[current=='LTCBTC' ? 'red' : 'blue']" @click="showGraph('LTCBTC')">LTC/BTC</a>
                <a class="btn" v-bind:class="[current=='LTCUSD' ? 'red' : 'blue']" @click="showGraph('LTCUSD')">LTC/USD</a>
                <a class="btn" v-bind:class="[current=='LTCRUR' ? 'red' : 'blue']" @click="showGraph('LTCRUR')">LTC/RUR</a>
                <a class="btn" v-bind:class="[current=='LTCEUR' ? 'red' : 'blue']" @click="showGraph('LTCEUR')">LTC/EUR</a>
                <a class="btn" v-bind:class="[current=='EURUSD' ? 'red' : 'blue']" @click="showGraph('EURUSD')">EUR/USD</a>
                <a class="btn" v-bind:class="[current=='USDRUR' ? 'red' : 'blue']" @click="showGraph('USDRUR')">USD/RUR</a>
                <a class="btn" v-bind:class="[current=='ETHBTC' ? 'red' : 'blue']" @click="showGraph('ETHBTC')">ETH/BTC</a>
                <a class="btn" v-bind:class="[current=='ETHUSD' ? 'red' : 'blue']" @click="showGraph('ETHUSD')">ETH/USD</a>
                <a class="btn" v-bind:class="[current=='ETHRUR' ? 'red' : 'blue']" @click="showGraph('ETHRUR')">ETH/RUR</a>
            </div>
            <iframe style="width:100%; height: 500px;" :src="iframe"></iframe>
        </div>
    </div>
</section>
</template>

<script>
import Vue from 'vue';
import VueLocalStorage from 'vue-ls';
import WEX from 'node-wex';

let Graphs = {
    BTCUSD: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3ABTCUSD&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    BTCRUR: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3ABTCRUR&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    BTCEUR: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3ABTCEUR&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    LTCBTC: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3ALTCBTC&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    LTCUSD: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3ALTCUSD&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    LTCRUR: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3ALTCRUR&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    LTCEUR: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3ALTCEUR&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    EURUSD: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3AEURUSD&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    USDRUR: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3AUSDRUR&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    ETHBTC: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3AETHBTC&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    ETHUSD: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3AETHUSD&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark',
    ETHRUR: 'https://s.tradingview.com/widgetembed/?symbol=WEX%3AETHRUR&interval=15&whitelabel=0&symboledit=1&saveimage=0&toolbarbg=000000&studies=%5B%5D&hideideas=0&style=1&timezone=Europe%2FMoscow&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&theme=dark'
};

export default {
    name: 'Home',
    props: {
        loginbtn: {
            type: Boolean,
            required: true
        }
    },
    data: function() {
        return {
            iframe: Graphs.BTCUSD,
            authbtn: true,
            current: 'BTCUSD'
        }
    },
    methods: {
        showGraph: function(pair) {
            this.iframe = Graphs[pair];
            this.current = pair;
        },
        auth: function() {
            const secrets = Vue.ls.get('wex-secret');
            const wexPublic = new WEX(secrets.api, secrets.key);
            let $this = this;
            wexPublic.getInfo(function(err, info) {
                if (info.return.server_time) {
                    Vue.ls.set('wex-auth', true);
                    $this.$emit('wex-auth');
                    $this.authbtn = false;
                }
            });
        }
    },
    created: function() {}
}
</script>

<style>
.btn {
    padding: 0 .4em;
    height: 2em;
    line-height: 2.2em;
    margin-bottom: 1em;
    font-size: 12px;
}
</style>
