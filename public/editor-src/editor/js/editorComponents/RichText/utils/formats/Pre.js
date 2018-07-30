import Quill from "quill";

let Block = Quill.import("blots/block");

class Pre extends Block {}

Pre.blotName = "pre";
Pre.tagName = "pre";

export default Pre;
