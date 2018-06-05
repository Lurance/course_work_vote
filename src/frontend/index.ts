import Axios from "axios"

import Vue from 'vue'

import {IVote} from "../app"

import {checkAuthInfo} from "./base"

class VoteService {
    async getVotesFromPage(page: number): Promise<IVote[]> {
        const res = await Axios.get(`/api/vote/${page}`)

        return res.data
    }

    async vote(item: IVote) {
        try {
            const res = await Axios.post('/api/vote', {
                _id: item._id
            })

            return res.data
        } catch (e) {
            throw new Error()
        }

    }
}

const voteService = new VoteService()


const Page = Vue.extend({
    data() {
        return {
            pages: null,
            nowPage: 1,
            nowVotes: [],
            userInfo: null
        }
    },
    created: function () {
        Axios.get('/api/page')
            .then(res => this.pages = res.data)

        voteService.getVotesFromPage(this.nowPage)
            .then(data => this.nowVotes = data)
        this.userInfo = checkAuthInfo() || null

        console.log(this.userInfo)


    },

    methods: {
        choicePage(p: number) {
            this.nowPage = p
            voteService.getVotesFromPage(p)
                .then(data => this.nowVotes = data)
        },
        vote(item: IVote) {
            if (!this.userInfo) {
                alert('您还未登录')
                location.href = 'login.html'
            }  else {
                voteService.vote(item)
                    .then(data => this.nowVotes.splice(this.nowVotes.findIndex(v => v._id === data._id), 1, data))
                    .catch(() => alert('请不要重复投票'))
            }
        },
        logout() {
            Axios.get('/api/logout')
                .then(res => {
                    if (res.status === 204) {
                        localStorage.clear()
                        this.userInfo = null
                    }
                })
        }
    }
})

new Page().$mount('#page')

