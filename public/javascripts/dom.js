$(document).on('click', '#sidebarToggle', function(){
        $('#sidebar').toggleClass('active');
        $('#sidebar').toggleClass('hidden-xs');
        $('#sidebar').toggleClass('hidden-sm');
        $('#sidebar').toggleClass('hidden-md');
        $('#sidebar').toggleClass('hidden-lg');
        if($('#sidebar').hasClass('active')){
            $('#main').removeClass('col-sm-9 col-lg-10');
            $('#main').addClass('col-sm-12 col-lg-12');
        }else{
            $('#main').removeClass('col-sm-12 col-lg-12');
            $('#main').addClass('col-sm-9 col-lg-10');
        }
    });

function show_notification(msg, type) {
        $('#notify_message').removeClass()
        $('#notify_message').addClass('notify_message-'+type)
        $('#notify_message').html('<center>'+msg+'</center>');
        $('#notify_message').slideDown(600).delay(3000).slideUp(600, function(){

        });

}
function activity_bubble(n) {
  $("#activity").html(n)
}
function show_new_notification(obj, type, n) {
       // domReady
  $(function() {
    var notification = new NotificationFx({
							message : `<a href="/me/activity"><div class="ns-thumb"></div><div class="ns-content" style="border:1px solid #f2f2f2;border-radius:5px;"><p>${obj.msg}</p></div></a>`,
							layout : 'other',
							ttl : 8000,
							effect : 'thumbslider',
							type : type
						});

						// show the notification
						notification.show();
            activity_bubble(n)
    });
    // create the notification
}
/** Incomplete pop-up image view feature [TODO]
function viewImage(id) {
    $("#modal_image_view")[0].src = $(`#${id}`)[0].src;
}
**/
