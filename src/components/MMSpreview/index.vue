<template>
<section>
    <!-- 彩信预览 -->
    <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose" width="30%" center top="30px">
        <section class="preview-content">
            <section class="preview-text" v-for="(item,index) in data" :key="index">
                <section v-if="item.pageType==1">
                    <div class="index-num">{{'[第'+(index+1)+'帧]'}}</div>
                    <p class="text">{{item.pageText}}</p>
                </section>
                <template v-else-if="item.pageType==2">
                    <div class="index-num">{{'[第'+(index+1)+'帧]'}}</div>
                    <el-image class="img" :src="item.pageMedia" fit="contain"></el-image>
                </template>
                <div class="img" v-else-if="item.pageType==3">
                    <div class="index-num">{{'[第'+(index+1)+'帧]'}}</div>
                    <video class="video" :src="item.pageMedia" controls="true" poster="" preload="auto" webkit-playsinline="true" playsinline="true" x-webkit-airplay="allow" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" style="object-fit:fill;" height="140">
                    </video>
                </div>
            </section>
        </section>
    </el-dialog>
</section>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:""
        },
        visible:{
            type:Boolean,
            default:false
        },
        msgId:{
            type:[Number,String],
            default:""
        },
        data:{
            type:Array,
            default:[]
        }
    },
    data() {
        return {

        }
    },
    mounted() {
    },
    methods: {
        handleClose(){
            this.$emit('closeDialog');
        }
    },
    watch:{
        msgId:{
            handler(val){
                if(val){
                    // this.framesQuery();
                }
            }
        }
    }
}
</script>

<style scoped>
.preview-content {
    height: 540px;
    overflow-y: scroll;
}
.index-num{
    margin-bottom: 5px;
    font-weight: 600;
}
.preview-text {
    background-color: #F6F8FB;
    border-radius: 3px;
    padding: 10px;
    margin-bottom: 10px;
    word-break: break-all;
}

.preview-text .text {
    word-break: break-all;
    padding: 0;
    margin: 0;
}

.preview-text .img {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    /* max-height: 120px;
    overflow: hidden; */
}

.preview-text .img img {
    max-width: 100%;
    height: 140px;
    /* transform: rotateY(50%); */
}

.preview-text.text-top .img img {
    margin-top: 5px;
}

.preview-text.text-top .img .video {
    margin-top: 5px;
    max-width: 100%;
    height: 140px;
}

.preview-text.img-top .img .text {
    margin-top: 5px;
}
</style>
