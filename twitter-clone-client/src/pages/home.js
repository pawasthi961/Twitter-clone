import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'

import Proptypes from 'prop-types'

import Scream from '../components/Scream'
import Profile from '../components/Profile'

import {connect} from 'react-redux'
import {getScreams} from '../redux/actions/dataActions'

export class home extends Component {
    
    
    componentDidMount(){
        this.props.getScreams();
    }

    render() {
        const {screams , loading} =  this.props.data
        let recentScreamsMarkup =  !loading ? (
        screams.map((scream) => <Scream Key={scream.screamId} scream={scream}/>)
        ) : (<p>loading....</p>
        );
        return (
            <div>
                <Grid container spacing = {10}>
                    <Grid item sm={8} xs={12}>
                        {recentScreamsMarkup}
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        <Profile />
                    </Grid>

                </Grid>
            </div>
        )
    }
}
home.propTypes = {
    getScreams : Proptypes.func.isRequired,
    data : Proptypes.object.isRequired
}


const mapStateToProps = (state) => ({
    data: state.data
})


export default connect(mapStateToProps, {getScreams})(home)
