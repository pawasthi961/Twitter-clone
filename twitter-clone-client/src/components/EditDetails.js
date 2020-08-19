import React, { Component , Fragment} from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import {editUserDetails} from '../redux/actions/userActions'
import {connect} from 'react-redux'
import MyButton from '../util/MyButton'


// MUI stuff
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

import DialogTitle from '@material-ui/core/DialogTitle'
import ToolTip from '@material-ui/core/ToolTip'
import IconButton from '@material-ui/core/IconButton'

// Icons 

import EditIcon from '@material-ui/icons/Edit'


const styles = {
    form :{
        textAlign : 'center'
    },
    pageTitle:{
        margin:'10px auto 10px auto'
    },
    textField : {
        margin: '10px auto 10px auto'
    },
    button:{
        marginTop : 20,
        position : 'relative',
        float : "right"
    },
    customError:{
        color: 'red',
        fontSize : '0.8rem',
        marginTop : 10
    },
    progress:{
        position : 'absolute'
    }
}

class EditDetails extends Component {
    state = {
        bio: '',
        website : '',
        location : '',
        open : false

    };
    mapUserDetailsToState = (userCredentials) =>{
        this.setState({
            bio : userCredentials.bio ? userCredentials.bio : '',
            location : userCredentials.location ?userCredentials.location : '',
            website : userCredentials.website ? userCredentials.website : ''
        })
    }
    handleOpen= () =>{
        this.setState(
            {open : true}
        )
        this.mapUserDetailsToState(this.props.userCredentials)

    }
    handleClose= () =>{
        this.setState({open: false})
        this.mapUserDetailsToState(this.props.userCredentials)
    }
    componentDidMount(){
        const {userCredentials} =  this.props
        this.mapUserDetailsToState(userCredentials)
       
    }
    
    handleChange = (event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    handleSubmit = () =>{
        const userDetails = {
            bio : this.state.bio,
            website : this.state.website,
            location : this.state.location
        }
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }
    render() {
        const {classes} = this.props
        
        return (
            <Fragment>
                
                <MyButton tip = "Edit details" placement = "top" btnClassName = {classes.button} onClick = {this.handleOpen}>
                    <EditIcon color = "primary" />
                </MyButton>   
                <Dialog
                open = {this.state.open}
                onClose = {this.handleClose}
                fullWidth
                maxWidth="sm">
                    <DialogTitle> Edit your details</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField name="bio" type = "text" label = "Bio" multiline
                                rows = "3"
                                placeholder = "A short bio about yourself"
                                className = {classes.textField}
                                value = {this.state.bio}
                                onChange = {this.handleChange}
                                fullWidth />
                                <TextField name="website" type = "text" label = "Website" 
                                
                                placeholder = "Your personal/professional website"
                                className = {classes.textField}
                                value = {this.state.website}
                                onChange = {this.handleChange}
                                fullWidth />
                                <TextField name="location" type = "text" label = "Location" 
                                
                                placeholder = "Your Location"
                                className = {classes.textField}
                                value = {this.state.location}
                                onChange = {this.handleChange}
                                fullWidth />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick = {this.handleClose} color = "primary">
                                Cancel
                            </Button>
                            <Button onClick = {this.handleSubmit} color = "primary">
                                Save
                            </Button>

                        </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps =(state) =>({
    userCredentials : state.user.userCredentials
})

export default connect(mapStateToProps,{editUserDetails})(withStyles(styles)(EditDetails))