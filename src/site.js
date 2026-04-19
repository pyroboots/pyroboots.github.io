import { 
    init, 
    End, 
    Header, 
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

Description("amateur 3d artist | half-assed software engineer | avid science nerd");
End();

Container("skills-container");
    Tag("c#"); Tag("lua"); Tag("js"); Tag("unreal engine");
End();

Container("links");
    Button("github", "https://github.com/pyroboots");
    Button("youtube", "https://youtube.com/@pyroboots");
End();

Tabs(["repos", "gallery", { label: "nanolog", id: "blog" }]);

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