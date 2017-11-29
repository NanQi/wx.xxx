const baseUrl = 'https://api.my2space.com/api/';
const debug = false;
const version = "v1.0.1216";
const authList = [
    'user/app_login',
    'user/app_register'
]

wx.conf = { baseUrl, debug, version, authList }