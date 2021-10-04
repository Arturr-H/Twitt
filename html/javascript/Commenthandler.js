

document.getElementById("pbls").addEventListener("click", async () => {

    const text = document.getElementById("inpt").value
        .replace(/\>/gm, "")
        .replace(/\</gm, "")
        .replace(/\n/gm, "<br />")
    const id = t_id;

    if (text.length >= 1){
        document.getElementById("pbls").disabled = true

        console.log("shiting")

        await fetch("https://backend.artur.red/postComment", {
            method: 'GET',
            headers: {
                text: text,
                hashtag: [...text.matchAll(/\B\#([a-zA-Z]+\w)/gm)],
                postid: id,
                username: getCookie("usnm").toLowerCase(),
            },
        })
        console.log("shiting")
        document.getElementById("inpt").value = "";
        this.location.reload();
    }


})

console.log(comments)

comments.forEach(element => {

    document.getElementById("COMMENT_OUT").innerHTML += `
        <div style="display: inline-block; margin: 0.5vmax; width: calc(50% - 1.2vmax)">
            <div class="CARD" style="width: 100%; margin-top: 0">
                <div class="CARD_LEFT_BAR">
                    <a href="https://backend.artur.red/user/${element.username}"><img class="PROFILE_IMG" src="https://avatars.dicebear.com/api/open-peeps/${element.username}.svg"></a>
                </div>
                    <div class="CARD_RIGHT_BAR">
                        <p>
                            ${
                                element.text
                                    
                                    .replace(/\*\*\*(.*?)\*\*\*/gm, "<b><i>$1</i></b>")
                                    .replace(/\*\*(.*?)\*\*/gm, "<b>$1</b>")
                                    .replace(/\*(.*?)\*/gm, "<i>$1</i>")
                                    .replace(/\*\*/gm, "")
                                    .replace(/\B\#([a-zA-Z]+\w)/gm, "<a class='LINK' href='https://backend.artur.red/hashtag/$1'>#$1</a>")
                                    .replace(/\@([a-zA-Z]+\w)/gm, "<a class='LINK' href='https://backend.artur.red/user/$1'>@$1</a>")

                            }
                        </p>
                    </div>
            </div>

            <div class="CARD_CONFIG_BAR" style="width: 100%">
                <a class="ICON_LINK"><i class="material-icons">favorite_border</i></a>
                <a class="ICON_LINK"><i class="material-icons">ios_share</i></a>
                <a class="ICON_LINK"><i class="material-icons">bookmark_border</i>

                <a></a>
            </div>
        </div>
    `
});