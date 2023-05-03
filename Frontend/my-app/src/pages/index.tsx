import ButtonLink from '@/components/ButtonLink'
import React from 'react'

const App = () => {
  return (
    <>
      <div>BUS-BOS</div>
      <div className='flex flex-col flex-wrap sm:flex-row gap-2 items-center justify-center'>
              <ButtonLink link='Find' title="Cari Bus"/>
              <ButtonLink link='about' title="Tentang Kami"/>
      </div>
    </>
  )
}

export default App

// import React, { useEffect, useState } from 'react';

// const App = () => {
//   const [data, setData] = useState({ members: [] });
//   const [isLoading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     fetch('http://localhost:5000/members')
//       .then(res => {
//         if (!res.ok) {
//           throw new Error('Failed to fetch members');
//         }
//         return res.json();
//       })
//       .then(data => {
//         setData(data);
//         setLoading(false);
//       })
//       .catch(error => {
//         setError(error.message);
//         setLoading(false);
//       });
//   }, []);

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       <h1>Members</h1>
//       <ul>
//         {data.members.map((member, index) => (
//           <li key={index}>{member}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default App;