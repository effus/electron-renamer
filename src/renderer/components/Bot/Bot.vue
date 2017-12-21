<template>
<section class="bot">
    <div class="row">
        <div class="col s12">
            <h4 class="blue-grey-text">Bot</h4>
        </div>
    </div>
    <div class="progress" :v-if="loading">
        <div class="indeterminate"></div>
    </div>
    <div class="card grey darken-3 darken-1">
        <div class="card-content white-text">
            <div class="row">
                <div class="col s2">Баланс</div>
                <div class="col s8">{{ finances.balanceRUR }} руб</div>
            </div>
            <div class="row">
                <div class="col s2">Фонды</div>
                <div class="col s3">
                    <table>
                        <tr v-for="(cur,amount) in finances.funds">
                            <td>{{cur[0]}}</td>
                            <td><span class="badge teal lighten-4">{{cur[1]}}</span></td>
                            <td><span class="badge teal lighten-4">{{cur[2]}} руб</span></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>

</section>
</template>

<script>
import Vue from 'vue';
import VueLocalStorage from 'vue-ls';
import WEX from 'node-wex';
import fs from 'fs';

const Conversions2RUR = {
    BTC: [
        'btc_rur'
    ],
    LTC: [
        'ltc_rur'
    ],
    USD: [
        'usd_rur'
    ],
    ETH: [
        'eth_rur'
    ],
    EUR: [
        'eur_rur'
    ]
}

export default {
    name: 'Bot',
    data: function() {
        return {
            authbtn: true,
            current: 'BTCUSD',
            loading: true,
            finances: {
                balanceRUR: 0,
                funds: []
            },
            nonce: 1
        }
    },
    WEX: null,
    methods: {
        convertXToRur(curr,amount,callback) {
            let convertPair = Conversions2RUR[curr];
            this.WEX.ticker(convertPair[0], function(err, info) {
                callback(amount*info.ticker.avg);
            });
        },
        calcBalance: function() {
            const secrets = Vue.ls.get('wex-secret');
            let $this = this;
            this.WEX = new WEX(secrets.api, secrets.key, {
                nonce: function() {
                    var d = new Date();
                    var nonce = Math.round(d.getTime() / 1000);
                    console.log('nonce', nonce);
                    return nonce;
                }
            });
            this.WEX.getInfo(function(err, info) {
                if (info.return.server_time) {
                    $this.finances.balanceRUR = 3;
                }
                if (info.return.funds) {
                    $this.finances.funds = [];
                    $this.finances.balanceRUR = 0;
                    for (var i in info.return.funds) {
                        if (info.return.funds[i] > 0) {
                            let curr = i;
                            let amount = info.return.funds[i];
                            $this.convertXToRur(curr.toUpperCase(), info.return.funds[i], function(res) {
                                let r = Math.round((res)*100)/100;
                                $this.finances.funds.push([curr.toUpperCase(), amount, res]);
                                $this.finances.balanceRUR += r;
                            })
                        }
                    }
                }
                if ($this.finances.funds.length > 0) {

                    for (let i in $this.finances.funds) {
                        let convertPair = Conversions2RUR[$this.finances.funds[i][0]];
                        //console.log(convertPair);
                        $this.WEX.ticker(convertPair[0], function(err, info) {
                            let pairAmount = $this.finances.funds[i][1];
                            $this.finances.balanceRUR += pairAmount*info.ticker.avg;
                        });
                    }
                    $this.loading = false;
                }
            });
        }
    },
    created: function() {
        this.calcBalance()
    }
}
</script>

<style>
table td {
    padding: 3px 5px;
}
</style>
