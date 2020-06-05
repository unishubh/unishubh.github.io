function getVariables (url, refdoc) {
    let parsedUrl = new URL(url);
    Proi = parsedUrl.searchParams.get("roi");
    Ptime = parsedUrl.searchParams.get("time");
    Pamount = parsedUrl.searchParams.get("amount");
    Pdelay = parsedUrl.searchParams.get("delay");

    time = (Ptime == null) ? 5 : Ptime;
    amount = (Pamount == null) ? 2000 : Pamount;
    roi = (Proi == null) ? 12 : Proi;

    delayTime = (Pdelay == null) ?6 : Pdelay;
    console.log("getting here", roi);
    if(refdoc.getElementById("rate") != null) {
        refdoc.getElementById("rate").value = roi;
    }
    if(refdoc.getElementById("years") != null) {
        refdoc.getElementById("years").value = time;
    }
    if(refdoc.getElementById("principle") != null) {
        refdoc.getElementById("principle").value = amount;
    }
    if(refdoc.getElementById("delay") != null) {
        refdoc.getElementById("delay").value = delayTime;
    }

}