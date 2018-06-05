import Vue from 'vue'
import Axios from "axios"
import {checkAuthInfo} from "./base"

const Page = Vue.extend({
    data() {
        return {
            isLogin: true,
            username: '',
            password: '',
            userInfo: null
        }
    },
    created: function() {
        this.userInfo = checkAuthInfo() || null

        console.log(this.userInfo)

    },
    methods: {
        submit() {
            if (this.isLogin) {
                Axios.post('/api/login', {
                    username: this.username,
                    password: this.password
                })
                    .then(res => {
                        if (res.status === 200) {
                            alert('登录成功')
                            localStorage.setItem('authInfo', JSON.stringify(res.data))
                            location.href = 'index.html'
                        } else {
                            alert('登录失败')
                        }
                    })
            }  else {
                Axios.post('/api/reg', {
                    username: this.username,
                    password: this.password
                })
                    .then(res => {
                        if (res.status === 200) {
                            alert('注册成功')
                            this.username = ''
                            this.password = ''
                            this.isLogin = true
                        } else {
                            alert('注册失败')
                        }
                    })
            }
        }
    }
})

new Page().$mount('#page')

