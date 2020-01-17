let lang = window.location.href.split("lang=")[1];
if (lang) {
  $("#search-box").val(lang);
  updateList(lang);
} else {
  updateList();
}
function updateList(query, type) {
  $("#searchLoad").css("display", "");
  $.ajax({
    method: "GET",
    url: "/api/v1/search",
    data: {
      q: query
    }
  })
    .done(function(data) {
      console.log(data);
      $("#user-list").text("");
      for (var i = 0; i < data.length; i++) {
        $("#user-list").append(`<li class="list-group-item">
               <img src="${data[i].profile_picture}" class="logo">
               <b><a href="/u/@${data[i].username}" id="list-username">  ${
          data[i].username
        }</a> ${data[i].languages
          .map(
            l =>
              `<span class="label label-info"><a href="/u?lang=${l}">${l}</a></span>`
          )
          .join(" ")}</b>
            </li>`);
      }
      $("#searchLoad").fadeOut();
    })
    .fail(function(data) {
      show_notification("Oops! Error: " + data.message, "danger");
      $("#searchLoad").fadeOut();
    });
  // } else if (type == "lang") {
  //   $.ajax({
  //     method: "GET",
  //     url: "/api/v1/search",
  //     data: {
  //       q: $("#search-box").val(),
  //       lang: query
  //     }
  //   })
  //     .done(function(data) {
  //       //show_notification('','success');
  //       console.log(data);
  //       $("#user-list").text("");
  //       for (var i = 0; i < data.length; i++) {
  //         $("#user-list").append(`<li class="list-group-item">
  //              <img src="${data[i].profile_picture}" class="logo">
  //              <b><a href="/u/@${data[i].username}" id="list-username">${
  //           data[i].username
  //         }</a></b>
  //              <i class="badge badge-info">${query.toLowerCase()}</i>
  //           </li>`);
  //       }
  //     })
  //     .fail(function(data) {
  //       show_notification("Oops! Some error out there.", "danger");
  //     });
  // }
}
