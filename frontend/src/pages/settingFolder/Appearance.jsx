import React, { useState } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const Appearance = () => {
  const [language, setLanguage] = useState({ value: 'one', label: 'English' });
  const [scheme, setScheme] = useState({ value: 'one', label: 'Default Screen' });

  const languageOptions = [
      { value: 'one', label: 'English' },
      { value: 'two', label: 'Chinese' },
      { value: 'three', label: 'Spanish' },
  ]
  const SchemeOptions = [
      { value: 'one', label: 'Default Screen' },
      { value: 'two', label: 'Default Screen' },
      { value: 'three', label: 'Default Screen' },
  ]
  return (
    <div className="col-lg-8 mx-auto">
      <div className="row">
        <div className="col-lg-12">
          <div className="apperance-section-wrap">
            <h2>Language</h2>
            <p>Select your prefered language.</p>
            <Dropdown options={languageOptions} onChange={(e) => { setLanguage(e) }} value={language.label} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="apperance-section-wrap">
            <h2>Scheme</h2>
            <p>Customize how Artizia looks for you.</p>
            <Dropdown options={SchemeOptions} onChange={(e) => { setScheme(e) }} value={scheme.label} />
          </div>
        </div>
      </div>
      <div className="row">
          <div className="appearance-button-styling">
            <button className="button-styling">Update Profile</button>
          </div>
        </div>
    </div>
  )
}

export default Appearance