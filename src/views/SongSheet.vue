<template>
    <div class="songsheet"> 
        <loading v-show="loadingShow" />
        <div class="back" v-show="show">
            <div class="back-box" >
                <span @click="back"> < </span>
                {{backName}}
            </div>
        </div>
        <div class="bscroll" ref="bscroll">
            <div class="bscroll-container">
        <div class="header" :style="{backgroundImage: 'url(' + img  + ')'}">
            <div class="header-box">
                <div class="header-title" @click="back">
                     返回
                </div>
                <div class="header-bottom">
                    <p>{{ singerObj.artist.name ||songObj.name}}</p>
                    <p v-if="isShow"> <i></i> {{songObj.playCount | numChange}}万</p>
                </div>
            </div>
        </div>
        <div class="song-sum" @click="play()">
            <span>
                <i></i>
            </span>
            播放全部
            <span>
                (共{{sum}}首)
            </span>
        </div>
        <div class="list" 
            v-for="(item,index) in (singerObj.hotSongs || songObj.tracks)"
            :key='item.id'
            @click="play(index)"
        >
            <span>{{index + 1}}</span>
            <div class="list-content">
                <p>{{item.name || item.name}}</p>
                <p>
                    {{singer(item.ar)}}
                </p>
            </div>
        </div>
    </div>
    </div>
 </div>
</template>

<script>
import BScroll from "better-scroll";
import {mapActions} from 'vuex'
import { setTimeout } from 'timers';
let timer ;
export default {
    name:'SongSheet',
    data(){
        return{
            songObj:{},
            show:false,
            aBScroll:'',
            singerObj:{
                artist:{},
                al:{}
            },
            isShow:true,
            loadingShow:true
        }
    },
    created(){
        let {query} = this.$route;
        if(query.type == 'song'){
            this.$http.get(`/playlist/detail?id=${query.id}`)
                .then(res=>{
                    this.songObj = res.data.playlist;
                    this.changeLoadingShow();
                })
        }else if(query.type == 'ranking'){;
            this.$http.get(`/top/list?idx=${query.id}`)
                .then(res=>{
                    this.songObj = res.data.playlist;
                    this.changeLoadingShow();  
                })
        }else{
            this.$http.get(`/artists?id=${query.id}`)
                .then(res=>{
                    this.singerObj = res.data;
                    this.changeLoadingShow();                    
                    this.isShow = false;
                })
        }
    },
    computed:{
        sum(){
            if(this.songObj.tracks === undefined){
                if(this.singerObj.hotSongs == undefined){
                    return 0;
                }
                return this.singerObj.hotSongs.length;
            }else{
                if(this.songObj.tracks == undefined){
                    return 0;
                }
                return this.songObj.tracks.length;
            }
        },
        img(){
            return this.singerObj.artist.img1v1Url || this.songObj.coverImgUrl;
        },
        backName(){
            return this.singerObj.artist.name || '返回';
        }
    },
    methods:{
        singer(val){
            let str = '';
            val.forEach((item,index) => {
                if(index == val.length -1){
                    str += item.name
                }else{
                    str += item.name + '/'
                }
            });
            return str;
        },
        back(){
            this.$router.go(-1);
        },
        handleScroll(top){
            if(top < -150){
                this.show = true;
            }else{
                this.show = false;
            }
        },
        play(idx=0){
            let obj = {
                songList : this.songObj.tracks || this.singerObj.hotSongs,
                currentIndex : idx,
                modeList : this.songObj.tracks || this.singerObj.hotSongs,
                play : true,
                playScreen : true
            }
            this.com_play(obj);
        },
        changeLoadingShow(){
            this.isShow = true;
            this.loadingShow = false;
        },
        ...mapActions(['com_play'])
    },
    mounted(){
       this.$nextTick(()=>{
            let bscrollDom = this.$refs.bscroll;
            this.aBScroll = new BScroll(bscrollDom,{
                probeType: 3,
                click: true
            });
            this.aBScroll.on('scroll',pos=>{
                this.handleScroll(pos.y)
            });
       })
    }
}
</script>

<style lang="less" scoped>
    .songsheet{
        width: 100%;
        .header{
            height: 2.61rem;
            background-size: cover;
            background-position: 0 30%;
            background-repeat: no-repeat;
            z-index: 5;
            .header-box{
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .2);
                overflow: hidden;
                position: relative;
                .header-title{
                    width: .44rem;
                    height:.44rem;
                    border-radius: 50%;
                    color: #fff;
                    font-size: 16px;
                    line-height: .44rem;
                    background-color: #d33a31;
                    opacity: .5;
                    text-align: center;
                    margin:10px;
                }
                .header-bottom{
                    height: .35rem;
                    position: absolute;
                    bottom: .1rem;
                    left:10px;
                    font-size: 16px;
                    color: #fff;
                    p{
                        padding:1px;
                        i{
                            width: 12px;
                            height: 12px;
                            display: inline-block;
                            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMCI+PGcgb3BhY2l0eT0iLjE1Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMwNDAwMDAiIGQ9Im0yMiAxNi43NzdjMCAxLjIzMy0xLjEyMSAyLjIzMy0yLjUwNiAyLjIzMy0xLjM4NCAwLTIuNTA2LTEtMi41MDYtMi4yMzN2LTIuNTUzYzAtMS4yMzQgMS4xMjItMi4yMzMgMi41MDYtMi4yMzMuMTc0IDAgLjM0My4wMTcuNTA2LjA0NnYtMS4zN2gtLjAzM2MuMDE3LS4yMi4wMzMtLjQ0MS4wMzMtLjY2NiAwLTQuNDE4LTMuNTgyLTgtOC04LTQuNDE4IDAtOCAzLjU4Mi04IDggMCAuMjI1LjAxNi40NDYuMDM0LjY2NmgtLjAzNHYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzcy0yLjUwNS0uOTk5LTIuNTA1LTIuMjMzdi0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43My0uMDg1LS4xNDgtLjE0OC0uMzEtLjE0OC0uNDkzdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMCA1LjUyMyAwIDEwIDQuNDc3IDEwIDEwIDAgLjA5LS4wMDkuMTc4LS4wMTQuMjY2LjAwMi4wMjQuMDE0LjA0NC4wMTQuMDY3djJjMCAuMzA2LS4xNDUuNTY5LS4zNi43NTMuMjI0LjMzNC4zNi43Mi4zNiAxLjEzOHYyLjU1MiIvPjwvZz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNmZmYiIGQ9Im0yMCAxNi43NzdjMCAxLjIzMy0xLjEyMSAyLjIzMy0yLjUwNiAyLjIzMy0xLjM4NCAwLTIuNTA2LTEtMi41MDYtMi4yMzN2LTIuNTUzYzAtMS4yMzQgMS4xMjItMi4yMzMgMi41MDYtMi4yMzMuMTc0IDAgLjM0My4wMTcuNTA2LjA0NnYtMS4zN2gtLjAzM2MuMDE3LS4yMi4wMzMtLjQ0MS4wMzMtLjY2NiAwLTQuNDE4LTMuNTgyLTgtOC04LTQuNDE4IDAtOCAzLjU4Mi04IDggMCAuMjI1LjAxNi40NDYuMDM0LjY2NmgtLjAzNHYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzcy0yLjUwNS0uOTk5LTIuNTA1LTIuMjMzdi0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43My0uMDg1LS4xNDgtLjE0OC0uMzEtLjE0OC0uNDkzdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMCA1LjUyMyAwIDEwIDQuNDc3IDEwIDEwIDAgLjA5LS4wMDkuMTc4LS4wMTQuMjY2LjAwMi4wMjQuMDE0LjA0NC4wMTQuMDY3djJjMCAuMzA2LS4xNDUuNTY5LS4zNi43NTMuMjI0LjMzNC4zNi43Mi4zNiAxLjEzOHYyLjU1MiIvPjwvc3ZnPg==');
                        }
                    }
                    p:nth-of-type(1){
                        font-weight: 600;
                    }
                }
            }
        }
        .song-sum{
            width: 100%;
            height: .41rem;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            display: flex;
            align-items: center;
            background-color: #f2f3f4;
            color: #2e3030;
            font-size: 16px;
            border-bottom:1px solid #ccc;
            span:nth-of-type(1){
                display: block;
                width: .5rem;
                i{
                    width: .22rem;
                    height: .22rem;
                    margin: 0 auto;
                    display: block;
                    background-image: url('https://s3.music.126.net/m/s/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880');
                    background-size: 166px 97px;
                    background-position: -24px 0;
                }
            }
            span:nth-of-type(2){
                color: #757575;
                font-size: 14px;
            }
        }
        .list{
            height: .6rem;
            background-color: #f2f3f4;
            display: flex;
            align-items: center;
            border-bottom:1px solid #ccc;
            box-sizing: border-box;
             span:nth-of-type(1){
                display: block;
                width: .5rem;
                font-size: 18px;
                text-align: center;
                color: #757575;
             }
             .list-content{
                 font-size: 16px;
                 flex: 1;
                 height: .44rem;
                 p{
                     height: .2rem;
                     line-height: .2rem;
                     color:#2e3030;
                    text-overflow: ellipsis;
                    overflow: hidden;
                 }
                 p:nth-of-type(2){
                     color: #757575;
                     font-size: 12px;
                 }
             }
        }
    }
    .back{
        width: 100%;
        height: .4rem;
        background-color: #d33a31;
        color: #fff;
        font-size: 16px;
        line-height: .4rem;
        position: fixed;
        top:0;
        left:0;
        z-index: 4;
        .back-box{
            min-width: 150px;
        }
        span{
            display: inline-block;
            height: 100%;
            width: .5rem;
            font-size: 22px;
            text-align: center;
        }
    }
    .bscroll{
        width: 100%;
        overflow: hidden;
        height:100vh;
    }

</style>

