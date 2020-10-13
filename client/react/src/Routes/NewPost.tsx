import React, { useState } from 'react';
import { RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import "../scss/Write.scss";
import { postCreate } from "../_lib/mutations";
import { postCreateMutationVariables } from "../_lib/mutations/__generated__/postCreateMutation.graphql";

export function NewPost(props: RouteComponentProps) {
    const [state, setState] = useState<postCreateMutationVariables>({
        title: '',
        content: '',
    });

    return (
        <div className="root">
            <div className="return">
                <Link to="/post/:id">←</Link><h3>돌아가기</h3>
            </div>
            <div className="write-container">
                <div className="box write-title">
                    <input className="write-input" type="text" name="title" placeholder="고민의 제목을 달아주세요"
                        value={state.title}
                        onChange={({ target }) => {
                            setState({ content: state.content, title: target.value });
                        }}

                    />
                </div>
                <div className="box write-text">
                    <textarea placeholder="고민 내용을 입력하세용" name="content"
                        value={state.content}
                        onChange={({ target }) => {
                            setState({ ...state, content: target.value });
                        }}>
                    </textarea>
                </div>
                {/* TODO : tag 추가 mutation */}
                <div className="box write-tags">
                    <input className="write-input" type="text" name="tags" placeholder="고민의 태그를 달아보세요 #군대 #가족 #애인" />
                </div>
                {/* TODO : postCreate 시 form validation & relay - RANGE_ADD */}
                <input className="write-btn" type="submit" value="고민 게시하기" onClick={() => {
                    postCreate({ ...state });
                    props.history.push("/"); // TODO : push "/posts"
                }}
                />
            </div>
        </div>
    );
}