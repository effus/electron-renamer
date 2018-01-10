<template>
<div id="app">
    <nav>
        Directory:
        <input type="text" v-model="dst" />
        <button @click="listDir" type="button">Scan dir</button>
        <button @click="testRename" type="button">Analyse</button>
        <button @click="rename" type="button" class="red">Rename</button>
        <input type="checkbox" v-model="yearOn" /> year
        <input type="checkbox" v-model="monthOn" /> month
        <input type="checkbox" v-model="byModDate" /> by date of modificate
    </nav>
    <div class="status">{{status}}</div>
    <table style="width:100%;border:0;">
        <tr>
            <td class="dirlist">
                <div class="item" v-for="(item, index) in dirlist">{{item}}</div>
            </td>
            <td class="renamed">
                <div class="item" v-for="(item, index) in testlist">
                    {{item.path}} <span class="mark">{{item.mark}}</span>
                </div>
            </td>
        </tr>
    </table>

</div>
</template>

<script>
import Vue from 'vue';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

function byFileCreateDate(fn) {
    let stats = fs.statSync(fn);
    let baseName = path.basename(fn);
    let tm = stats.birthtime;
    if (C.$data.byModDate) {
        tm = stats.mtime;
    }
    let year = tm.getFullYear();
    let month = ('0' + (tm.getMonth()+1)).slice(-2);
    let day = ('0' + tm.getDate()).slice(-2);
    return {
        year: year,
        month: month,
        day: day,
        fn : baseName,
        mark : 'FC'
    }
}

let C = null;

export default {
    name: 'wex',
    created: function() {
    },
    data: function() {
        return {
            dst:'d:\\Projects\\js.electron.renamer\\testdir\\',
            status:'expecting path...',
            yearOn : true,
            monthOn : true,
            byModDate: false,
            dirlist : [],
            testlist : [],
            patterns : {
                hastime : [
                    {
                        re: /([0-9]{4})-([0-9]{2})-([0-9]{2}) [0-9]{2}-[0-9]{2}-[0-9]{2}./i,
                        get:function(fn){
                            let baseName = path.basename(fn);
                            let parse = baseName.match(this.re);
                            return  {
                                year: parse[1],
                                month: parse[2],
                                day: parse[3],
                                fn: baseName,
                                mark : 'NM'
                            };
                        }
                    },
                    {
                        re: /img_([0-9]{4})([0-9]{2})([0-9]{2})_[0-9]{2}[0-9]{2}[0-9]{2}/i,
                        get:function(fn){
                            let baseName = path.basename(fn);
                            let parse = baseName.match(this.re);
                            return  {
                                year: parse[1],
                                month: parse[2],
                                day: parse[3],
                                fn: baseName,
                                mark : 'NM'
                            };
                        }
                    },
                    {
                        re: /vid_([0-9]{4})([0-9]{2})([0-9]{2})_[0-9]{2}[0-9]{2}[0-9]{2}./i,
                        get:function(fn){
                            let baseName = path.basename(fn);
                            let parse = baseName.match(this.re);
                            return  {
                                year: parse[1],
                                month: parse[2],
                                day: parse[3],
                                fn: baseName,
                                mark : 'NM'
                            };
                        }
                    },
                    {
                        re: /([0-9]{2})([0-9]{2})([0-9]{4})./i,
                        get:function(fn){
                            let baseName = path.basename(fn);
                            let parse = baseName.match(this.re);
                            return  {
                                year: parse[3],
                                month: parse[2],
                                day: parse[1],
                                fn: baseName,
                                mark : 'NM'
                            };
                        }
                    }
                ],
                notime : [
                    {
                        re: /img_[0-9]{4}.jpg/i,
                        get:function(fn){return byFileCreateDate(fn);}
                    },
                    {
                        re: /mvi_[0-9]{4}./i,
                        get:function(fn){return byFileCreateDate(fn);}
                    },
                    {
                        re: /ionx[0-9]{4}.mp4/i,
                        get:function(fn){return byFileCreateDate(fn);}
                    },
                    {
                        re: /.jpg/i,
                        get:function(fn){return byFileCreateDate(fn);}
                    },
                    {
                        re: /.mov/i,
                        get:function(fn){return byFileCreateDate(fn);}
                    },
                    {
                        re: /.avi/i,
                        get:function(fn){return byFileCreateDate(fn);}
                    }
                ]
            }
        }
    },
    methods: {
        getNewName : function(fn) {
            C = this;
            let isDateInName = false;
            let baseName = path.basename(fn);
            for(let i in this.patterns.hastime) {
                let match = baseName.search(this.patterns.hastime[i].re);
                if (match > -1) {
                    isDateInName = this.patterns.hastime[i];
                    break;
                }
            }
            if (isDateInName) {
                return isDateInName.get(fn);

            } else {
                let allowed = false;
                for(let i in this.patterns.notime) {
                    let match = baseName.search(this.patterns.notime[i].re);
                    if (match > -1) {
                        allowed = this.patterns.notime[i];
                        break;
                    }
                }
                if (allowed) {
                    return allowed.get(fn);
                }
            }
        },

        listDir : function() {
            this.dirlist = [];
            this.testlist = [];
            this.status = 'Read dir...';
            fs.readdirSync(this.dst).forEach(file => {
                if (fs.lstatSync(this.dst+"\\"+file).isFile()) {
                    this.dirlist.push(file);
                    this.status = 'Found '+file;
                }
            })
            this.status = 'Directory scaned';
        },
        testRename : function() {
            this.testlist = [];
            this.status = 'Parse '+this.dirlist.length + ' files';
            for (let i in this.dirlist) {
                let f = this.getNewName(this.dst + "\\" + this.dirlist[i]);
                if (!f) {
                    this.testlist.push({
                        path: '',
                        mark : 'NA'
                    });
                } else {
                    this.testlist.push({
                        path: (this.yearOn ? f.year + "\\" : '') + (this.monthOn ? f.month + "\\" : '') + f.day + "\\" + f.fn,
                        mark : f.mark
                    });
                }

            }
        },
        rename : function() {
            for (let i in this.dirlist) {
                this.status = 'Rename '+this.dirlist[i];
                let f = this.getNewName(this.dst + "\\" + this.dirlist[i]);
                if (!f) {
                    console.log('Error: '+this.dst + "\\" + this.dirlist[i]);
                    continue;
                }
                let dst = this.dst;
                let item = this.dirlist[i];
                let dir = (this.yearOn ? f.year + "\\" : '') + (this.monthOn ? f.month + "\\" : '') + f.day;
                if (!fs.existsSync(dst+"\\"+dir)){
                    mkdirp(dst+"\\"+dir,function(){
                        fs.rename(dst + "\\" + item, dst+"\\"+dir+"\\"+f.fn, function(){});
                    });
                } else {
                    fs.rename(dst + "\\" + item, dst+"\\"+dir+"\\"+f.fn, function(){});
                }
            }
            this.status = 'Complete';
        }
    },
    components: {
    }
}
</script>

<style lang="scss" src="./assets/app.scss"></style>
