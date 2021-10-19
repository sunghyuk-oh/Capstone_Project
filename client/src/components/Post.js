import { React, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import * as actionCreators from '../stores/creators/actionCreators'

function Post(props) {
    const userID = localStorage.getItem('userID')
    const [singlePost, setSinglePost] = useState([])
    const [commentBtnToggle, setCommentBtnToggle] = useState(0)
    const [isToggle, setIsToggle] = useState(false)
    const [comment, setComment] = useState({})
    const [allComments, setAllComments] = useState([])

    useEffect(() => {
        props.onDisplayAllPosts(props.spaceID)
    }, [props.allPosts])

    const handlePostInput = (e) => {
        setSinglePost({userID: userID, spaceID: props.spaceID, bodyText: e.target.value})
    }

    const handleSaveSinglePost = () => {
        actionCreators.onPost(singlePost)
        setSinglePost([])
    }

    const handleCommentToggle = (e) => {
        setCommentBtnToggle(e.target.name)
        actionCreators.displayAllComments(e.target.name, setAllComments)
        !isToggle ? setIsToggle(true) : setIsToggle(false)
    }

    const handleCommentInput = (e) => {
        setComment({userID: userID, postID: e.target.name, bodyText: e.target.value})
    }

    const handleSaveComment = () => {
        
        actionCreators.saveAndDisplayComments(comment, setAllComments)
        setComment({})
        
        console.log(allComments)
    }

    const comments = allComments.map(comment => {
        return (
            <div>
                <p><b>{comment.first_name} {comment.last_name[0]}. ({comment.username}): </b> {comment.body_text}</p>
            </div>
        )
    })

    const posts = props.allPosts.map(post => {
        return (
            <div className="">
                <h4>{post.first_name} {post.last_name[0]}. ({post.username})</h4>
                <span>{post.body_text}</span>
                <button onClick={() => actionCreators.incrementLike(post.post_id)}><Icon name='heart' color="red" />Like</button>
                <button name={post.post_id} onClick={handleCommentToggle}><Icon name='comment outline' color="blue" />Comment</button> 
                {
                    isToggle && commentBtnToggle === post.post_id.toString() ? 
                    <div className="">
                        {comments}
                        <input type="text" name={post.post_id} placeholder="Comment Here" onChange={handleCommentInput} />
                        <button onClick={handleSaveComment}>Comment</button>
                    </div> 
                    : null
                }
            </div>
        )
    })

    return (
        <section className="">
            <div className="">
                {posts}
            </div>
            <div className="">
                <input type="text" placeholder="Type post here" onChange={handlePostInput} />
                <button onClick={handleSaveSinglePost}>Post</button>
            </div>
        </section>
    )
}

const mapStateToProps = (state) => {
    return {
        allPosts: state.posts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDisplayAllPosts: (spaceID) => dispatch(actionCreators.displayAllPosts(spaceID))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)