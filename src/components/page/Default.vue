<template>
  <div >
    <el-row>
      <el-col :span=6>
        <el-card class="box-card" style="width: 300px;">
          <el-statistic     title="员工数量">
            <template slot="prefix">
              <i class="el-icon-female" style="color: red;"></i>{{num}}
            </template>
          </el-statistic>
        </el-card>

      </el-col>
      <el-col :span=6>
        <el-card class="box-card" style="width: 300px;">
          <el-statistic     title="薪酬总额">
            <template slot="prefix">
              <i class="el-icon-trophy" style="color: red;"></i>{{num}}
            </template>
          </el-statistic>
          </el-card>

      </el-col>
      <el-col :span=6>
        <el-card class="box-card" style="width: 300px;">
          <el-statistic     title="罚款总额">
            <template slot="prefix">
              <i class="el-icon-trophy-1" style="color: red;"></i>{{num}}
            </template>
          </el-statistic>
          </el-card>
      </el-col>
      <el-col :span=6>
        <el-card class="box-card" style="width: 300px;">
          <el-statistic     title="迟到次数">
            <template slot="prefix">
              <i class="el-icon-shopping-cart-full" style="color: red;"></i>{{num}}
            </template>
          </el-statistic>
          </el-card>
      </el-col>
    </el-row>
    <br>
    <!-- 图表-->
    <el-row >
      <el-col :span="12">
        <el-card class="box-card" style="width: 620px;">
          <div id="zhu" style="width: 500px;height: 450px;"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card" style="width: 620px;">
          <div id="bing" style="width: 500px;height: 450px;"></div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
    export default {
        name: "Default",
        data(){
          return{
            num:"10000"
          }
        },
      methods:{
        loadZhu:function(){//加载柱状图
          //1 获取显示图的容器对象
          var echart = echarts.init(document.getElementById("zhu"));
          //2 构建柱状图的配置对象
          var option = {
            title:{
              text:"本月迟到最多员工"
            },
            xAxis: {
              type: 'category',
              data: ['张三', '李四', '王五', '钱六', '马玉']
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: [20, 10, 50, 8, 7],
                type: 'bar'
              }
            ]
          };

          //3 容器对象加载柱状图的配置对象
          echart.setOption(option);


        },
        loadBing:function(){//加载饼图
          //1 获取显示图的容器对象
          var echart = echarts.init(document.getElementById("bing"));
          //2 构建饼图的配置对象
          var option = {
            title: {
              text: '员工年龄段分布',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 1048, name: '20岁以下' },
                  { value: 735, name: '20岁-30岁' },
                  { value: 580, name: '31岁-40岁' },
                  { value: 484, name: '41岁-50岁' },
                  { value: 300, name: '50岁以上' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          //3 容器对象加载柱状图的配置对象
          echart.setOption(option);
        }
      },
      mounted() {
        this.loadBing();
        this.loadZhu();
      }
    }
</script>

<style scoped>

</style>
