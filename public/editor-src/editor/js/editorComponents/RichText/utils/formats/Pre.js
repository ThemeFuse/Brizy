import Quill from "quill";

const Block = Quill.import("blots/block");

class Pre extends Block {}

Pre.blotName = "pre";
Pre.tagName = "pre";

export default Pre;
