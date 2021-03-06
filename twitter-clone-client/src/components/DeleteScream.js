import React, { Component , Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import PropTypes from 'prop-types'
import MyButton from '../util/MyButton'

//MUi stuff

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteOutline from '@material-ui/icons/DeleteOutline'

import {connect} from 'react-redux'
import {deleteScream} from '../redux/actions/dataActions'



class DeleteScream extends Component {
    state ={
        open: false,

    }
    handleOpen = () =>{
        this.setState({
            open:true
        })
    }
    handleClose = () => {
        this.setState({
            open : false
        })
    }
    deleteScream = () =>{
        this.props.deleteScream(this.props.screamId);
        this.setState({open : false})
    }
    render() {
        

        return (
            <Fragment>
                <MyButton tip ="Delete Scream"
                onClick = {this.handleOpen}
                >
                    <DeleteOutline color ="secondary"/>
                </MyButton>
                <Dialog 
                    open={this.state.open}
                    onClose = {this.handleClose}
                    fullWidth
                    maxWidth = "sm">
                        <DialogTitle>
                            Are you sure you want to delete this Scream ?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick = {this.handleClose} color = "primary">
                                Cancel
                            </Button>
                            <Button onClick = {this.deleteScream} color = "secondary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
            </Fragment>
        )
    }
}


DeleteScream.propTypes = {
    deleteScream : PropTypes.func.isRequired,
    screamId : PropTypes.string.isRequired

}


export default connect(null, {deleteScream})(DeleteScream)
