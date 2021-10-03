function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; sameSite=strict; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
const GET_RANDOM_ID = () => {
	str = "1234567890abcdefghijklmnopqrstuvwxyz1234567890"

	let ID = ""
	for (let i = 0; i < 15; i++) {
		ID += str.charAt(Math.floor(Math.random() * str.length));;
	}
	return ID;
}
