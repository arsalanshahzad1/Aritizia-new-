import React from 'react'

function EmailMasked({ email }) {
    const maskEmail = (email) => {
        const atIndex = email.indexOf('@');
        if (atIndex < 0) return email;
    
        const firstPart = email.slice(0, 1);
        const maskedPart = '**';
        const lastPart = email.slice(atIndex);
        return `${firstPart}${maskedPart}${lastPart}`;
      };
    
      const maskedEmail = maskEmail(email);
    
      return maskedEmail;
}

export default EmailMasked