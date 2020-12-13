
module.exports = {
    emailRegex: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
    usernameRegex: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
    passwordRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
}