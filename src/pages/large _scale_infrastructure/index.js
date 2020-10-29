/* eslint-disable */

$(document).ready(function () {
  var $height = $(window).height()
  $('.fade-image-bg > div').height($height)
  $('.address-map').height($height - 40)

  var currentSlide = $('.fade-image-bg').slick({
    lazyLoad: 'ondemand',
    dots: false,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 2500,
  });
  let index = ""
  let address_cn = '', address_en = '';

  $('.address-map li').click(function () {
    $('.heart-3').text('')
    index = $(this).index()
    address_cn = $(this).find('div:first').text();
    address_en = $(this).find('div:last').text();
    
    // address_en = 
    // currentSlide.prototype.slickGoTo(index + 1)
    $('.fade-image-bg').slick('slickGoTo', index)
    $('.address-map li').removeClass('active')
    $(this).addClass('active')
    
    // 隐藏弹窗
    $('.detail-mask').hide()
    // 左边点
    
    // 重新整理 对应关系
    var newIndex = ''
    if( index == 0 ) {
      newIndex = 7
    }else if( index == 1 ){
      newIndex = 14;
    }else if( index == 2 ) {
      newIndex = 16
    }else if (index == 3) {
      newIndex = 19
    }else if (index == 4) {
      newIndex = 17
    }else if (index == 5) {
      newIndex = 2
    }else if (index == 7) {
      newIndex = 6
    }else if (index == 6) {
      newIndex = 17
    }else if (index == 8) {
      newIndex = 18
    }else if (index == 9) {
      newIndex = 12
    }else if (index == 10) {
      newIndex = 7
    }else if (index == 11) {
      newIndex = 14
    }

    var origin_left = $('.heart-circle').eq(newIndex).position().left;
    var origin_top = $('.heart-circle').eq(newIndex).position().top;

    $('.heart-item').removeClass('active')

    $('.heart-circle').eq(newIndex).find('.heart-item').addClass('active').end().css({
      left: origin_left-60 + 'px',
      top: origin_top-60 + 'px'
    })
    
    var address_cn_html = address_cn.length > 4 ? '<p>'+address_cn.substr(0,4)+'</p><p>'+address_cn.substr(5,address_cn.length)+'</p>' : '<p>'+address_cn+'</p>'
    $('.heart-circle').eq(newIndex).find('.heart-item').find('.heart-3').html(address_cn)


    setTimeout(function(){
      $('.detail-swiper-content').eq(index).slick({
        dots: false,
        infinite: true,
        speed: 500,
        cssEase: 'linear',
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
      });
    }, 0)
  });

  $("body").on("click", ".heart-item.active" , function(){
    var videos = ['01/香港國際貨櫃碼頭.mp4', '02/潤發倉.mp4', '03/1998新青衣油庫.mp4', 
  '04/1998新青衣油庫.mp4', '05/1998大老山隧道.mp4', '06/三号干线郊野公园段.mp4', '07/', '08/灏景湾.mp4', '09/上水屠房.mp4', '10/華人銀行.mp4', '11/萬眾電話.mp4', '']
    $('.detail-mask').show()
    $('.detail-swiper-content').hide();
    $('.detail-swiper-content').eq(index).show()
    var desc = $('.detail-swiper-content').eq(index).attr('desc')
    $('.detail-mask-description').text(desc)
    $('.detail-title.dymaic').text(address_cn+address_en)
    $('#mask-video').attr('src', '../../images/part01/'+videos[index])
  }) 
  // (".heart-item.active").click(function(){
  //   alert("hahah")
  //   alert(index)
    // 出现弹层
    // $('.detail-mask').show()
    // $('.detail-swiper-content').hide();
    // $('.detail-swiper-content').eq(index).show()
    // var desc = $('.detail-swiper-content').eq(index).attr('desc')
    // $('.detail-mask-description').text(desc)

  // })

  //! 参考 https://stackoverrun.com/cn/q/8215598

  $('.detail-mask').css('height', $height+'px');
  $("#close").click(function(){
    $('.detail-mask').hide()
  })



})
