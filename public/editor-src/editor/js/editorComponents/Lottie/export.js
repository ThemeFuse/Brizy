import { getProLibs } from "visual/libs";

export default function($node) {
  const { Lottie } = getProLibs();

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
    const renderer = node.getAttribute("data-render-type");

    const animation = Lottie.loadAnimation({
      container: node,
      loop: loop === "on",
      autoplay: autoplay === "on",
      path: animationLink,
      renderer,
      rendererSettings: {
        preserveAspectRatio:
          renderer === "svg" ? "xMidYMid slice" : "xMidYMid meet"
      }
    });
    animation.setSpeed(speed);
    animation.setDirection(direction);
  });
}
