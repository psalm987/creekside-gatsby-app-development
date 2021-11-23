import React from "react";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ParallaxSlide from "@mui-treasury/components/slide/parallax";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const adslist = [
  {
    xs: "/ads/Experience/400.png",
    md: "/ads/Experience/600.png",
    lg: "/ads/Experience/800.png",
    xl: "/ads/Experience/1000.png",
  },
  {
    xs: "/ads/Tracking/400.png",
    md: "/ads/Tracking/600.png",
    lg: "/ads/Tracking/800.png",
    xl: "/ads/Tracking/1000.png",
  },
];

const adsLengthIndex = adslist.length - 1;

const AdItem = ({ xs, md, lg, xl, link }) => {
  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const lgDown = useMediaQuery(theme.breakpoints.down("lg"));

  const Clicker = link ? CardActionArea : Box;

  return (
    <Card elevation={2} sx={{ mr: 1 }}>
      <Clicker component={link && "a"} href={link}>
        <CardMedia
          component="img"
          height={300}
          image={(xsDown && xs) || (mdDown && md) || (lgDown && lg) || xl}
          alt="Ads Image"
        />
      </Clicker>
    </Card>
  );
};

const renderChildren = ({ injectStyle, fineIndex }) =>
  adslist.map((props, i) => <AdItem key={i} {...props} />);

const RenderElements = ({ index, onChangeIndex }) => {
  React.useEffect(() => {
    const timer = setInterval(() => {
      onChangeIndex((prevIndex) =>
        prevIndex >= adsLengthIndex ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, [onChangeIndex]);
  return (
    <>
      <IconButton
        sx={{
          display: index === 0 ? "none" : "block",
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
        }}
        onClick={() => onChangeIndex(index - 1)}
        disabled={index === 0}
      >
        <ArrowLeftIcon />
      </IconButton>
      <IconButton
        sx={{
          display: index === adsLengthIndex ? "none" : "block",
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
        }}
        onClick={() => onChangeIndex(index + 1)}
        disabled={index === adsLengthIndex}
      >
        <ArrowRightIcon />
      </IconButton>
    </>
  );
};

const Ads = () => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <ParallaxSlide
        {...{ renderElements: RenderElements, children: renderChildren }}
      />
    </div>
  );
};

export default Ads;
