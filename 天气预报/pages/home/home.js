//app.js
Page({
  data: {
    city: "",
    today: {},
    future:{}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.loadInfo();
  },

  loadInfo: function () {
    var page = this;
    //获取经纬度
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // success,获取当前的城市信息
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude);
        page.getCity(latitude, longitude)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //根据经纬度获取城市
  getCity: function (latitude, longitude) {
    var page = this;
    wx.request({
      url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=EFHBZ-WQG6U-WEMVB-4N3DG-KSMGT-5WB2G',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var city = res.data.result.address_component.city;
        console.log(city);
        //把市去掉，下一个接口地址没有模糊处理
        city = city.replace("市", "");
        page.setData({ city: city });
        page.getWeather(city);
      }
    })
  },
  //根据城市获取天气信息
  getWeather: function (city) {
    var page = this;
    wx.request({
      url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + city,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var future = res.data.data.forecast;
        //移除掉数组中当天的天气信息
        var todayInfo = future.shift();
        var today = res.data.data;
        today.todayInfo = todayInfo;
        page.setData({ today: today, future: future });
      },
    })
  },
})