function chengfabiao() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(e => Array.from({ length: e }).map((_e, i) => `${e} * ${i + 1} = ${e * (i + 1)}`).join('   ')).join('\n')
}

module.exports = {
    chengfabiao
}