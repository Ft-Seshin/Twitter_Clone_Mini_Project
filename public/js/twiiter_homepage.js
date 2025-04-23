$(document).ready(function(){
    $(".tweet").addClass("none");

    $(".fav").click(function(){
        $(this).css("color","rgb(238, 24, 95)")
        $(this).removeClass("far");
        $(this).addClass("fas");
    });
    $(".rt").click(function(){
        $(this).css("color","rgb(48, 185, 48)");
    });

    $("#inp").click(function(){
        $(".mid-tweet").css("cursor","pointer");
        $(".mid-tweet").css("opacity","1");
    });

    $(".mid-tweet").click(function(){
        var inpVal = $(".inp").val();

        $(".tweet").removeClass("none");
        $(".tweet").addClass("flx");
        $(".content-2").html(inpVal);
        $(".content-2").html(inpVal);

        first = inpVal.slice(0, inpVal.indexOf(" "));
        $(".gc-1").html(first);
        $(".s-1").html("1 Tweet");

        $(".inp").val("");

    });

    $('.inp').keypress(function(e){
        if (e.which == 13) {
          $('.mid-tweet').click();
          return false;   
        }
      });

    $(".follow").click(function(){
        $(this).css("background","#00acee");
        $(this).css("color","white");
        $(this).html("Following");
    });  

});
$(document).ready(function(){
    
    function submitComment() {
        var comment = $("#commentInput").val(); 
        if (comment.trim() !== "") { 
            
            $("#commentList").append("<li>" + comment + "</li>");
            $("#commentInput").val(""); 
        }
    }
    $("#submitComment").click(submitComment);
    $("#commentInput").keypress(function(e){
        if (e.which == 13) { 
            submitComment();
            e.preventDefault(); 
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    var postCommentBtn = document.getElementById('post-comment-btn');
    postCommentBtn.addEventListener('click', postComment);

    function postComment() {
        var commentInput = document.getElementById('comment-input');
        var commentText = commentInput.value.trim();
        
        if (commentText !== '') {
            var commentList = document.getElementById('comment-list');
            var newComment = document.createElement('li');
            newComment.className = 'comment';
            newComment.textContent = commentText;
            commentList.appendChild(newComment);
            commentInput.value = '';
        } else {
            alert('Please enter a comment!');
        }
    }
});

