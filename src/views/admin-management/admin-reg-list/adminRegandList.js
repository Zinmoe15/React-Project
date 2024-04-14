import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CImg,
  CInput,
  CRow,
  CSelect
} from '@coreui/react'
import { useHistory } from 'react-router'
import Loading from "../../common/Loading";
import SuccessError from "../../common/SuccessError";
import { ApiRequest } from "../../common/ApiRequest";
import NPagination from '../../common/pagination/NPagination';
import { nullChk, validateName, validatePwd } from '../../common/CommonValidation';
import Confirmation from '../../common/ConfirmMessage';
import Dropzone from "react-dropzone";

const AdminRegAndListIndex = () => {
  const [files, setFiles] = useState([]);
  const handleDrop = (acceptedFiles)=>{
  setFiles(acceptedFiles);
}
const removeFile=()=>{
  setFiles([]);
}
  const history = useHistory();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState([])
  const [totalRow, setTotalRow] = useState(""); // for user list table rows
  const [currentPage, setCurrentPage] = useState(); // for user list table current page
  const [lastPage, setLastPage] = useState(""); // for user list table last page
  const [updateID, setUpdateID] = useState("");
  const [loading, setLoading] = useState(false); // For Loading
  const [updateStatus, setUpdateStatus] = useState(false); //for update status
  const [error, setError] = useState([]); // for error message
  const [success, setSuccess] = useState([]); // for success message
  const [total, setTotal] = useState(""); // total rows
  const [confirmation, setConfirmation] = useState(false);
  const [content, setContent] = useState("");
  const [confirmType, setConfirmType] = useState("");
  const [del, setDel] = useState("");

  useEffect(() => {
    let flag = localStorage.getItem(`LoginProcess`)
    if (flag == "true") {
      console.log("Login process success")
    } else {
      history.push(`/Login`);
    }
    
    (async () => {
      setLoading(true);
      await search();
      setLoading(false);
    })();
    
  }, []);

  // pagination function
  const pagination = (i) => {
    setCurrentPage(i);
    tempSearch(i);
  }
  
  
  
  const search = async (page = 1) => {

    let search = {
      method: "get",
      url: `admin/get?page=${page}`,
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setAdmin([]);
      setError(response.message);
    } else {
      if (response.data.status === "OK") {
        setAdmin(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setTotal(response.data.data.total);
        
      } else {
        setError([response.data.message]);
        setAdmin([]);
      }
    }
    
  }
  
  const tempSearch = async (page = 1)=> {
    let search = {
      method: "get",
      url: `admin/get?page=${page}`,
      params: {
        name: userName,
        password: password,
      },
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setAdmin([]);
    } else {
      if (response.data.status === "OK") {
        setAdmin(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setTotal(response.data.data.total);
        
      } else {
        setError([response.data.message]);
        setAdmin([]);
      }
    }
  }

  
  
  
  const userNameChange = (e) => {
    setUserName(e.target.value);
  }
  
  const passwordChange = (e) => {
    setPassword(e.target.value);
  }
  
  const reset = () => {
    setUserName("");
    setPassword("");
  }
  
  const EnterKey = (e)=>{
    if (e.key == "Enter"){
      saveClick();
      e.preventDefault();
    }
  }
  
  
  
  
  const saveClick = async () => {
    setSuccess([]);
    setError([]);
    let err=[];
    if (!nullChk(userName)){
      err.push("Please Fill Your UserName");
    }else if(!validateName(userName)){
      err.push("Please Fill Only Number In Your UserName");
    }
  
    if (!nullChk(password)){
      err.push("Please Fill Your Password");
    }else if(!validatePwd(password)){
      err.push("Please Fill Strong Password In Your Password");
    }
    setLoading(false);

    if (err.length <= 0){
      setLoading(true);
      setUpdateStatus(false);
      let saveData = {

        method: "post",
        url: `admin/save`,
        params: {
          name: userName,
          password: password,
        },
      };
      let response = await ApiRequest(saveData);
      if (response.flag === false) {
        setError(response.message);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } else {
        if (response.data.status == "OK") {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          setSuccess([response.data.message]);
          reset();
          search();
          setError([]);
        } else {
          setError([response.data.message]);
          setSuccess([]);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }
      setSuccess(["Successfully Save"]);
    }else {
      setError(err)
    }
  }

  const editClick = async (id) => {
    setLoading(true);
    setUpdateStatus(true);
    setUpdateID(id);
    let saveData = {
      method: "get",
      url: `admin/edit/${id}`,
    };
    let response = await ApiRequest(saveData);
    if (response.flag === false) {
      setError(response.message);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setUserName(response.data.data.name);
        setPassword(response.data.data.password);
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);
  }

  const delClick = (d) => {
    setConfirmation(true);
    setContent("Are You Sure want to Delete?");
    setConfirmType("delete");
    setDel(d);
  }
  const deleteOK =async()=>{
    setLoading(true);
    let deleteData = {
      method: "delete",
      url: `admin/delete/${del}` ,
    };
    let response = await ApiRequest(deleteData);
    setLoading(false);
    if (response.flag === false) {
      setSuccess([]);
      setError(response.message);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status === "OK") {
        setConfirmation(false);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        let page = currentPage;
        setSuccess([response.data.message]);
        if (admin.length - 1 == 0) {
          page = currentPage - 1;
        }
        search(page);
        setError([]);
        
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setError([response.data.message]);
        setSuccess([]);
      }
    }
    
  }


  const updateClick = async () => {
    setConfirmation(true);
    setContent("Are You Sure Want to Update?");
    setConfirmType('update');
 
  }
 console.log(updateID)
  const updateOK =async()=>{
    
    setLoading(true);
    setUpdateStatus(false);
    let saveData = {
      method: "post",
      url: `admin/update/${updateID}`,
      params: {
        name: userName,
        password: password,
      },
    };
    let response = await ApiRequest(saveData);
    if (response.flag === false) {
      setError(response.message);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") {
        setSuccess([response.data.message]);
        reset();
        search();
        setConfirmation(false);
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);
  }

  return (
    <>
      <CRow>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps })=>(
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <CInput type="text" readOnly placeholder="Click here to attach file" />
          </div>
        )}
      </Dropzone>
      <div style={{ display: "flex", marginTop: "20px"}}>
          {files.map((a)=>(
            <>
              <li style={{ marginTop:"5px" }} key={a.name}>{a.name}</li>
                <label style={{ marginLeft:"20px", color:"red", cursor:"pointer", marginTop:"7px"}}
                 onClick={removeFile}>X</label>
            </>
          ))}
      </div>
      </CRow>
      
      <CRow>
        <CCol xs="12 mt-3">

          <CCard>
            <CCardHeader>
              <h4 className='m-0'>Admin Registeration</h4>
            </CCardHeader>
            <SuccessError success={success} error={error} />
            <CCardBody className="table-body">

              <CRow style={{ marginTop: "10px" }}>
                <CCol lg="6">
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3">
                      <p className='mt-2'>UserName</p>
                    </CCol>
                    <CCol lg="7">
                      <CInput type="text" value={userName} onChange={userNameChange} onKeyDown={EnterKey} />
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>


                </CCol>


                <CCol lg="6">
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3">
                      <p className='mt-2'>Password</p>
                    </CCol>
                    <CCol lg="7">
                      <CInput type="password" value={password} onChange={passwordChange} onKeyDown={EnterKey} />
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>

                </CCol>

              </CRow>
              <CRow style={{ justifyContent: "center" }} className="mt-4">
              {updateStatus == false && (
                  <CButton className="form-btn" onClick={saveClick} onKeyDown={EnterKey}>
                    Save
                  </CButton>
                )}
              {
                  updateStatus == true && (
                    <CButton className="form-btn" onClick={updateClick}>
                      Update
                    </CButton>
                  )}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


      <CRow className="mt-3">
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <h4 className='m-0'>Admin List</h4>
            </CCardHeader>
            <CCardBody className="table-body">
              <CRow>
                <CCol>
                  {admin.length > 0 && (
                    <>
                      <p className='mb-0 font-weight-bold'>Total : {totalRow} row(s)</p>
                      <div className='overflow'>
                        <table className='emp-list-table table table-striped'>
                          <thead>
                            <tr>
                              <th className="text-center" width={60} >No</th>
                              <th className='text-center' width={250}>UserName</th>
                              <th className='text-center' width={250}>UserCode</th>
                              <th className='text-center' width={250}>Password</th>
                              <th className='text-center' width={85} colSpan={2} >Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admin.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td width={50} className="text-center">{index + 1}</td>
                                  <td className="text-center" width={120}>{data.name}</td>
                                  <td className="text-center" width={120}>{data.user_code}</td>
                                  <td className="text-center" width={120}> {data.password}</td>
                                  <td style={{ border: "1px solid" , textAlign:"center"}}>
                                    <div className="user-before">
                                      <CImg
                                        src="/image/Edit-Component-inactive.svg"
                                        onClick={() => {
                                          editClick(data.id);
                                        }}
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          cursor: "pointer",
                                        }}
                                      ></CImg>
                                      <CImg
                                        className="user-after"
                                        src="/image/Edit-Component-active.svg"
                                        onClick={() => { 
                                          editClick(data.id);
                                        }}
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          cursor: "pointer",
                                        }}
                                      ></CImg>
                                    </div>
                                  </td>

                                  <td style={{ border: "1px solid" , textAlign:"center"}}>
                                    <div className="user-before">
                                      <CImg
                                        src="/image/Delete-Component-inactive.svg"
                                        onClick={() => delClick(data.id)}
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          cursor: "pointer",
                                        }}
                                      ></CImg>
                                      <CImg
                                        className="user-after"
                                        src="/image/Delete-Component-active.svg"
                                        onClick={() => delClick(data.id)}
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          cursor: "pointer",
                                        }}
                                      ></CImg>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <Confirmation
      admin={admin}
      show={confirmation}
      content={content}
      type={confirmType}
      deleteOK={deleteOK}
      updateOK={updateOK}
      cancel={() => setConfirmation(false)}
      cancelButton="No"
      okButton="Yes"
      />
      {total > 10 &&
        <NPagination
          activePage={currentPage}
          pages={lastPage}
          currentPage={currentPage}
          totalPage={lastPage}
          pagination={pagination}
        />
      }

    </>
  )
}

export default AdminRegAndListIndex