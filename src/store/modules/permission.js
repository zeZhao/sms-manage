import {
    asyncRoutes,
    constantRoutes
} from '@/router'
import {
    getAuthMenu
} from '@/api/user'
import {
    getToken
} from '@/utils/auth'
import Layout from '@/layout'
import store from '@/store'
import Cookies from 'js-cookie'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {
            ...route
        }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })
    return res
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data, linkUrl = "") {
    data.forEach(item => {
        //node 1为菜单 2为目录
        const menu = {
            path: item.node === 2 ? item.menuId + 'list' : item.linkUrl,
            component: item.node === 2 ? Layout : (resolve) =>
                require([`@/views/${linkUrl}${item.linkUrl}`], resolve),
            alwaysShow: item.node === 2 ? true : false,
            // component: () => import('@/views/outList'),
            children: [],
            //特殊处理
            hidden: item.linkUrl === 'homeData',
            name: item.name,
            meta: {
                title: item.name,
                id: item.menuId,
                icon: item.icon,
                keepAlive: true,
                
            }
        }
        if (item.childMenu) {
            generaMenu(menu.children, item.childMenu, item.linkUrl)
        }
        routes.push(menu)
    })
}


const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({
        commit
    }, roles) {
        return new Promise(resolve => {
            const loadMenuData = [];
            // 先查询后台并返回左侧菜单数据并把数据添加到路由
            getAuthMenu(getToken()).then(response => {
                let data = response
                if (response.code !== 200) {
                    this.$message({
                        message: '菜单数据加载异常',
                        type: 0
                    })
                } else {
                    data = response.data
                    if (!data.length) {
                        store.dispatch("user/logout").then(() => {
                            Cookies.remove("Admin-Token");
                            Cookies.remove("token");
                            window.location.reload();
                        });
                        return;
                    }
                    Object.assign(loadMenuData, data)
                    generaMenu(asyncRoutes, loadMenuData)
                    let accessedRoutes
                    if (roles.includes('admin')) {
                        // alert(JSON.stringify(asyncRoutes))
                        accessedRoutes = asyncRoutes || []
                    } else {
                        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                    }
                    commit('SET_ROUTES', accessedRoutes)
                    resolve(accessedRoutes)
                }
                // generaMenu(asyncRoutes, data)
            })

        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}