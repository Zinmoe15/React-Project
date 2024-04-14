import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import LoginForm from "./LoginForm";
import { checkPassword, nullChk, numberChk, validatePwd } from "../common/CommonValidation";
import Loading from "../common/Loading";
import {ApiRequest} from "../common/ApiRequest";
import $ from "jquery";
import { CCard, CCardBody, CCardHeader, CCol, CInput, CRow } from "@coreui/react";

const LoginIndex = () => {

  useEffect(() => {
    $(window).resize(function(){
        setZoomSize(Math.round(window.devicePixelRatio * 100));
    });
}, []);

    const history = useHistory();
    const [loading, setLoading] = useState(false); // For Loading
    const [success, setSuccess] = useState([]); // for success message
    const [error, setError] = useState([]); // for error message
    const [userCode, setUserCode] = useState(""); // for shop code
    const [password, setPassword] = useState(""); // for password
    const [zoomSize, setZoomSize] = useState(
      Math.round(window.devicePixelRatio * 100)
    );

    const passwordChange = (e) => {
        setSuccess([]);
        setError([]);
        setPassword(e.target.value);
    }

    const userCodeChange = (e) => {
        setSuccess([]);
        setError([]);
      setUserCode(e.target.value);
    }

    const loginClick = async() => {
         let errMsg = [];
        setLoading(true);
        if(!nullChk(userCode)){
          errMsg.push("Please fill userCode");
        }else if (!numberChk(userCode)){
          errMsg.push("Please fill number only in  Your usercode");
        }

        if(!nullChk(password)){
          errMsg.push("Please fill password");
        }else if (!checkPassword(password)){
          errMsg.push("Please fill strong password in Your Password");
        }

        if(errMsg.length > 0) {
          setSuccess([]);
          setError(errMsg);
          setLoading(false);
        }else{
          setError([]);
          let loginData = {
            method: "get",
            url: `admin/login`,
            params: {
            user_code : userCode,
            password : password
            },
          };
          let response = await ApiRequest(loginData);
          if (response.flag === false) {
            setError(response.message);
            setSuccess([]);
          } else {
            if (response.data.status == "OK") {
              history.push(`/Dashboard`)
              localStorage.setItem(`LoginProcess`, "true");
              setError([]);
            } else {
              setError([response.data.message]);
              setSuccess([]);
            }
          }
          setLoading(false);
        }
       
    }
    return(
        <>
        {zoomSize < 150 &&(
          <div>
        <LoginForm
        loginClick={loginClick}
        passwordChange={passwordChange}
        password={password}
        userCodeChange={userCodeChange}
        userCode={userCode}
        success={success}
        error={error}
        />
        <Loading start={loading} />
        </div>
        )}

        {zoomSize >149 &&(
          <div>
          <CCard style={{backgroundColor:"black"}}> 
          <CCardHeader>
            <h1 className="text-center">Login Form</h1>
          </CCardHeader>
          <CCardBody style={{textAlign:"center", marginTop:"20px"}}>
            <CRow className="mt-4">
              <CCol lg="1"></CCol>
              <CCol lg="3">UserCode</CCol>
              <CCol lg="7">
                <CInput value={userCode} onChange={userCodeChange} />
              </CCol>
              <CCol lg="1"></CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol lg="1"></CCol>
              <CCol lg="3">PassWord</CCol>
              <CCol lg="7">
                <CInput value={password} onChange={passwordChange} />
              </CCol>
              <CCol lg="1"></CCol>
            </CRow>
          </CCardBody>
          </CCard>
          <Loading start={loading} />
          </div>
        )}
        </>
    )
}

export default LoginIndex
