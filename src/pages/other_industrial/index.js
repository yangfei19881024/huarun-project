/* eslint-disable */
$(function () {
  var $width = $(window).width()
  var $height = $(window).height()
  var index_page = 0
  var index = 0
  $('.wrap').height($height)
  $('.wrap  li').height($height)

  var $firstWidth = $width - 58 * 8 - 60 // 60是最后一个li的宽度

  $('.first').width($firstWidth)

  var lis = $('.wrap  li.li')
  // for (var i = 1; i < lis.length; i++) {
  // 	lis.eq(i).css('backgroundImage','url(images/'+ (i+1)+'.png)');
  // }
  lis.click(function (event) {
    
    event.stopPropagation()
    var index = $('li.li').index(this)
    index_page = index

    $(this)
      .stop()
      .animate({width: $width})
      .siblings()
      .stop()
      .animate({width: 0, display: 'none'})
      .children()
      .hide()
    $(this).find('.side-bar-info').hide()
    $('.last').hide()
    $(this).find('.content').fadeIn()
    $(this).find('.collspan-btn').show()
    var date = $(this).find('.images-item').eq(0).attr('date')
    $('.time-info').fadeIn().text(date)
    startSwiper(index_page)
  })
  $('.collspan-btn').click(function (event) {
    index = 0
    event.stopPropagation()
    $('.last, .mouse').show()
    $(this).parent('li').find('.side-bar-info').show()
    $('.first').stop().animate({width: $firstWidth}).children().show()
    lis.stop().animate({width: 58}).children().show()
    $(this).hide()
    $(this).find('.collspan-btn').hide()

    var $swiperContainer = $('li.li')
      .eq(index_page)
      .find('.images-list-container')

    $swiperContainer.animate({left:0})
  })

  function startSwiper(index_page) {
    // 轮播效果
    index = 0
    var $swiper = $('li.li').eq(index_page).find('.images-list')

    var $swiperContainer = $('li.li')
      .eq(index_page)
      .find('.images-list-container')
    var $swiperItem = $swiper.find('.images-item')
    var len = $swiper.find('.images-item').length
    $swiperContainer.width($swiperItem.outerWidth() * len + 20 * len)
    console.log('------>' + index_page)

    // 清除之前注册的事件
    $('li.li')
      .eq(index_page)
      .find('#right-handler').off('click')
    
    $('li.li')
      .eq(index_page)
      .find('#left-handler').off('click')

    $('li.li')
      .eq(index_page)
      .find('#right-handler')
      .click(function (event) {
        event.stopPropagation()
        ++index
        console.log(index)
        console.log('index:'+index)
        if (index == len) {
          index = len - 1
          
        }
        
        if( index + 2 > len) {
          --index
          return;
        }
        var $parent = $(this).parents('li')
        let li_index = $('li.li').index($parent)

        var date = $('li.li')
          .eq(li_index)
          .find('.images-item')
          .eq(index)
          .attr('date')
        $('.time-info').fadeIn().text(date)
        $swiperContainer.stop(true, true).animate({
          left: -($swiperItem.outerWidth() + 20) * index + 'px',
        })
      })

    $('li.li')
      .eq(index_page)
      .find('#left-handler')
      .click(function (event) {
        console.log(index)
        event.stopPropagation()
        --index
        // if( index == len - 1 )return;
        if (index <= -1) {
          index = 0
          return
        }
        var $parent = $(this).parents('li')
        let li_index = $('li.li').index($parent)

        var date = $('li.li')
          .eq(li_index)
          .find('.images-item')
          .eq(index)
          .attr('date')
        $('.time-info').fadeIn().text(date)
        $swiperContainer.stop(true, true).animate({
          left: -($swiperItem.outerWidth() + 20) * index + 'px',
        })
      })
  }

  $('.images-list').click(function(event){
    event.stopPropagation()
  })

  // 宽度设置

  var $widow = $(window)

  $('.content-left').css({
    width: $widow.width() * 0.3 + 'px'
  })

  $('.content-right').css({
    width: $widow.width() * 0.7 + 'px'
  })
  

  var padding = $widow.width() * 0.3 * 0.16
  $('.content-left-part').css({
    paddingLeft: padding + 'px',
    paddingRight: padding + 'px',
  })

})
