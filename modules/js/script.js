/**
 * Plugin Name: jquery.SmoothScroll
 * Plugin URI: http://2inc.org
 * Description: スムーススクロールでページ内移動するためのプラグイン。指定要素のhashをもとに移動する。
 * Version: 0.5.0
 * Author: Takashi Kitajima
 * Author URI: http://2inc.org
 * Created: July 5, 2012
 * Modified: February 8, 2016
 * License: GPLv2+
 *
 * easing: http://gsgd.co.uk/sandbox/jquery/easing/
 * @param { duration, easing, offset, hash )
 */
( function( $ ) {
	var methods = {
		init : function( params ) {
			var methods = {
				scrollStop: function() {
					targetBody.stop( true );
				},
				getTargetBody: function() {
					if ( $( 'html' ).scrollTop() > 0 ) {
						targetBody = $( 'html' );
					} else if ( $( 'body' ).scrollTop() > 0 ) {
						targetBody = $( 'body' );
					}
					return targetBody;
				}
			}

			var defaults = {
				duration: 1000,
				easing  : 'easeOutQuint',
				offset  : 0,
				hash    : true
			};
			params = $.extend( defaults, params );

			var targetBody;

			return this.each( function( i, e ) {
				$( e ).on( 'click.SmoothScroll', function() {
					var targetHash = this.hash.split('%').join('\\%')/* Syntax error, unrecognized expression: % */ .split('(').join('\\(').split(')').join('\\)')
					var offset = $( targetHash ).eq( 0 ).offset();
					if ( !targetHash || offset === null || typeof offset === 'undefined' )
						return;

					var wst = $( window ).scrollTop();
					if ( wst === 0 )
						$( window ).scrollTop( wst + 1 );

					targetBody = methods.getTargetBody();
					if ( typeof targetBody === 'undefined' )
						return;
					targetBody.animate(
						{
							scrollTop: offset.top - params.offset
						},
						params.duration,
						params.easing,
						function() {
							if ( params.hash === true ) {
								history.pushState( '', '', targetHash );
							}
						}
					);

					if ( window.addEventListener )
						window.addEventListener( 'DOMMouseScroll', methods.scrollStop, false );
					window.onmousewheel = document.onmousewheel = methods.scrollStop;
					return false;
				} );
			} );
		},
		off: function() {
			$( this ).unbind( 'click.SmoothScroll' );
		}
	}

	$.fn.SmoothScroll = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};
} )( jQuery );

/* module
----------------------------------------------------------------*/
$(function () {
    var _lineHeight = '14px';
    var _fontSize = (parseInt(_lineHeight) - 2) + 'px';
    var spacer = 10;

    $('.m-module-code').each(function () {
        if (!$(this).next('textarea').length) {
            // html
            var $parentBlock = $(this).wrap('<div class="m-module-block">').parent();
            $parentBlock.append('<textarea class="htmlCode"></textarea><textarea class="jadeCode"></textarea>');
            var $html = $(this).html();
            $html = $html.replace(/</g, '&lt;');
            $html = $html.replace(/>/g, '&gt;');
            $html = $html.replace(/^\n/, '');

            if (!$(this).html().length) {
                $(this).next('textarea').hide()
            }
            if (!$parentBlock.find('.htmlCode').text().length) {
                $parentBlock.find('.htmlCode').html($html);
            }

            // jade
            var $htmlCode = $parentBlock.find('.htmlCode');
            var html = $htmlCode.text();
            var aryJade = Html2Jade.convertHtml(html, { bodyless: true, nspaces: 2, donotencode: true });
            var i = 0, jade = [];
            for (var ind in aryJade) {
                if (i > 0) {
                    jade.push(aryJade[ind]);
                }
                i++;
            }
            var $jadeCode = $parentBlock.find('.jadeCode').val(jade.join(''));

            // 入力内容に応じて高さの調整
            {
                // var _lineHeight = '14px';
                // var _fontSize = (parseInt(_lineHeight) - 2) + 'px';
                $htmlCode.css({fontSize: _fontSize, resize: "none", lineHeight:_lineHeight});
                $jadeCode.css({fontSize: _fontSize, resize: "none", lineHeight:_lineHeight});

                var hCols = $htmlCode.val().split("\n").length;
                var jCols = $jadeCode.val().split("\n").length;
                // console.log(hCols, jCols);
                
                if(hCols <= jCols){
                    $jadeCode.height((parseInt(_lineHeight) * jCols +  spacer) + 'px');
                    $htmlCode.height((parseInt(_lineHeight) * jCols +  spacer) + 'px');
                }else{
                    $jadeCode.height((parseInt(_lineHeight) * hCols +  spacer) + 'px');
                    $htmlCode.height((parseInt(_lineHeight) * hCols +  spacer) + 'px');
                }
            }
        }
    });
    // css
    $('.m-module-code-css').each(function () {
        var $cssCode = $(this).find('.cssCode');
        if ($cssCode.length) {
            $cssCode.css({fontSize: _fontSize, resize: "none", lineHeight:_lineHeight});
            var cCols = $cssCode.val().split("\n").length;
            $cssCode.height((parseInt(_lineHeight) * cCols +  spacer) + 'px');
        }
    });
    // js
    $('.m-module-code-js').each(function () {
        var $jsCode = $(this).find('.jsCode');
        if ($jsCode.length) {
            $jsCode.css({fontSize: _fontSize, resize: "none", lineHeight:_lineHeight});
            var jsCols = $jsCode.val().split("\n").length;
            $jsCode.height((parseInt(_lineHeight) * jsCols +  spacer) + 'px');

        }
    });
    // アンカー & 目次 作成
    $('body').prepend('<div id="module_indexes"><h2>モジュール一覧</h2></div>');
    var $indexes = $('#module_indexes');
    var $index = $('<ul>');

    $('h3').each(function () {
        // console.log($(this).text(), encodeURI($(this).text()));
        var _id = encodeURIComponent($(this).text());
        $(this).attr('id', _id);
        $index.append('<li><a href="#'+_id+'">'+$(this).text()+'</a></li>');
    });
    $indexes.append($index);

    // スムーススクロール
    $('a[href^="#"]').SmoothScroll({
            duration : 2000,    // スピード
            easing : 'easeOutQuint' // 動き方
    });


    // .m-module-code textarea attachEvent
    // (function () {
    //     var $textareas = $('textarea');

    //     // store init (default) state   
    //     $textareas.data('x', $textareas.outerWidth());
    //     $textareas.data('y', $textareas.outerHeight());

    //     $textareas.mousemove(function () {
    //         var $this = $(this);

    //         if ($this.outerWidth() != $this.data('x')
    //             || $this.outerHeight() != $this.data('y')) {
    //             // Resize Action Here
    //             var $textarea = $this;
    //             if($textarea.hasClass('htmlCode')){
    //                 $textarea = $this.next('textarea');
    //             }else{
    //                 $textarea = $this.prev('textarea');
    //             }
    //             $textarea.outerWidth($this.outerWidth());
    //             $textarea.outerHeight($this.outerHeight());
                
    //         }

    //         // store new height/width
    //         $this.data('x', $this.outerWidth());
    //         $this.data('y', $this.outerHeight());
    //     });
    // })();


    // var $ = jQuery,
    var $nav = $("#navigation"),
        $slideLine = $("#slide-line"),
        $currentItem = $(".current-item");

    $(function(){  
    // Menu has active item
    if ($currentItem[0]) {
        $slideLine.css({
        "width": $currentItem.width(),
        "left": $currentItem.position().left + parseInt($currentItem.css('marginLeft'))
        });
    }
    
    // Underline transition
    $($nav).find("li").hover(
        // Hover on
        function(){
        $slideLine.css({
            "width": $(this).width(),
            "left": $(this).position().left + parseInt($(this).css('marginLeft'))
        });
        },
        // Hover out
        function(){
        if ($currentItem[0]) {
            // Go back to current
            $slideLine.css({
            "width": $currentItem.width(),
            "left": $currentItem.position().left + parseInt($currentItem.css('marginLeft'))
            });
        } else {
            // Disapear
            $slideLine.width(0);
        }
        }
    );
    });

    // 横並び間隔揃え
    var max_w =0;
    $.when(
    $.each($('#navigation li'),function(){
        var w = $(this).width();
        max_w = (max_w < $(this).width())? w: max_w;
    })
    )
    .done(function() {
    // 最大幅
    // console.log(max_w);
    var new_w = max_w + 20;
    $.each($('#navigation li'),function(){
        var side = new_w - $(this).width() / 2;
        $(this).css({marginLeft: side + 'px', marginRight: side + 'px'});
    })
        //   margin-right: 45px;
    });

    $('.js-tab').each(function () {
        var $tabs = $(this).find('.btn');
        // console.log('tabs:'+ $tabs.length);
        // console.log($tabs);
        var swichContent = function(){
            var i = 0;
            $.each($tabs, function(){
                var el = $(this).parent().find('.c-tab-content').get(i);
                if($(this).hasClass('is-current')){
                    $(el).show();
                }else{
                    $(el).hide();
                }
                i++; 
            });
        };
        $tabs.on('click', function(e){
            e.preventDefault();
            var $tabs = $(this).parent().children('.btn');
            $.each($tabs, function(){
                 $(this).removeClass('is-current');
            });
            $(this).addClass('is-current');
            swichContent();
        });
        swichContent();
    });
});


