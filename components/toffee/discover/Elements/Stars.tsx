import React from 'react';

const StarsIcon = ({ className }: {className: string}) => (
  <svg 
    width="25" 
    height="24" 
    viewBox="0 0 25 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M16.2505 3.90601L17.2396 5.76062L19.0942 6.74976L17.2396 7.73889L16.2505 9.5935L15.2613 7.73889L13.4067 6.74976L15.2613 5.76062L16.2505 3.90601ZM9.50049 6.24976L11.5005 9.99976L15.2505 11.9998L11.5005 13.9997L9.50049 17.7497L7.50049 13.9997L3.75049 11.9998L7.50049 9.99976L9.50049 6.24976ZM18.2505 15.2497L17.0005 12.906L15.7505 15.2497L13.4067 16.4998L15.7505 17.7497L17.0005 20.0935L18.2505 17.7497L20.5942 16.4998L18.2505 15.2497Z" 
      fill="white" 
    />
  </svg>
);

export default StarsIcon;