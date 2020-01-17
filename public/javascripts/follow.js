function follow() {
  let elem = this;
  $.ajax({
    method: "POST",
    url: "/api/v1/follow",
    data: {
      username: $(elem).attr("data-follow")
    }
  })
    .done(function(data) {
      show_notification(data.msg, "success");
      $(elem).text(data.followed ? "Unfollow" : "Follow");
    })
    .fail(function(data) {
      show_notification("Uh Oh, some error occured, try reloading.");
      console.error(data);
    });
}

$("#follow-btn").on("click", follow);
