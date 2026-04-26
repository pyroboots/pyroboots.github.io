const logs = [
    {
        date: "18/04/26",
        title: "site update 01",
        desc: `# building the dashboard
        finally got around to adding tabs.
        # the logic
        it uses a simple display: none toggle.
        > note: need to fix the mobile layout later.`
    },
    {
        date: "19/04/26 :: 1",
        title: "site update 02",
        desc: `# what?
         - made the majority of DOM construction happen in js (im more programmatical)
         - moved art and log json contents to /data/
        # where?
        > /lib/ui.js
        > /src/site.js`
    },
    {
        date: "19/04/26 :: 2",
        title: "tactile ue materials",
        desc: `made a pretty interesting frosted/acrylic glass path tracing (essentially pbr) in unreal engine today. ill probably put a picture on the gallery because it looks very cool`
    },
    {
        date: "20/04/26",
        title: "site update 03",
        desc: `added a specs page with my system specs and my declining sleep quality that mimics neofetch`
    },
    {
        date: "21/04/26",
        title: "site update 04",
        desc: ` - updated spec page to include stack and about me
         - make about me the default page`    
    },
    {
        date: "26/04/26",
        title: "site update 05",
        desc: ` - changed tag format
         - artwork order reversed to show newest first`    
    }
];

export { logs }