import React, { useState } from 'react';
import { RouteComponentProps, useHistory } from "react-router";
import { QueryRenderer, graphql } from "react-relay";
import environment from "../_lib/environment";
import { Link } from 'react-router-dom';
import { AuthContext } from "../Components/AuthContextProvider";
import { PostQuery } from "./__generated__/PostQuery.graphql";
import "../scss/Post.scss";
import { likeToggle } from "../_lib/mutations/likeToggle";
import CommentsContainer from "../Components/CommentsContainer";
import { commentCreate } from "../_lib/mutations/commentCreate";
import { postDelete } from "../_lib/mutations/postDelete";
import { ProfileIcon } from "../Components/ProfileIcon";

type postParams = {
  id: string,
}

type commentParams = {
  content: string,
}

export function Post(props: RouteComponentProps<postParams>) {
  const postId = props.match.params.id;
  const history = useHistory();

  const [state, setState] = useState<commentParams>({
    content: '',
  });
  return (
    <AuthContext.Consumer>
      {({ viewer, }) =>
        <QueryRenderer<PostQuery>
          environment={environment}
          variables={{ id: postId }}
          query={graphql`
                query PostQuery($id: ID!) {
                  post(id: $id) {
                    title
                    content
                    likes
                    viewerAlreadyLiked
                    viewerCanEditPost
                    id
                    author: user {
                      nickname
                      imgUri
                    }
                    
                    ...CommentsContainer_comments

                    tagSet(first: 5) {
                      edges {
                        cursor
                        tag: node {
                          name
                        }
                      }
                    }
                  }
                }
                `}
          render={({ props, error, retry }) => {
            const tags = props?.post?.tagSet?.edges;
            const viewerCanEditPost = props?.post?.viewerCanEditPost;
            return (
              <div className="Post-root">
                <div className="return-btn">
                  <Link to="/posts">←</Link><h3>돌아가기</h3>
                </div>

                <div className="Post-content">
                  <div className="top">
                    <div className="tags">
                      {tags && tags.map((e) =>
                        <p key={e?.cursor}>#{e?.tag?.name}</p>
                      )}
                    </div>
                    {viewerCanEditPost &&
                      <div className="">
                        <button className="authbutton" onClick={() => history.push(`/updatepost/${postId}`)}>수정</button>
                        <button className="authbutton" onClick={() => { postDelete({ postId }); history.push('/posts'); }}>X</button>
                      </div>
                    }
                  </div>
                  <div className="body">
                    <h1>{props?.post?.title}</h1>
                    <p className="body-text">내용 : {props?.post?.content}</p>
                  </div>
                  <div className="foot">
                    <div className="indicator">
                      <p className="heart" onClick={() => { viewer && likeToggle({ postId }) }}>{props?.post?.viewerAlreadyLiked ? "♥" : "♡"}</p>
                      <p className="number">{props?.post?.likes}</p>
                    </div>
                    <div className="writer">
                      <ProfileIcon imgUri={props?.post?.author.imgUri} size={24} borderRadius={12} />
                      <p>{props?.post?.author.nickname}</p>
                    </div>
                  </div>
                </div>

                <div className="Post-underbox">
                  <div className="comment-container"> {/*pagination*/}
                    {viewer &&
                      <div className="input">
                        <textarea className="comment-input" value={state.content}
                          onChange={({ target }) => {
                            setState({ content: target.value })
                          }}
                        />
                        <button onClick={() => {
                          commentCreate({ postId, ...state });
                          setState({ content: "" });
                        }}>작성</button>
                      </div>
                    }
                    <hr />
                    {props?.post && <CommentsContainer comments={props.post} />}
                  </div>

                </div>
              </div>
            );
          }
          }
        />
      }
    </AuthContext.Consumer>
  );
}