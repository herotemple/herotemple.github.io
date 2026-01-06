import Vue from 'vue'
import Router from 'vue-router'

//import Test from '@/components/demo/Test'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',//服务器默认打开页面
      name: 'index',
      component: ()=>import("@/components/page/Index")
    },
    {
      path: '/login',//输入网址打开页面
      name: 'login',
      component:()=>import("@/components/page/Login")
    },
    {
      path: '/register',//注册页面
      name: 'Register',//描述组件
      component:()=>import("@/components/page/register") //指向组件的路径
    },
    {
      path: '*',//404错误页面
      name: 'error',
      component:()=>import("@/components/page/Page404")
    },
    {
      path: '/tech',//404错误页面
      name: 'tech',
      component:()=>import("@/components/page/tech")
    },
    {
      path: '/index',
      name: 'index',//描述组件
      component:()=>import("@/components/page/Index"),
      children:[
        //用户管理
        {
          path: 'user',
          name: 'user',//描述组件
          component:()=>import("@/components/page/user")
        },
        //岩芯管理
        {
          path: 'core',
          name: 'core',//描述组件
          component:()=>import("@/components/page/core")
        },
        //岩芯段管理
        {
          path: 'coresection',
          name: 'coresection',//描述组件
          component:()=>import("@/components/page/coresection")
        },
        //仓储信息管理
        {
          path: 'storage',
          name: 'storage',//描述组件
          component:()=>import("@/components/page/storage")
        },
        //图像管理
        {
          path: 'image',
          name: 'image',//描述组件
          component:()=>import("@/components/page/image")
        },
        //扫描记录
        {
          path: 'scan',
          name: 'scan',//描述组件
          component:()=>import("@/components/page/scan")
        },
        //统计报表
        {
          path: 'reportview',
          name: 'reportview',//描述组件
          component:()=>import("@/components/page/reportview")
        },
        //矿物组成分析
        {
          path: 'mineral',
          name: 'mineral',//描述组件
          component:()=>import("@/components/page/mineral")
        },
        //权限管理
        {
          path: 'role',
          name: 'role',//描述组件
          component:()=>import("@/components/page/role")
        },
        //供货商管理
        {
          path: 'supplier',
          name: 'supplier',//描述组件
          component:()=>import("@/components/page/supplier")
        },
        //仓库管理
        {
          path: 'warehouse',
          name: 'warehouse',//描述组件
          component:()=>import("@/components/page/warehouse")
        },
        //库存管理
        {
          path: 'inventory',
          name: 'inventory',//描述组件
          component:()=>import("@/components/page/inventory")
        },
        //商品入库
        {
          path: 'inbound',
          name: 'inbound',//描述组件
          component:()=>import("@/components/page/inbound")
        },
        //商品出库
        {
          path: 'outbound',
          name: 'outbound',//描述组件
          component:()=>import("@/components/page/outbound")
        },
        //商品销售
        {
          path: 'sales',
          name: 'sales',//描述组件
          component:()=>import("@/components/page/sales")
        },
        //月度统计
        {
          path: 'monthly',
          name: 'monthly',//描述组件
          component:()=>import("@/components/page/monthly")
        },
        //年度统计
        {
          path: 'yearly',
          name: 'yearly',//描述组件
          component:()=>import("@/components/page/yearly")
        },
        //收支记录
        {
          path: 'records',
          name: 'records',//描述组件
          component:()=>import("@/components/page/records")
        },
        //利润计算
        {
          path: 'profit',
          name: 'profit',//描述组件
          component:()=>import("@/components/page/profit")
        },
        {
          path: 'default',
          name: 'list',//描述组件
          component:()=>import("@/components/page/Default")
        },
        {
          path: 'list',
          name: 'list',//描述组件
          component:()=>import("@/components/page/List") //指向组件的路径
        },
        {
          path: 'file',
          name: 'file',//描述组件
          component:()=>import("@/components/page/File") //指向组件的10路径
        }
      ]
    },
  ]

})

