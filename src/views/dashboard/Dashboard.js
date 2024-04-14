import React, { lazy, useEffect, useState } from 'react';
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router';
import { ApiRequest } from '../common/ApiRequest';
import SuccessError from '../common/SuccessError';
import Chart from 'react-apexcharts';
import NPagination from '../common/pagination/NPagination';

const Dashboard = () => {

  
  
  const history = useHistory();

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  })

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState();
  const [total, setTotal] = useState("");
  const [totalRow, setTotalRow] = useState("");
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [lastPage, setLastPage] = useState("");
  
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
//pagination function
  const pagination = (i) => {
    setCurrentPage(i);
    tempSearch(i);
  }

  const tempSearch = async (page = 1)=> {
    let search = {
      method: "get",
      url: `admin/get?page=${page}`,
      // params: {
      //   name: userName,
      //   password: password,
      // },
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

  const search = async (page = 1) => {

    let search = {
      method: "get",
      url: `admin/get?page=${page}`,
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setAdmin([]);
      setSuccess(response.message);
      setError([]);
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

  return (
    <>
     
     <CRow className="mt-3">
        <CCol xs="12">
          <CCard>
            <SuccessError success={success} error={error} />
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
                              <th className="text-center" width={50} >No</th>
                              <th className='text-center' width={120}>UserName</th>
                              <th className='text-center' width={120}>UserCode</th>
                              <th className='text-center' width={120}>Password</th>
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

      {total > 10 &&
        <NPagination
          activePage={currentPage}
          pages={lastPage}
          currentPage={currentPage}
          totalPage={lastPage}
          pagination={pagination}
        />
      }

      <div className="app mt-4">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={chartData.options} series={chartData.series} type="bar" width="500"
          />
        </div>
      </div>
    </div>
    
    </>
  )
}

export default Dashboard
