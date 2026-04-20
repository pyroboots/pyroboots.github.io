import { 
    init, 
    End, 
    addSpecs, 
    Description, 
    Container, 
    Label, 
    Tag, 
    Button, 
    Tabs, 
    Tab 
} from "/lib/ui.js";
import { addArt, addLogs } from "/src/content.js";
import { fetchPinnedRepos } from "./repos.js";

init();

Description("[ amateur 3d artist ] [ half-assed software engineer ] [ avid science nerd ]");
End();

Container("skills-container");
    Tag("c#"); Tag("lua"); Tag("js"); Tag("unreal engine");
End();

Container("links");
    Button("github", "https://github.com/pyroboots");
    Button("youtube", "https://youtube.com/@pyroboots");
End();

Tabs(["repos", { label: "ue_gallery", id: "gallery" }, { label: "nanolog", id: "blog" }, "specs"]);

Tab("repos", "pinned-repos-container");
    Label("loading projects...");
    fetchPinnedRepos();
End();

Tab("gallery");
    addArt();    
End();

Tab("blog");
    addLogs();
End();

Tab("specs");
    Container("specs-cont");
        Label("[pyro@boots ~]$ pyrofetch | pyroboots.vercel.app/specs/");
        addSpecs({
            os: "EndeavourOS Linux",
            kernel: "6.19.6-arch1-1",
            shell: "bash 5.3.9",
            de: "Hyprland",
            wm: "ambxst",
            terminal: "kitten",
            cpu: "Intel i7-4790K (8) @ 4.400GHz",
            gpu: "NVIDIA GeForce RTX 2080 Rev. A",
            memory: "16gb ddr4",
            "": "",
            entropy: "increasing",
            sleep: "decreasing"
        });
    End();
End();