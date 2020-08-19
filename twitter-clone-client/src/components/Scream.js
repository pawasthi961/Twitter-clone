import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from 'prop-types'
import DeleteScream from './DeleteScream'

//MiUi stuff
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment'
import ChatIcon from '@material-ui/icons/Chat'
import DeleteIcon from '@material-ui/icons/Delete';
// Redux
import {connect} from 'react-redux'
import {likeScream,unlikeScream} from '../redux/actions/dataActions'
import MyButton from "../util/MyButton";

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
  likedScream =() =>{
    if(this.props.user.likes && this.props.user.likes.find(like => like.screamId  ===  this.props.scream.screamId)){
      return true;
      
    }else return false;
  }
  likeScream = () => {
    this.props.likeScream(this.props.scream.screamId)
  }
  unlikeScream = () => {
    this.props.unlikeScream(this.props.scream.screamId)
  }
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
      user : {
        authenticated,
        userCredentials : {handle}
      }
    } = this.props;
    const likeButton = !authenticated ? (
      <MyButton tip = 'Like'>
        <Link to = '/login'>
          <FavoriteBorderIcon color = "primary"/>
        </Link>
      </MyButton>
    ):(
      this.likedScream() ? (
        <MyButton tip = "Undo like" onClick = {this.unlikeScream}>
          <FavoriteIcon color="primary"/>
        </MyButton>
      ):(
        <MyButton tip = "Like" onClick = {this.likeScream}>
          <FavoriteBorderIcon color="primary"/>
        </MyButton>
      )
    )
    const deleteButton  = authenticated && userHandle === handle ? (
      <DeleteScream screamId = {screamId}/>
    ):null
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
            deleteButton
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
          {likeButton}
          <span>{likeCount}</span>
          <MyButton tip = "comments">
            <ChatIcon color = "primary"/>
          </MyButton>
        <span>{commentCount}</span>
        </CardActions>
      </Card>
    );
  }

}

Scream.propTypes = {
  likeScream:PropTypes.func.isRequired,
  unlikeScream:PropTypes.func.isRequired,
  user :PropTypes.object.isRequired,
  scream : PropTypes.object.isRequired,
  classes : PropTypes.object.isRequired
}


const mapStateToProps = (state) =>({
  user : state.user,

})

const mapActionsToProps = {
  likeScream,
  unlikeScream
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Scream));
