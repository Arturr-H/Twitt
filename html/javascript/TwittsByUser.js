let CONTAINER = document.getElementById("CARD_CONTAINER")
console.log(Twitts)
if(Twitts != ""){
    Twitts.reverse().forEach(element => {

        CONTAINER.innerHTML += `
            
            <div class="CARD" style="z-index: 100">
                <div class="CARD_LEFT_BAR">
                    <img class="PROFILE_IMG" src="https://avatars.dicebear.com/api/open-peeps/${element.creatorid}.svg">
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
                            }
                        </p>
                    </div>
            </div>

            <div class="CARD_CONFIG_BAR">
                <a class="ICON_LINK"><i class="material-icons">favorite_border</i></a>
                <a class="ICON_LINK"><i class="material-icons">ios_share</i></a>
                <a class="ICON_LINK"><i class="material-icons">bookmark_border</i>
                <a class="ICON_LINK" href="https://backend.artur.red/twitt/${element.id}"><i class="material-icons">chat_bubble_outline</i></a>
                <a class="ICON_LINK" style="font-size: 1vmax; margin: 0; margin-right: 0.5vmax; color: rgba(135, 135, 135, 0.5); margin-bottom: 0.2vmax">(${element.amount_c})</a>

                <a class="ICON_LINK" style="font-size: 0.9vmax; color: rgba(135, 135, 135, 0.5); width: 10vmax">${element.date}</a>
            </div>
        `
    });
}else{
    CONTAINER.innerHTML += "<h1 style='margin-top: 5.5vmax; font-size: 2vmax; text-align: center;'>Add some friends to build your for you page!</h1>"
}
