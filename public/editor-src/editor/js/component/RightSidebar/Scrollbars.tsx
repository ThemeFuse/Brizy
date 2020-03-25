import React from "react";
import CustomScrollbars from "react-custom-scrollbars";

const ScrollbarThumb: React.FC<{ style: React.CSSProperties }> = ({
  style
}) => {
  return (
    <div
      style={{
        ...style,
        borderRadius: "inherit",
        backgroundColor: "#3f4652"
      }}
    />
  );
};

export const Scrollbars: React.FC = ({ children }) => {
  return (
    <CustomScrollbars
      renderThumbHorizontal={ScrollbarThumb}
      renderThumbVertical={ScrollbarThumb}
    >
      {children}
    </CustomScrollbars>
  );
};
