import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
 import {ApiRequest} from '../../common/ApiRequest';
import EmployeeListForm from './EmployeeListForm';
import { useHistory } from 'react-router-dom';
import Loading from "../../common/Loading";
import SuccessError from "../../common/SuccessError"; 
import Confirmation from '../../common/ConfirmMessage';
import { nullChk, validateName } from '../../common/CommonValidation';

const EmployeeListIndex = () => {
  const [confirmation,setConfirmation]=useState(false);
  const [content,setContent]=useState("");
  const [confirmType,setConfirmType]=useState("");
  const [success, setSuccess] = useState([]); // for success message
  const [error, setError] = useState([]); // for error message
  const [loading, setLoading] = useState(false); // for loading condition
  const [employeeList, setEmployeeList] = useState([]); // for user list table data
  const [dID, setDID] = useState("");
  const [currentPage, setCurrentPage] = useState(); // for user list table current page
  const [lastPage, setLastPage] = useState(""); // for user list table last page
  const [genderData, setGenderData] = useState([
    { id: "0", name: "All" },
    { id: "1", name: "Male" },
    { id: "2", name: "Female" },
    { id: "3", name: "Other" },
  ]);
  const [selectGender, setSelectGender] = useState("");
  const [userName, setUserName] = useState("");
  const [total, setTotal] = useState(""); // total rows
 let history =useHistory();
 
  
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

  const search = async (page = 1)=> {
    setError([])
    let search = {
      method: "get",
      url: `employee/search?page=${page}`,
      params: {
        name: userName,
        gender: selectGender,
      },
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setEmployeeList([]);
      setError(response.message);
    } else {
      if (response.data.status === "OK") {
          setEmployeeList(response.data.data.data);
          setCurrentPage(response.data.data.current_page);
          setLastPage(response.data.data.last_page);
          setTotal(response.data.data.total);
        
      } else {
        setError([response.data.message]);
        setEmployeeList([]);
      }
    }

  }


  const tempSearch = async (page = 1)=> {
    let search = {
      method: "get",
      url: `employee/search?page=${page}`,
      params: {
        name: userName,
        gender: selectGender,
      },
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setEmployeeList([]);
    } else {
      if (response.data.status === "OK") {
          setEmployeeList(response.data.data.data);
          setCurrentPage(response.data.data.current_page);
          setLastPage(response.data.data.last_page);
          setTotal(response.data.data.total);
        
      } else {
        setEmployeeList([]);
      }
    }

  }

  const searchClick = () => {
    let errMsg = [];
    if (!nullChk(userName)){
      errMsg.push("Please Fill Your Name");
    }else if (!validateName(userName)){
      errMsg.push("Please fill only name in your UserName");
    }

    if (!nullChk(selectGender)){
      errMsg.push("Fill Your Gender");
    }

    if (errMsg.length <= 0){
      setSuccess(["Successfully Search"])
    }else {
      setError(errMsg)
    }
    //search();
  }

  // pagination function
  const pagination = (i) => {
    setCurrentPage(i);
    tempSearch(i);
  }

  const editClick = (id) => {
      history.push('/employee-management/employee-register');
      localStorage.setItem("Update",id);
  }

  const delClick = (k) => {
    setConfirmation(true);
    setContent("Are You sure wanna Delete?");
    setConfirmType("delete");
    setDID(k);
   
   
  }
  const deleteOK=async()=>{
   
    setLoading(true);
    let deleteData = {
      method: "delete",
      url: `employee/delete/${dID}` ,
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
        if (employeeList.length - 1 == 0) {
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

  const userNameChange = (e) => {
    setUserName(e.target.value);
  }
  const selectGenderChange = (e) => {
    setSelectGender(e.target.value);
  }
  

  return (
    <>
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
           <h4 className='m-0'>Employee List</h4>
          </CCardHeader>
          <CCardBody className="table-body">
          <SuccessError success={success} error={error} />
            <EmployeeListForm
            employeeList = {employeeList}
            total = {total}
            currentPage = {currentPage}
            lastPage = {lastPage}
            userName = {userName}
            userNameChange={userNameChange}
            genderData={genderData}
            selectGenderChange={selectGenderChange}
            selectGender={selectGender}
            pagination ={pagination}
            searchClick ={searchClick}
            editClick = {editClick}
            delClick = {delClick}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <Confirmation
      show={confirmation}
      content={content}
      type={confirmType}
      deleteOK={deleteOK}
      cancel={() => setConfirmation(false)}
      cancelButton="No"
      okButton="Yes"
    />
    <Loading start={loading} />
    </>
  )
}

export default EmployeeListIndex
