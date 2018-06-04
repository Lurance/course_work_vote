import Axios from "axios"

import Vue from 'vue'

import {IVote} from "../app"

async function getVotesFromPage(page: number): Promise<IVote[]> {
    const res = await Axios.get(`http://127.0.0.1:2345/api/vote/${page}`)

    return res.data
}


const Component = Vue.extend({
    data() {
        return {
            pages: null,
            nowPage: 1,
            nowVotes: []
        }
    },
    created: function () {
        Axios.get('http://127.0.0.1:2345/api/page')
            .then(res => this.pages = res.data)

        Axios.get(`http://127.0.0.1:2345/api/vote/${this.nowPage}`)
            .then(res => this.nowVotes = res.data)

    },

    methods: {
        choicePage(p: number) {
            this.nowPage = p
            getVotesFromPage(p)
                .then(data => this.nowVotes = data)
        },
        vote(item: IVote) {
            this.nowVotes.find(v => v === item).vote ++
        }
    }
})

new Component().$mount('#page')

