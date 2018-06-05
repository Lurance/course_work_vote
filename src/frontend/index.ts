import Axios from "axios"

import Vue from 'vue'

import {IVote} from "../app"

class UserService {

}

class VoteService {
    async getVotesFromPage(page: number): Promise<IVote[]> {
        const res = await Axios.get(`/api/vote/${page}`)

        return res.data
    }

    async vote(item: IVote) {

    }
}

const voteService = new VoteService()


const Page = Vue.extend({
    data() {
        return {
            pages: null,
            nowPage: 1,
            nowVotes: []
        }
    },
    created: function () {
        Axios.get('/api/page')
            .then(res => this.pages = res.data)

        voteService.getVotesFromPage(this.nowPage)
            .then(data => this.nowVotes = data)

    },

    methods: {
        choicePage(p: number) {
            this.nowPage = p
            voteService.getVotesFromPage(p)
                .then(data => this.nowVotes = data)
        },
        vote(item: IVote) {
            this.nowVotes.find(v => v === item).vote ++
        },
    }
})

new Page().$mount('#page')

