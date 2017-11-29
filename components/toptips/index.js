module.exports = {
    showTopTips(content = '', options = {}) {
        let topTips = this.data.TopTips || {};
        // 如果已经有一个计时器在了，就清理掉先
        if (topTips.timer) {
            clearTimeout(topTips.timer);
            topTips.timer = undefined;
        }

        if (typeof options === 'number') {
            options = {
                duration: options
            };
        }

        // options参数默认参数扩展
        options = Object.assign({
            duration: 2500
        }, options);

        // 设置定时器，定时关闭topTips
        let timer = setTimeout(() => {
            this.setData({
                'TopTips.show': false,
                'TopTips.timer': undefined
            });
        }, options.duration);

        // 展示出topTips
        this.setData({
            TopTips: {
                show: true,
                content,
                options,
                timer
            }
        });
    }
};
