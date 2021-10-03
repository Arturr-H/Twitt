const error = document.getElementById("throw")

const throwErr = (n) => {
    error.innerHTML = n
}

const submit = async () => {

    const email = document.getElementById("emi").value
    const username = document.getElementById("uni").value
    const password = document.getElementById("psi").value


    if(username.length <= 3){
        throwErr("Username too short.")
    }else if(email.includes("@") == -1){
        throwErr("Invalid email.")
    }else if(email.includes(".") == -1){
        throwErr("Invalid email.")
    }else if(password.length <= 5){
        throwErr("Password must contain at least 6 characters.")
    }else if (username.match(/^[0-9A-Za-z]+$/) === null) { 
        throwErr("Invalid username. (a-z, 0-9)")
    }else{
        throwErr("")

        const uid = GET_RANDOM_ID()

        try{
            await fetch("https://backend.artur.red/CreateAccount", {
                method: "GET",
                headers: {
                    username: username,
                    password: password,
                    email: email,
                    id: uid,
                }
            }).then((res) => {

                if(res.status == 226){
                    throwErr("Email already registered!")
                }
                else if(res.ok){
                    setCookie("usr", email + ",-," + password, 30);
                    setCookie("uid", uid, 30);
                    window.open("https://backend.artur.red", "_self");
                }else{
                    throwErr("Error")
                }
            })

        }catch(err){
            console.log(err)
        }
    }
}

const submitBtn = document.getElementById("sbm")
submitBtn.addEventListener("click", submit)