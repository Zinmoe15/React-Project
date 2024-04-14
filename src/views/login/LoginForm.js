import { CButton, CCard, CCardBody, CCol, CImg, CInput, CInputGroup, CInputGroupPrepend, CInputGroupText, CLabel, CRow } from '@coreui/react';
import React from 'react'
import SuccessError from '../common/SuccessError';

const LoginForm = (props) => {
    let {loginClick,passwordChange,password,userCodeChange,userCode,success,error} = props;

  const keyEnter = (e)=>{
    if (e.key == "Enter"){
      loginClick();
      e.preventDefault();
    }
  }

  return (
  <>
    <div
      className="min-vh-100  flex-row align-items-center login-bg"
    >
    <CRow>
  <CCol lg="3"></CCol>
<CCol lg="6">
<CCard className="login" style={{marginTop:"100px"}}
               >
                <CCardBody>
               
                  <CRow alignHorizontal='center'>
                  <CImg src='./image/p1.jpg' width={120} height={120}></CImg>
                  </CRow>
                  <CRow alignHorizontal='center' className="mb-3">
                    <h3 className='login-title'>Registration System</h3>
                  </CRow>
                  <SuccessError success={success} error={error} />
                  <CRow className="mt-4 align-items-center">
                    <CCol lg="4"><CLabel className="form-label">User Code</CLabel></CCol>
                    <CCol lg="8">
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CImg src='./image/user.png' width={20} height={20}></CImg>
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput className="login-input" placeholder='Enter User Code' type='text' 
                        autoFocus value={userCode} onChange={userCodeChange} onKeyDown={keyEnter}>
                        </CInput>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  
                  <CRow className="align-items-center mt-3">
                    <CCol lg="4"><CLabel className="form-label">Password</CLabel></CCol>
                    <CCol lg="8">
                    <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CImg src='./image/password.png' width={20} height={20}></CImg>
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput className="login-input" placeholder='Enter Password' type='password'
                         value={password} onChange={passwordChange} onKeyDown={keyEnter}>
                        </CInput>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <br></br>
                  <br></br>
                  <CRow alignHorizontal='center' className="mb-4">
                    <CButton id="login" className='form-btn login-btn' 
                     onClick={loginClick} onKeyDown={keyEnter}>Login
                    </CButton>
                  </CRow>
              
            
                </CCardBody>
              </CCard>

</CCol>

  <CCol lg="3"></CCol>
    </CRow>
    </div>

    </>  
            
  )
}

export default LoginForm
