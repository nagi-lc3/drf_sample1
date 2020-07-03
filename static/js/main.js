// CSRFトークンの送信設定
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// APIクライアント
const api = axios.create({
    baseURL: '/api/v1/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

// Mustache構文のバッティングを回避
Vue.options.delimiters = ['#{', '}']

// Vueインスタンスを作成
const app = new Vue({
    el: '#app',

    data: {
        form: {
            book: {
                title: '',
                price: 0
            }
        },
        message: {
            info: '',
            warnings: [],
            error: ''
        }
    },

    computed: {
        // 登録済みかどうか
        isCreated: function () {
            return this.form.book.id !== undefined
        }
    },

    methods: {
        // 登録・更新ボタン押下時に呼び出されるメソッド
        submitSave: function () {
            this.clearMessages()
            api({
                // 登録済みかどうかでHTTPメソッドとエンドポイントを切り替える
                method: this.isCreated ? 'put' : 'post',
                url: this.isCreated ? '/books/' + this.form.book.id + '/' : '/books/',
                data: {
                    'id': this.form.book.id,
                    'title': this.form.book.title,
                    'price': this.form.book.price
                }
            })
                .then(response => {
                    this.message.info = this.isCreated ? '更新しました。' : '登録しました。'
                    this.form.book = response.data
                })
                .catch(error => {
                    const status = error.response ? error.response.status : 500
                    if (status === 400) {
                        // バリデーションNG
                        this.message.warnings = [].concat.apply(
                            [], Object.values(error.response.data))
                    } else if (status === 401) {
                        // 認証エラー
                        this.message.error = '認証エラー'
                    } else if (status === 403) {
                        // 権限エラー
                        this.message.error = '権限エラーです。'
                    } else {
                        // その他のエラー
                        this.message.error = '想定外のエラーです。'
                    }
                })
        },
        // メッセージをクリア
        clearMessages: function () {
            this.message.error = ''
            this.message.warnings = []
            this.message.info = ''
        }
    }
})
