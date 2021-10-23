import { React, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import * as actionCreators from '../stores/creators/actionCreators';

function Post(props) {
  const userID = localStorage.getItem('userID');
  const [singlePost, setSinglePost] = useState({});
  const [commentBtnToggle, setCommentBtnToggle] = useState(0);
  const [isToggle, setIsToggle] = useState(false);
  const [comment, setComment] = useState({});
  const [allComments, setAllComments] = useState([]);

  const handlePostInput = (e) => {
    setSinglePost({
      userID: userID,
      spaceID: props.spaceID,
      bodyText: e.target.value
    });
  };

  const handleSaveSinglePost = () => {
    actionCreators.onPost(singlePost, props.setPosts);
    setSinglePost({
      userID: '',
      spaceID: '',
      bodyText: ''
    });
  };

  const handleCommentToggle = (e) => {
    setCommentBtnToggle(e.target.name);
    actionCreators.displayAllComments(e.target.name, setAllComments);
    !isToggle ? setIsToggle(true) : setIsToggle(false);
  };

  const handleCommentInput = (e) => {
    setComment({
      userID: userID,
      postID: e.target.name,
      bodyText: e.target.value,
      spaceID: props.spaceID
    });
  };

  const handleSaveComment = () => {
    actionCreators.saveAndDisplayComments(comment, setAllComments, props.setPosts);
    setComment({
      userID: '',
      postID: '',
      bodyText: '',
      spaceID: ''
    });
  };
  
  const comments = allComments.map((comment) => {
    return (
      <div className="comment">
        <span className="commentAuthor">
          {comment.first_name} {comment.last_name[0]} :{' '}
        </span>
        <p className="commentText">{comment.body_text}</p>
      </div>
    );
  });
  
  const posts = props.posts.map((post) => {
    return (
      <div className="post">
        <div className="postContent">
          <span className="postAuthor">
            {post.first_name} {post.last_name[0]}.
          </span>
          <span className="postText">{post.body_text}</span>
          <div className="socialBtns">
            <button
              className="likeBtn"
              onClick={() => actionCreators.incrementLike(post.post_id, props.spaceID, props.setPosts)}
            >
              <Icon name="heart" color="red" />({post.like})
            </button>
            <button
              className="commentBtn"
              name={post.post_id}
              onClick={handleCommentToggle}
            >
              <Icon name="comment outline" color="blue" />({post.comment})
            </button>
          </div>
        </div>
        {isToggle && commentBtnToggle === post.post_id.toString() ? (
          <div className="commentSection">
            <div id="commentWrapper">
              {comments}
              <div id="commentSubmit">
                <textarea
                  wrap="soft"
                  id="commentInput"
                  type="text"
                  name={post.post_id}
                  placeholder="Comment Here"
                  value={comment.bodyText}
                  onChange={handleCommentInput}
                  onKeyPress={(event) => {
                    event.key === 'Enter' && handleSaveComment();
                  }}
                ></textarea>
                <button id="commentBtn" onClick={handleSaveComment}>
                  Comment
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  });

  return (
    <section id="postComponent">
      <div id="posts">{posts}</div>
      <div id="createPostSection">
        <textarea
          wrap="soft"
          id="postInput"
          value={singlePost.bodyText}
          type="text"
          placeholder="Type post here"
          onChange={handlePostInput}
          onKeyPress={(event) => {
            event.key === 'Enter' && handleSaveSinglePost();
          }}
        ></textarea>
        <button id="submitPostBtn" onClick={handleSaveSinglePost}>
          Post
        </button>
      </div>
    </section>
  );
}

export default Post;
