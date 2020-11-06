$(function(){
 
  $('.footer-action').slick({
    slidesToShow: 1,
    variableWidth: true,
    slidesToScroll: 1,
    dots: false,
    centerMode: true,
    focusOnSelect: true
  }).on('afterChange', function(slick,direction){
    // console.log('11111 = ' +slick,'22222 = ' +direction);
    console.log(slick)
    console.log(direction)

    var index = direction.currentSlide 
    $('.footer-action div').eq(index).addClass('active')
    var datas_ary = [tech_finance, consume, healthy, city_con, energy_services]

    // xmlLoadProcess(datas_ary[index])
    $('#houseName').hide()
    XML_DATA = new xmlLoadProcess(datas_ary[index]);
    $('#circle3d').empty()
    circle3d_firstStart()

  })

  $('body').on('click', '.close-btn', function(){
    $('.brand-info').hide()
    $('.brand-content').hide()
  })
 

  // 设定宽高度

  var $window = $(window)

  var maskWidth = $window.width() * 0.85;
  var maskHeight = maskWidth * 0.38;

  $('.brand-content').css({
    width: maskWidth + 'px',
    height: maskHeight + 'px'
  })

  // 左边padding 设置
  var left_top_padding = maskHeight * 0.127;

  $('.brand-left').css({
    paddingTop: left_top_padding + 'px',
    paddingBottom: left_top_padding + 'px'
  })

});