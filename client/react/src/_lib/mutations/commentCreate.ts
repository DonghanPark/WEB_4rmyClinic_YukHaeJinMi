import { commitMutation, DeclarativeMutationConfig, graphql } from "react-relay"
import environment from "../environment";
import { commentCreateMutation, commentCreateMutationVariables } from "./__generated__/commentCreateMutation.graphql";

const mutation = graphql`
mutation commentCreateMutation($postId: String!, $content: String!) {
  commentCreate(input: {postId: $postId, content: $content}) {
    commentEdge {
      node {
        viewerCanEditComment
        id
        user {
          nickname
        }
        content
        created
      }
    }
  }
}`;


export function commentCreate(variables: commentCreateMutationVariables) {
  const configs: DeclarativeMutationConfig[] = [{
    type: 'RANGE_ADD',
    parentID: variables.postId,
    edgeName: 'commentEdge',
    connectionInfo: [{
      key: 'CommentsContainer_commentSet',
      rangeBehavior: 'prepend'
    }]
  }];

  return new Promise<boolean>((resolve, reject) => {
    commitMutation<commentCreateMutation>(
      environment, {
      mutation,
      variables,
      configs,
      onCompleted: (res, err) => {
        if (err) {
          alert("댓글 작성 중 오류가 발생했습니다.");
          reject();
        } else {
          console.log("commentCreated ID : ", res.commentCreate?.commentEdge?.node?.id);
          resolve(true);
        }
      },
      onError: (err) => { console.error(err); reject(false) },
    }
    );
  });
}