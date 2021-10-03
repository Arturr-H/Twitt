

const check = async () => {

    let resjson;

    await fetch("https://backend.artur.red/CheckAccountAvailability").then(async (res) => {
        if(res.status == 404){
            setCookie("usr", "", 30)
            setCookie("uid", "", 30)
        }else{
            resjson = await res.json()

            document.getElementById("PROFILE_LINK").href = `https://backend.artur.red/user/${resjson.id}`

        }
    })



}

check()