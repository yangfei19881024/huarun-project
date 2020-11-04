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

    XML_DATA = new xmlLoadProcess(datas_ary[index]);
    console.log('切换数据')
    console.log(index)
    $('#circle3d').empty()
    circle3d_firstStart()

  })

  $('body').on('click', '.close-btn', function(){
    $('.brand-info').hide()
    $('.brand-content').hide()
  })
 
});