(function() {
  var page = 1;
  var finished;
  var running;
  var lastSorted = "feed";
  $(".sort-btn").on("click", function() {
    $(".sort-btn").removeClass("active");
    $(this).addClass("active");
    lastSorted = $(this)
      .text()
      .toLowerCase();
    finished = false;
    $("#posts").html("");
    getPosts(1, lastSorted);
  });
  function load(loaded) {
    $("#loader").remove();
    if (!loaded) {
      $("#posts").append(
        '<div id="loader" class="col-md-12 text-center"><br><br><img src="/images/logo.gif"></div>'
      );
    }
  }
  function getPosts(page = 1, sort = lastSorted) {
    if (running) return;
    load();
    if (finished) return load(true);
    if (page == 1) var method = "prepend";
    else var method = "append";
    running = true;
    $.ajax(`/api/v1/posts?page=${page}&sort=${sort}`).done(function(posts) {
      running = false;
      console.log("posts", posts);
      posts.reverse();
      console.log(posts.length);
      if (posts.length == 0 && page == 1) {
        finished = true;
        $("#posts").append(`
        <div class="alert alert-dismissible alert-success">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>Well done!</strong> You are all up to date!
        </div>`);
      } else if (posts.length == 0 && page > 1) {
        load(true);
        return $(window).off("scroll");
      }
      posts.forEach(p =>
        $("#posts")[method](`<div class="gram-card">
                <div class="gram-card-header">
                  <img src="${
                    p.author.profile_picture
                  }?cache=${Math.random()}" class="gram-card-user-image lozad">
                  <a class="gram-card-user-name" href="/u/@${
                    p.author.username
                  }">${p.author.username}</a>
            
                        <div class="dropdown gram-card-time">
                          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="glyphicon glyphicon-option-vertical"></i></a>
                          <ul class="dropdown-menu dropdown-menu-right">
                          ${
                            p.post.static_url != undefined
                              ? "<li><a href=" +
                                p.post.static_url +
                                '><i class="fa fa-share"></i> View</a></li>'
                              : ""
                          }
                        ${
                          p.owner
                            ? `
                              <li><a href="/me/post/${p.post._id}"><i class="fa fa-cog"></i> Edit</a></li>
                              <li><a href="/me/post/delete/${p.post._id}"><i class="fa fa-trash"></i> Delete</a></li>
                            `
                            : ""
                        }
                          </ul>
                          </div>
                          <div class="time">${p.post.timeago}</div>
                </div>
            <br>
            <br>
                <div class="gram-card-image">
                  ${
                    p.post.static_url
                      ? `${
                          p.post.type == "png" ||
                          p.post.type == "jpg" ||
                          p.post.type == "jpeg"
                            ? `
                  <center>
                    <a href="${p.post.static_url}" class="progressive replace">
                        <img author="${p.author.id}" src="" id="${p.post._id}" class="post img-responsive lozad preview">
                    </a>        
                  `
                            : `
                  <video author="${p.author.id}" src="${p.post.static_url}" id="${p.post._id}" class="post img-responsive" controls></video>
                  `
                        }`
                      : p.post.code
                      ? `<pre style="margin:5%">${p.post.code}</pre>`
                      : ""
                  }
                  </center>
                </div>
                <div class="gram-card-content">
            
                  <p><a class="gram-card-content-user" href="/u/@${
                    p.author.username
                  }">${p.author.username}</a>
                  ${p.post.caption}
                    <span class="label label-info">${
                      p.post.category
                        ? p.post.category
                        : p.post.code
                        ? "Code"
                        : "Unknown"
                    }</span>
            
                 </p>
            
                  <p class="comments">${p.post.comments.length} comment(s).</p>
                  <br>
            
                  <div class="comments-div" id="comments-${p.post._id}">
            
                   ${p.post.comments
                     .map(
                       c => `
                    <a class="user-comment" href="/u/@${c.by}">
                        ${c.by}
                    </a>
                    ${c.text}
                    <br>
                   `
                     )
                     .join("")}
            
                  </div>
                <hr>
                </div>
            
                <div class="gram-card-footer">
                  <button data="${JSON.stringify(
                    p.post.likes
                  )}" style="color: ${
          p.post.likes.find(x => x == $("#posts").attr("user-id"))
            ? "grey"
            : "#f0b917"
        }" class="footer-action-icons likes btn btn-link non-hoverable like-button-box" author="${
          p.author.id
        }" id="${p.post._id}-like">
                    <i class="glyphicon glyphicon-thumbs-up"></i> ${
                      p.post.likes.length
                    }</button>
            
                  <input id="${
                    p.post._id
                  }" class="comments-input comment-input-box" author="${
          p.author.id
        }" type="text" id="comment" placeholder="Click enter to comment here..."/>
            
                </div>
            
              </div>`)
      );
      load(true);
      $(window).on("scroll", function() {
        if (finished == true) return $(window).off(this);
        if ($(document).height() - $(document).scrollTop() < 1369) {
          page++;
          getPosts(page);
        }
      });
      $(".like-button-box").off("click");
      $(".like-button-box").on("click", likeById);

      function likeById() {
        console.log(this.id);
        const elem = this;
        var author = $(`#${this.id}`).attr("author");
        $.ajax({
          method: "POST",
          url: "/api/v1/like?cache=" + Math.random(),
          data: {
            _id: this.id.toString().split("-like")[0],
            author: author
          }
        })
          .done(function(data) {
            if (data.event) {
              $(elem).html(
                $(elem)
                  .html()
                  .split("</i>")[0] +
                  "</i> " +
                  data.amount
              );
              $(elem).css("color", data.msg != "Liked!" ? "#f0b917" : "grey");
              show_notification(data.msg, "success");
            } else {
              show_notification(data.msg, "danger");
            }
          })
          .fail(function(data) {
            show_notification("Some error while liking the feed", "danger");
            console.log(data);
          });
      }
      $(".comment-input-box").off("keydown");
      $(".comment-input-box").on("keydown", commentById);

      function commentById(key) {
        if (!this.value) return;
        else if (key.keyCode == 13) {
          var el = this;
          $.ajax({
            method: "POST",
            url: "/api/v1/comment",
            data: {
              _id: el.id,
              author: $(el).attr("author"),
              text: el.value
            }
          })
            .done(function(data) {
              $(
                "#comments-" + el.id
              ).append(`<a class="user-comment" href="/u/@dan-online">
              ${$(el).attr("author")}
          </a> ${el.value}<br>`);
              el.value = "";
              show_notification("Comment added!", "success");
            })
            .fail(function(data) {
              show_notification(
                "Some error while posting the comment.",
                "danger"
              );
              console.log(data);
            });
        }
      }
    });
  }
  getPosts();
})();
