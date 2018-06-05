export function checkAuthInfo() {
    const authInfo = localStorage.getItem('authInfo')
    if (authInfo) {
        const payload = JSON.parse(authInfo)
        if (Date.now() < payload.expiresOn) {
            return payload
        } else {
            alert('您的登录状态已过期，请重新登录')
            localStorage.clear()
        }
    }
}