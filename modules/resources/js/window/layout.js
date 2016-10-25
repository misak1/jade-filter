/**
 * FileZilla風レイアウト
 */
$(function () {
    window.onresize = resize;
    resize();
});

var $content = $("#content");

var headerHeight = $('#content-header').height();
var content_margin_side = 30;
var footer_margin_bottom = 5;
var border_width_x4 = (parseInt($('.window.top').css('border-left-width')) * 2) + (parseInt($('.window.top').css('border-right-width')) * 2)
var divHeight = $("#div_left").height();
var winHeight;

var floatFormat = function (number, n) {
    var _pow = Math.pow(10, n);

    return Math.ceil(number * _pow) / _pow;
}

var resize = function () {
    if ($content.hasClass('is-Single')) {
        console.log('not resize');
        return true;
    }
    winHeight = (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight));

    var ratio = floatFormat($content.height() / winHeight, 2);
    //var panelHeight = Math.ceil((winHeight - divHeight) * ratio);
    var panelHeight = Math.round((winHeight - divHeight) * ratio);

    $("#content").css({
        "min-height": panelHeight
    });
    $("#div_vertical").css({
        "height": panelHeight
    });
    $("#LeftPanel").css({
        "height": panelHeight - divHeight
    });

    // var content_width = $("#content").width();
    var content_width = $("body").width(); // DebToolの表示時に正しい値が取れない為
    var RightPanelWidth = content_width - $("#LeftPanel").width() - $("#div_vertical").width() - border_width_x4;
    $("#RightPanel").css({
        "height": panelHeight - divHeight,
        "width": RightPanelWidth
    });
    // 諄いようだけど
    var LeftPanelWidth = content_width - $("#RightPanel").width() - $("#div_vertical").width() - border_width_x4;
    $("#LeftPanel").css({
        "width": LeftPanelWidth
    });

    $("#content-footer").height(winHeight - (headerHeight + panelHeight + footer_margin_bottom));
}
$('#btnShowFooter a').on('click', function () {
    footerShow(true);
    setTimeout(function () {
        window.resize();
    }, 300);
});
$('#btnShowRight a').on('click', function () {
    leftPanelShow(true);
    setTimeout(function () {
        window.resize();
    }, 300);
});
$('#btnShowLeft a').on('click', function () {
    rightPanelShow(true);
    setTimeout(function () {
        window.resize();
    }, 300);
});
var leftPanelShow = function (isShow) {
    setTimeout(function (isShow) {
        if (!isShow) {
            $("#div_vertical, #RightPanel").hide();
            $("#LeftPanel").css({ width: '100%' });
            $('#btnShowRight').css({ display: 'inline-block' });
        } else {
            $("#LeftPanel").css({ width: '80%' });
            $("#RightPanel").css({ width: '20%' });
            $("#div_vertical, #RightPanel").show();
            $('#btnShowRight').hide();
            // window.resize();
        }
    }, 300, isShow);
}
var rightPanelShow = function (isShow) {
    setTimeout(function (isShow) {
        if (!isShow) {
            $("#div_vertical, #LeftPanel").hide();
            $("#RightPanel").css({ width: '100%' });
            $('#btnShowLeft').css({ display: 'inline-block' });
        } else {
            $("#RightPanel").css({ width: '80%' });
            $("#LeftPanel").css({ width: '20%' });
            $("#div_vertical, #LeftPanel").show();
            $('#btnShowLeft').hide();
            // window.resize();
        }
    }, 300, isShow);
}

var footerShow = function (isShow) {
    setTimeout(function (isShow) {
        if (!isShow) {
            $("#content-footer").hide();
            $("#content").css({ minHeight: '', height: '100%' });
            $("#LeftPanel, #RightPanel").css({ height: '100%' });
            $('#btnShowFooter').css({ display: 'inline-block' });
        } else {
            $("#content-footer").show();
            $("#content").css({ minHeight: '80%', height: '80%' });
            $("#LeftPanel, #RightPanel").css({ height: '80%' });
            $('#btnShowFooter').hide();
        }
    }, 300, isShow);
}

$.resizable = function (resizerID, vOrH) {
    $('#' + resizerID).bind("mousedown", function (e) {
        var start = vOrH === 'v' ? e.pageX : e.pageY;
        var height = $content.height();
        var leftwidth = $('#' + resizerID).prev().width();
        var rightwidth = $('#' + resizerID).next().width();


        var mouseMove = function (e) {
            var end = vOrH === 'v' ? e.pageX : e.pageY;
            if (vOrH == 'h') {
                // タテ
                var newHeight = height + (end - start);
                console.log(newHeight);
                if (newHeight > content_margin_side || newHeight < 0) {
                    $content.height(newHeight);
                    if (newHeight > $(window).height() - $('#content-header').height() - 40) {
                        console.log("vertical-over");
                        e.preventDefault(); // drag キャンセル
                        footerShow(false);
                    }

                    $("#content").css({
                        "min-height": newHeight
                    });
                    $("#div_vertical").css({
                        "height": newHeight
                    });
                    $("#LeftPanel, #RightPanel").css({
                        "height": newHeight - divHeight
                    });
                    $("#content-footer").height(winHeight - (headerHeight + newHeight + footer_margin_bottom));

                }
            } else {
                // ヨコ
                var newLeftWidth = leftwidth + (end - start);
                var newRightWidth = rightwidth - (end - start);

                // 段落ち対策
                if (content_margin_side < newLeftWidth && newRightWidth > content_margin_side) {
                    $('#' + resizerID).prev().width(newLeftWidth);
                    $('#' + resizerID).next().width(newRightWidth);
                } else {
                    if (newRightWidth <= content_margin_side) {
                        leftPanelShow(false);
                    } else {
                        rightPanelShow(false);
                    }
                    console.log("holizontal-over");

                }
            }
        };
        document.addEventListener('mouseup', function (e) {
            document.removeEventListener("mousemove", mouseMove);
        });
        document.addEventListener('mousemove', mouseMove);
    });
}
$.resizable('div_vertical', "v");
$.resizable('div_right', "h");
$.resizable('div_left', "h");


// var a389 = function(){
//     console.log("a389");
//     $("#div_C").load("simple.txt", function (myData, myStatus){
//         console.log('myData', myData);
//         console.log('myStatus', myStatus);
//         //  $("div_C").append("myStatus = " + myStatus);
//     });
// };
// a389();

// // onload
// window.onresize = resize;
// resize();
// global.resize = resize;