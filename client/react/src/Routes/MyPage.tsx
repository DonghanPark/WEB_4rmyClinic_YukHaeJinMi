import React, { createRef } from 'react';
import { RouteComponentProps } from "react-router";
import { AuthContext } from "../Components/AuthContextProvider";
import { UploadImg } from "../_lib/imageclient";
import '../scss/Mypage.scss';
import { userProfileImgSet } from "../_lib/mutations/userProfileImgSet";
import { ProfileIcon } from "../Components/ProfileIcon";

type MyPageState = {
  img?: File;
  imgPreviewUri?: string,
  showUploadButton?: boolean,
}
export class MyPage extends React.Component<RouteComponentProps, MyPageState> {
  private inputRef = createRef<HTMLInputElement>();
  private uploadRef = createRef<HTMLDivElement>();

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {};
  }

  handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files && e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        img: file as File,
        imgPreviewUri: reader.result as string
      })
    }
    reader.readAsDataURL(file as File);
    this.setState({ showUploadButton: true });
  }

  onSubmit = async (id: string, authChangeProfileImg?: (imgUri: string) => void) => {
    const json = this.state.img && await UploadImg(this.state.img);
    if (json?.uploaded) {
      await userProfileImgSet({ imgUri: json.imgUri }, id);
      authChangeProfileImg && authChangeProfileImg(json.imgUri);
      this.props.history.goBack();
    }
  }

  render() {
    return (
      <AuthContext.Consumer>
        {({ viewer, changeProfileImg }) =>
          viewer && <div>
            <div className="mypage-root">
              <div className="upload-button" ref={this.uploadRef} onClick={() => this.onSubmit(viewer.id!, changeProfileImg)} style={{ display: this.state.showUploadButton ? "block" : "none" }}>
                수정
              </div>
              <div className="profile-container">
                <div className="imgbox" onClick={() => this.inputRef.current?.click()}>
                  {this.state.imgPreviewUri
                    ? <ProfileIcon imgUri={this.state.imgPreviewUri} size={50} borderRadius={12} />
                    : <ProfileIcon imgUri={viewer.imgUri} size={50} borderRadius={12} />}
                  <input type="file" ref={this.inputRef} onChange={(e) => this.handleChangeImg(e)} style={{ display: "none" }} />
                </div>
                <div className="myinfo">
                  <div className="nickname">{viewer.nickname}</div>
                  <div className="bio">{viewer.bio}</div>
                </div>
              </div>
              <div className="mypage-container">

                <div className="sidebar">
                  <div className="title"><p>회원정보</p></div>
                  <div className="title"><p>상담내역</p></div>
                  <div className="title"><p>내가 쓴 글</p></div>
                </div>

                <div className="showbox"></div>
              </div>
            </div>
          </div>
        }
      </AuthContext.Consumer>
    )
  }
}