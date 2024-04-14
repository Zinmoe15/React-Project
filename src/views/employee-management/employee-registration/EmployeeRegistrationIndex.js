import React, { useEffect, useState } from 'react'
import { CButton,CCard,CCardBody,CCardHeader,CCol,CInput,CRow,CSelect } from '@coreui/react';
import { useHistory } from 'react-router'
import DatePicker from '../../common/datepicker/DatePicker';
import Loading from "../../common/Loading";
import SuccessError from "../../common/SuccessError"; 
import { ApiRequest } from "../../common/ApiRequest";
import moment from "moment";
import { nullChk, validateEmail, validateName } from '../../common/CommonValidation';
import Confirmation from '../../common/ConfirmMessage';

const EmployeeRegistrationIndex = () => {
  const history = useHistory();
  const [genderData, setGenderData] = useState([
    { id: "1", name: "Male" },
    { id: "2", name: "Female" },
    { id: "3", name: "Other" },
  ]);
  const [englishSkillData, setEnglishSkill] = useState([
    { id: "1", name: "Elementary" },
    { id: "2", name: "Intermediate" },
    { id: "3", name: "Advanced" },
    { id: "4", name: "Proficient" },

  ]);
  const [japaneseSkill, setJapaneseSkill] = useState([
    { id: "1", name: "N1" },
    { id: "2", name: "N2" },
    { id: "3", name: "N3" },
    { id: "4", name: "N4" },
    { id: "5", name: "N5" },
  ]);

  const [fromDate, setFromDate] = useState(null); // for from date
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [selectJapan, setSelectJapan] = useState("");
  const [selectEng, setSelectEng] = useState("");
  const [selectGender, setSelectGender] = useState("");
  const [updateID, setUpdateID] = useState(localStorage.getItem(`Update`));
  const [loading, setLoading] = useState(false); // For Loading
  const [updateStatus, setUpdateStatus] = useState(false); //for update status
  const [error, setError] = useState([]); // for error message
  const [success, setSuccess] = useState([]); // for success message
  const [confirmation, setConfirmation] = useState(false);
  const [content, setContent] = useState("");
  const [confirmType, setConfirmType] = useState("");

  const EnterKey = (e)=>{
    if (e.key == "Enter"){
      saveClick();
      e.preventDefault();
    }
  }

  useEffect(()=> {
    let flag = localStorage.getItem(`LoginProcess`);
    let updateFrom = localStorage.getItem(`Update`); 
    localStorage.removeItem('Update');
    setUpdateID(updateFrom);
    if (flag == "true") {
    
       if(updateFrom != null){
          formload();  //for api
          setUpdateStatus(true);
       }
    } else {
      history.push('/Login');
    }
  },[])


  const userNameChange = (e) => {
    setUserName(e.target.value);
  }

  const emailChange = (e) => {
    setEmail(e.target.value);
  }

  const selectJapanChange = (e) => {
    setSelectJapan(e.target.value);
  }

  const selectEngChange = (e) => {
    setSelectEng(e.target.value);
  }

  const selectGenderChange = (e) => {
    setSelectGender(e.target.value);
  }

  const fromDateChange = (e) => {
    let date = "";
    date = moment(e).format("YYYY-MM-DD");
    setFromDate(date);
  }
  
   const formload = async() => {
    setLoading(true);
    setUpdateStatus(false);
    let saveData = {
      method: "get",
      url: `employee/edit/${updateID}`,
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
        setEmail(response.data.data.email);
        setSelectJapan(response.data.data.japanese_skill)
        setSelectEng(response.data.data.english_skill)
        setFromDate(response.data.data.date_of_birth)
        setSelectGender(response.data.data.gender)
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);
   }

   const reset =() => {
    setUserName("");
    setEmail("");
    setSelectJapan("");
    setSelectEng("");
    setFromDate(null);
    setSelectGender("");
   }

  const updateClick = async() => {
    setConfirmation(true);
    setContent("Are You Sure Want to Update?");
    setConfirmType("update");
 }

 const updateOK =async()=>{
  let saveData = {
    method: "post",
    url: `employee/update/${updateID}`,
    params: {
        name : userName,
        email : email,
        japanese_skill : selectJapan,
        english_skill : selectEng,
        gender : selectGender,
        date_of_birth:fromDate,
    },
  };
  let response = await ApiRequest(saveData);
  if (response.flag === false) {
    setError(response.message);
    setSuccess([]);
  } else {
    if (response.data.status == "OK") {
      setConfirmation(false);
      setSuccess([response.data.message]);
      setError([]);
      reset();
    } else {
      setError([response.data.message]);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }
  setLoading(false);
 }

  const saveClick = async() => {
    let errMsg = [];
    if (!nullChk(userName)){
      errMsg.push("Please fill your userName");
    }else if (!validateName(userName)) {
      errMsg.push("Please fill only name in your name");
    }

    if (!nullChk(email)) {
      errMsg.push("Please fill your email");
    }else if (!validateEmail(email)) {
      errMsg.push("Please fill strong email in your email");
    }

    if (!nullChk(selectJapan)){
      errMsg.push("Please fill your Japan option");
    }

    if (!nullChk(selectEng)) {
      errMsg.push("Please fill your Eng option");
    }

    if (!nullChk(selectGender)) {
      errMsg.push("Please fill your selectGender");
    }

    if (!nullChk(fromDate)) {
      errMsg.push("Please fill your Formdate");
    }

     setLoading(true);
     setUpdateStatus(false);
     let saveData = {
       method: "post",
       url: `employee/save`,
       params: {
           name : userName,
           email : email,
           japanese_skill : selectJapan,
           english_skill : selectEng,
           gender : selectGender,
           date_of_birth:fromDate,
       },
     };
     let response = await ApiRequest(saveData);
     if (response.flag === false) {
         setError(response.message);
         window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
         //setSuccess([]);
     } else {
       if (response.data.status == "OK") {
         //setSuccess([response.data.message]);
         window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
         reset();
         setError([]);
       } else {
         setError([response.data.message]);
         window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
         setSuccess([]);
       }
     }
     setLoading(false);

    if (errMsg.length <= 0){
    setSuccess (["Successfully Save"])
    }else {
    setError(errMsg)
    }
  }


  return (
    <>
      <CRow>
        <CCol xs="12">
        <SuccessError success={success} error={error} />
          <CCard>
            <CCardHeader>
              <h4 className='m-0'>Employee Registeration</h4>
            </CCardHeader>
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
                  <br></br>
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3"><p className='mt-2'>Gender</p></CCol>
                    <CCol lg="7">
                      <CSelect
                        value={selectGender} onChange={selectGenderChange} onKeyDown={EnterKey}>
                        <option value="">-- Select --</option>
                        {genderData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.name}
                            >
                              {data.name}
                            </option>
                          )
                        }
                        )}
                      </CSelect>
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>
                  <br></br>

                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3"><p className='mt-2'>English Skill</p></CCol>
                    <CCol lg="7">
                      <CSelect
                        value={selectEng} onChange={selectEngChange} onKeyDown={EnterKey}>
                        <option value="">-- Select --</option>
                        {englishSkillData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.name}
                            >
                              {data.name}
                            </option>
                          )
                        }
                        )}
                      </CSelect>
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>
                  <br></br>
                
                </CCol>


                <CCol lg="6">
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3">
                      <p className='mt-2'>Email</p>
                    </CCol>
                    <CCol lg="7">
                      <CInput type="text" value={email} onChange={emailChange} onKeyDown={EnterKey} />
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>
                  <br></br>
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3">
                      <p className='mt-2'>Date of Birth</p>
                    </CCol>
                    <CCol lg="7">
                      <DatePicker value={fromDate} change={fromDateChange} onKeyDown={EnterKey} maxDate={new Date()} />
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>
                  <br></br>
                  <CRow style={{ marginTop: "1px" }}>
                    <CCol lg="1"></CCol>
                    <CCol lg="3"><p className='mt-2'>Japanese Skill</p></CCol>
                    <CCol lg="7">
                      <CSelect
                        value={selectJapan} onChange={selectJapanChange} onKeyDown={EnterKey}>
                        <option value="">-- Select --</option>
                        {japaneseSkill.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.name}
                            >
                              {data.name}
                            </option>
                          )
                        }
                        )}
                      </CSelect>
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>
                  <br></br>

                  
                </CCol>

              </CRow>
              <CRow style={{ justifyContent: "center", marginTop: "30px" }}>
{ updateStatus == false && (
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
      <Confirmation
      show={confirmation}
      content={content}
      type={confirmType}
      updateOK={updateOK}
      cancel={() => setConfirmation(false)}
      cancelButton="No"
      okButton="Yes"
      />
      <Loading start={loading} />

    </>
  )
}

export default EmployeeRegistrationIndex