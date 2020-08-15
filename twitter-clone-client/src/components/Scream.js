import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 75,
    minHeight: 75,
  },
  content: {
    padding: 25,
    ObjectFit: "cover",
  },
  root: {
    minWidth: 345,
    marginBottom: 20,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
};

class Scream extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount,
      },
    } = this.props;
    console.log({ userHandle });
    console.log({ userImage });
    // const classes = this.props.classes;
    return (
      //   <Card className = {classes.card}>
      //     <CardMedia image={userImage} title="Profile image"
      //     className = {classes.image} />
      //     <CardContent className =  {classes.content}>
      //       <Typography variant="h5" component = {Link} to={`/users/${userHandle}`}
      //   color = "primary">{userHandle}</Typography>
      //       <Typography variant="body2" color="textSecondary">
      //         {dayjs(createdAt).fromNow()}
      //       </Typography>
      //       <Typography variant="body1">{body}</Typography>
      //     </CardContent>
      //   </Card>
      <Card className={classes.root}>
        <CardHeader
          avatar={<Avatar alt="Remy Sharp" src={userImage} />}
          action={
            <IconButton aria-label="settings" color="inherit">
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Typography
              variant="h5"
              color="primary"
              component={Link}
              to={`/users/${userHandle}`}
            >
              {userHandle}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).fromNow()}
            </Typography>
          }
        />

        <CardContent>
          <Typography variant="body1" color="inherit" component="p">
            {body}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
          <FavoriteBorderIcon />
        </IconButton>
          <IconButton aria-label="share"><ShareIcon /></IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(Scream);
