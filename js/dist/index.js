"use strict";
//import { BeatSaverMap, Latest } from "./Types";
class BeatSaverClient {
    async getMapFromId(id) {
        try {
            let res = await fetch(`https://api.beatsaver.com/maps/id/${id}`);
            return (await res.json());
        }
        catch {
            return null;
        }
    }
    async Latest() {
        try {
            let res = await fetch(`https://api.beatsaver.com/maps/latest?automapper=true`);
            return (await res.json());
        }
        catch {
            return null;
        }
    }
    async getMapFromKey(key) {
        try {
            let res = await fetch(`https://api.beatsaver.com/maps/beatsaver/${key}`);
            return (await res.json());
        }
        catch {
            return null;
        }
    }
    async getMapFromHash(hash) {
        try {
            let res = await fetch(`https://api.beatsaver.com/maps/hash/${hash}`);
            return (await res.json());
        }
        catch {
            return null;
        }
    }
}
var $;
var client = new BeatSaverClient();
var attempt = 0;
async function getMap() {
    let latest = await client.Latest();
    let number = parseInt(latest.docs[0].id, 16);
    let newNumber = Math.floor(Math.random() * number + 1);
    let newHex = newNumber.toString(16);
    let mapData;
    try {
        mapData = await client.getMapFromId(newHex);
    }
    catch {
        return;
    }
    if (mapData.error) {
        attempt++;
        console.log("Map not found, Attempt: " + attempt);
        getMap();
        return;
    }
    if (mapData.automapper == true) {
        attempt++;
        console.log("BeatSage OMEGALUL");
        getMap();
        return;
    }
    attempt = 0;
    // Set Name, Mapper, and Author
    document.getElementById("songTitle").innerHTML = mapData.name;
    // Set desc
    document.getElementById("description").innerHTML = mapData.description.replace(/(\r\n|\n|\r)/gm, "<br />");
    document.getElementById("songAuthor").innerHTML = mapData.metadata.songAuthorName;
    document.getElementById("songMapper").innerHTML = "Mapped by " + mapData.metadata.levelAuthorName;
    // Set Rating, Downloads, and key
    var rating = mapData.stats.upvotes - mapData.stats.downvotes;
    document.getElementById("rating").innerHTML = rating + " ⭐";
    document.getElementById("downloads").innerHTML = mapData.stats.downloads + " 💾";
    document.getElementById("key").innerHTML = newHex + " 🔑";
    // Set date
    var dateUpladed = mapData.uploaded.split("T")[0].replace("-", "/").replace("-", "/");
    document.getElementById("date").innerHTML = dateUpladed + " 🕔";
    document.getElementById("oneclickBtn").href = "beatsaver://" + newHex;
    document.getElementById("downloadBtn").addEventListener("click", () => {
        navigator.clipboard.writeText(newHex);
    });
    document.getElementById("linkBtn").href = "https://beatsaver.com/beatmap/" + newHex;
    // Reset difficulty labels
    document.getElementById("expertplus1").style.display = "none";
    document.getElementById("expert1").style.display = "none";
    document.getElementById("hard1").style.display = "none";
    document.getElementById("normal1").style.display = "none";
    document.getElementById("easy1").style.display = "none";
    // Set difficulty labels
    var difficulties = mapData.versions[0].diffs;
    difficulties.forEach((diff) => {
        document.getElementById(diff.difficulty.toLowerCase() + "1").style.display = "block";
    });
    // Reset Characteristics labels
    document.getElementById("standard1").style.display = "none";
    document.getElementById("light1").style.display = "none";
    document.getElementById("oneSaber1").style.display = "none";
    document.getElementById("noArrow1").style.display = "none";
    document.getElementById("3601").style.display = "none";
    document.getElementById("901").style.display = "none";
    document.getElementById("law1").style.display = "none";
    // Set Characteristics Labels
    var characteristics = mapData.versions[0].diffs;
    characteristics.forEach((item) => {
        if (item.characteristic == "Standard") {
            document.getElementById("standard1").style.display = "block";
        }
        if (item.characteristic == "Lightshow") {
            document.getElementById("light1").style.display = "block";
        }
        if (item.characteristic == "Lawless") {
            document.getElementById("law1").style.display = "block";
        }
        if (item.characteristic == "OneSaber") {
            document.getElementById("oneSaber1").style.display = "block";
        }
        if (item.characteristic == "NoArrows") {
            document.getElementById("noArrow1").style.display = "block";
        }
        if (item.characteristic == "360Degree") {
            document.getElementById("3601").style.display = "block";
        }
        if (item.characteristic == "90Degree") {
            document.getElementById("901").style.display = "block";
        }
    });
    $("#songModal").modal("show");
    document.getElementById("loadingIcon").style.display = "none";
}
