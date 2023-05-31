import React, { ReactElement, useEffect, useRef } from "react";
import { Props } from "../types";

export const Circle2 = ({ className, onClick, style }: Props): ReactElement => {
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    if (scriptRef && scriptRef.current) {
      scriptRef.current.innerHTML = `!function(){function t(t){this.element=t,this.animationId,this.start=null,this.init()}if(!window.requestAnimationFrame){var i=null;window.requestAnimationFrame=function(t,n){var e=(new Date).getTime();i||(i=e);var a=Math.max(0,16-(e-i)),o=window.setTimeout(function(){t(e+a)},a);return i=e+a,o}}t.prototype.init=function(){var t=this;this.animationId=window.requestAnimationFrame(t.triggerAnimation.bind(t))},t.prototype.reset=function(){var t=this;window.cancelAnimationFrame(t.animationId)},t.prototype.triggerAnimation=function(t){var i=this;this.start||(this.start=t);var n=t-this.start;504&gt;n||(this.start=this.start+504),this.element.setAttribute("transform","rotate("+Math.min(n/1.4,360)+" 8 8)");if(document.documentElement.contains(this.element))window.requestAnimationFrame(i.triggerAnimation.bind(i))};var n=document.getElementsByClassName("nc-loop_circle-02-16"),e=[];if(n)for(var a=0;n.length&gt;a;a++)!function(i){e.push(new t(n[i]))}(a);document.addEventListener("visibilitychange",function(){"hidden"==document.visibilityState?e.forEach(function(t){t.reset()}):e.forEach(function(t){t.init()})})}();`;
    }
  }, []);

  return (
    <svg
      className={className}
      style={style}
      onClick={onClick}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
    >
      <g>
        <g
          className="nc-loop_circle-02-16"
          transform="rotate(359.71071426823204 8 8)"
        >
          <path
            opacity="0.4"
            fill="currentColor"
            d="M8,16c-4.4111328,0-8-3.5888672-8-8s3.5888672-8,8-8s8,3.5888672,8,8S12.4111328,16,8,16z M8,2C4.6914062,2,2,4.6914062,2,8s2.6914062,6,6,6s6-2.6914062,6-6S11.3085938,2,8,2z"
          ></path>
          <path
            data-color="color-2"
            d="M16,8h-2c0-3.3085938-2.6914062-6-6-6V0C12.4111328,0,16,3.5888672,16,8z"
          ></path>
        </g>
        <script ref={scriptRef}></script>
      </g>
    </svg>
  );
};
