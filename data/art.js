const tags = {
    collection_ue: "unreal engine",
    collection_cat: "/!\\ cat /!\\",
    collection_programming: "experiment",

    rm_traced: "path traced",
    rm_deferred: "deferred",
}

const art = [
    {
        "img": "img/liminal_trace.jpeg",
        "name": "liminal 01",
        "tags": [tags.collection_ue, tags.rm_traced],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "33m render time"
        ]
    },
    {
        "img": "img/outside_trace.jpeg",
        "name": "outside 01",
        "tags": [tags.collection_ue, tags.rm_traced],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "46m render time"
        ]
    },
    {
        "img": "img/outside2_trace.jpeg",
        "name": "outside 02",
        "tags": [tags.collection_ue, tags.rm_traced],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "37m render time"
        ]
    },
    {
        "img": "img/outside3_trace.jpeg",
        "name": "outside 03",
        "tags": ["unreal engine", "deferred"],
        "meta": [
            "1m 06s render time"
        ]
    },
    {
        "img": "img/poolhall_trace.jpeg",
        "name": "poolhall 01",
        "tags": [tags.collection_ue, tags.rm_traced],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "29m render time"
        ]
    },
    {
        "img": "img/poolhall2_trace.jpeg",
        "name": "poolhall 02",
        "tags": [tags.collection_ue, tags.rm_traced],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "28m render time"
        ]
    },
    {
        "img": "img/tunnel_trace2.jpeg",
        "name": "tunnel 01",
        "tags": [tags.collection_ue, tags.rm_traced],
        "meta": [
            "512 samples/px",
            "12 max bounces",
            "18m render time"
        ]
    },
    {
        "img": "img/cat5_1.jpeg",
        "name": "catasaki 01",
        "tags": [tags.collection_ue, tags.rm_deferred, tags.collection_cat],
        "meta": [
            "cat 5 act 1 finale: catasaki",
            "first time using advanced particles (mesh renderer)",
            "6000+ concurrent cats"
        ]
    },
    {
        "img": "img/cat5_2.jpeg",
        "name": "catasaki 02",
        "tags": [tags.collection_ue, tags.rm_deferred, tags.collection_cat],
        "meta": [
            "cat 5 act 1 finale: catasaki",
            "first time using procedural content generation (pcg) for the city",
        ]
    },
    {
        "img": "img/cat5_3.jpeg",
        "name": "catasaki 03",
        "tags": [tags.collection_ue, tags.rm_deferred, tags.collection_cat],
        "meta": [
            "cat 5 act 1 finale: catasaki",
            "very advanced material",
            "had fun :)"
        ]
    },
    {
        "img": "img/wrenderer.png",
        "name": "wrenderer test 01",
        "tags": [tags.collection_programming, tags.rm_traced],
        "meta": [
            "custom path tracer",
            "written in c#",
            "raylib (c# binds)",
            "realtime",
            "might make into an engine?"
        ]
    }
]

export { art }