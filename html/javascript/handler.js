let CONTAINER = document.getElementById("CARD_CONTAINER")

if(Cards != ""){
    Cards.reverse().forEach(element => {
        // <a href="https://backend.artur.red/twitt/${element.id}">

        CONTAINER.innerHTML += `
            
            <div class="CARD">
                <div class="CARD_LEFT_BAR">
                    <a href="https://backend.artur.red/user/${element.creatorname.toLowerCase()}"><img class="PROFILE_IMG" src="https://avatars.dicebear.com/api/open-peeps/${element.creatorname.toLowerCase()}.svg"></a>
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

const publishTwitt = async () => {

    let text = document.getElementById("inpt").value
        .replace(/\</g, "")
        .replace(/\>/g, "")
        .replace(/\n/gm, "<br />")

    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()].toString()
    const day = new Date().getDate().toString()
    const year = new Date().getFullYear().toString()
    const hour = new Date().getHours()
    const minute = new Date().getMinutes()

    let TwittDate = month + " " + day + ", " + year + " " + hour + ":" + minute;

    console.log(TwittDate)


    if (text.length >= 1){
        document.getElementById("pbls").disabled = true

        await fetch("https://backend.artur.red/post", {
            method: 'GET',
            headers: {
                text: text,
                tdate: TwittDate,
                hashtag: [...text.matchAll(/\B\#([a-zA-Z]+\w)/gm)],
                creatorname: getCookie("usnm"),
                creatorid: getCookie("uid"),
            },
        })
    
        document.getElementById("inpt").value = "";
        this.location.reload();
    }

}

document.getElementById("pbls").addEventListener("click", publishTwitt);

const tgnm = () => {

    if(getCookie("ngmode") == undefined){
        setCookie("ngmode", false, 30)
    }else{
        setCookie("ngmode", (getCookie("ngmode") == 0) ? 1 : 0)
    }

    if(getCookie("ngmode") == 0){
        document.documentElement.style.setProperty("--PRIMARY", "rgb(50, 46, 60)");
        document.documentElement.style.setProperty("--SECONDARY", "rgb(40, 36, 50)");
        document.documentElement.style.setProperty("--TEXT", "white");

    }else {

        document.documentElement.style.setProperty("--PRIMARY", "rgb(245, 245, 245)");
        document.documentElement.style.setProperty("--SECONDARY", "rgb(255, 255, 255)");
        document.documentElement.style.setProperty("--TEXT", "black");
    }
}    
// if(getCookie("ngmode") == 0){
document.documentElement.style.setProperty("--PRIMARY", "rgb(50, 46, 60)");
document.documentElement.style.setProperty("--SECONDARY", "rgb(40, 36, 50)");
document.documentElement.style.setProperty("--TEXT", "white");

// }else {

//     document.documentElement.style.setProperty("--PRIMARY", "rgb(245, 245, 245)");
//     document.documentElement.style.setProperty("--SECONDARY", "rgb(255, 255, 255)");
//     document.documentElement.style.setProperty("--TEXT", "black");
// }