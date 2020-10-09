import { commitMutation, graphql } from "react-relay"
import environment from "../../environment";
import { authUserMutation, authUserMutationVariables } from "./__generated__/authUserMutation.graphql";

const mutation = graphql`
mutation authUserMutation($email: String!, $password: String!) {
  tokenAuth(input: {email: $email, password: $password}) {
    token
    refreshToken
    refreshExpiresIn
    payload
  }
}`;

export function authUser(variables: authUserMutationVariables) {
  return new Promise((resolve, reject) => {
    commitMutation<authUserMutation>(
      environment, {
      mutation,
      variables,
      onCompleted: (res, err) => {
        if (err) {
          reject();
        } else {
          console.log("payload : ", res.tokenAuth?.payload);
          resolve(res.tokenAuth?.payload);
        }
      },
      onError: (err) => { console.error(err); reject() },
    }
    );
  });
}