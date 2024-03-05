import UserCourse from './UserCourse.jsx'
import { useEffect, useState } from 'react';

export default function App() {
  const [companyAddress, setCompanyAddress] = useState('');

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    setCompanyAddress(params.get('user'));
  }, []);
  
  return (
    <>
      <div className='flex pt-24 flex-col items-center gap-16 max-w-screen-xl mx-auto px-4'>
        <div className='flex flex-col items-center gap-4'>
          <h1>Secret Email Service</h1>
          <p className='text-center text-balance'>iExec creates the technologies for individuals and organizations to create, protect and develop their digital estate.</p>
        </div>
        {companyAddress ? (
          <div className="card">
            <div className='grid gap-4'>
              <h2>Grant Access</h2>
              <p>
                <span className='text-primary underline'>
                  {companyAddress} 
                </span> would like to get access to you, using iExec secured email service.
              </p>
            </div>
            <div className='grid gap-4'>
              <UserCourse companyAddress={companyAddress} />
            </div>
          </div>
        ) : (
          <div className="card">
            <div className='grid gap-4'>
              <h2>Grant Access</h2>
              <p className='text-super-red'>
                You must use a link provided by the company to access this page.
              </p>
            </div>
          </div>
          
        )}
      </div>
    </>
  )
}
