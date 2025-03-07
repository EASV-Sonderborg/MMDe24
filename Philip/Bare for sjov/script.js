let like = document.getElementById("like")
let dislike = document.getElementById("dislike")
let likeScore = document.getElementById("likeScore")
let dislikeScore = document.getElementById("dislikeScore")

let likes = 0
let dislikes = 0


function liked()    {
    likes = likes + 1
    likeScore.innerHTML = likes
}

function disliked()    {
    dislikes = dislikes + 1
    dislikeScore.innerHTML = dislikes
}


