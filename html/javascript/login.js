const error = document.getElementById("throw")

const throwErr = (n) => {
    error.innerHTML = n
}

const submit = async () => {

    const email = document.getElementById("emi").value
    const password = document.getElementById("psi").value




    if(email.includes("@") == -1){
        throwErr("Invalid email.")
    }else if(email.includes(".") == 0){
        throwErr("Invalid email.")
    }else{
        throwErr("")
        try{
            await fetch("https://backend.artur.red/LoginAccount", {
                method: "GET",
                headers: {
                    password: password,
                    email: email,
                }
            }).then(async (res) => {

                const response_json = await res.json()

                const userid = response_json.id
                const username = response_json.username

                if(!res.ok){
                    throwErr("Incorrect email or password.")
                }else{
                    setCookie("usr", email + ",-," + password, 30);
                    setCookie("uid", userid, 30)
                    setCookie("usnm", username, 30)

                    window.open("https://backend.artur.red", "_self");
                }

            })

        }catch(err){
            console.log(err)
        }
    }

}

const submitBtn = document.getElementById("sbm")
submitBtn.addEventListener("click", submit)