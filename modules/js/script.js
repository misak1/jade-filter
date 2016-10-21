/* module
----------------------------------------------------------------*/
$(function () {
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
            $parentBlock.find('.jadeCode').val(jade.join(''));
        }
    });
    (function () {
        var $textareas = $('textarea');

        // store init (default) state   
        $textareas.data('x', $textareas.outerWidth());
        $textareas.data('y', $textareas.outerHeight());

        $textareas.mousemove(function () {
            var $this = $(this);

            if ($this.outerWidth() != $this.data('x')
                || $this.outerHeight() != $this.data('y')) {
                // Resize Action Here
                var $textarea = $this;
                if($textarea.hasClass('htmlCode')){
                    $textarea = $this.next('textarea');
                }else{
                    $textarea = $this.prev('textarea');
                }
                $textarea.outerWidth($this.outerWidth());
                $textarea.outerHeight($this.outerHeight());
                
            }

            // store new height/width
            $this.data('x', $this.outerWidth());
            $this.data('y', $this.outerHeight());
        });
    })();

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


