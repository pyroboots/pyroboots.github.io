const DISCORD_ID = "605705482400956417"; 

const overrides = {
    "listening to let it happen - tame impala":                                     "letting it happen",
    "listening to dreams - beck":                                                   "dreaming",
    "listening to skin and bones - cage the elephant":                              "if i stumble will i fall?",
    "listening to like him (feat. lola young) - tyler, the creator; lola young":    "DO I LOOK LIKE HIM?!",
    "listening to vaudeville villain - viktor vaughn; mf doom":                     "v vaughn the travelin vaudeville villain!",
    "listening to broken boy - cage the elephant":                                  "BROKEN BOY! HOW DOES IT FEEL?!",
    "listening to machine love - jamie paige":                                      "can we wander for a spell and live in parallel?",

    "playing vscodium": "@vscodium.state @vscodium.details"
}

async function updateStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data } = await response.json();

        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');

        const statusColors = {
            online: '#43b581',
            idle: '#faa61a',
            dnd: '#f04747',
            offline: '#747f8d'
        };
        statusDot.style.backgroundColor = statusColors[data.discord_status] || statusColors.offline;

        let status = "";
        const activity = data.activities.find(a => a.type === 0) || data.activities[0];
        if (data.listening_to_spotify)
            status = `listening to ${data.spotify.song} - ${data.spotify.artist}`;
        else if (data.activities.length > 0)
            status = `playing ${activity.name}`;
        else
            status = data.discord_status === 'offline' ? 'offline' : 'idle';

        if (overrides[status.toLowerCase()] != undefined) 
            status = overrides[status.toLowerCase()] 

        if (activity.name.toLowerCase() == "vscodium") {
            status = status.replaceAll("@vscodium.state", activity.state);
            status = status.replaceAll("@vscodium.details", activity.details);
        }

        if (status.toLowerCase() != statusText.innerText.toLowerCase()) 
            statusText.innerText = status
    } catch (e) {
        console.error("lanyard error oops:", e);
    }
}

updateStatus();
setInterval(updateStatus, 1000);