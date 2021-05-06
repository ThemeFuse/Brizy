import { LibsPro } from "visual/libs";

export default function($node) {
  const { Lottie } = LibsPro;

  if (!Lottie) {
    return;
  }

  const node = $node.get(0);
  node.querySelectorAll(".brz-lottie-anim").forEach(node => {
    const animationLink = node.getAttribute("data-animate-name");
    const loop = node.getAttribute("data-anim-loop");
    const speed = node.getAttribute("data-anim-speed");
    const autoplay = node.getAttribute("data-anim-autoplay");
    const direction = node.getAttribute("data-anim-direction");

    const animation = Lottie.loadAnimation({
      container: node,
      renderer: "svg",
      loop: loop === "on",
      autoplay: autoplay === "on",
      path: animationLink
    });
    animation.setSpeed(speed);
    animation.setDirection(direction);
  });
}
