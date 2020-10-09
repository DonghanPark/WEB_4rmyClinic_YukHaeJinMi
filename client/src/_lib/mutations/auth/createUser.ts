import { commitMutation, graphql } from "react-relay"
import environment from "../../environment";
import { createUserMutation } from "./__generated__/createUserMutation.graphql";

const mutation = graphql`
mutation createUserMutation($email: String!, $password: String!, $passwordRepeat: String!, $division: String!, $rank: String!) {
  createUser(input: {email: $email, password: $password, passwordRepeat: $passwordRepeat, division: $division, rank: $rank}) {
    ok
  }
}`;

type createUserInput = {
  email: string;
  password: string;
  passwordRepeat: string;
  division: string;
  rank: string;
}
export function createUser(input: createUserInput) {
  const variables = { ...input };
  return new Promise<boolean>((resolve, reject) => {
    commitMutation<createUserMutation>(
      environment, {
      mutation,
      variables,
      onCompleted: (res, err) => {
        if (err) {
          resolve(false);
        } else {
          console.log("ok : ", res.createUser?.ok); // TODO : token save
          resolve(true);
        }
      },
      onError: (err) => { console.error(err); reject(false) },
    }
    );
  });
}