import React, { useState, useEffect, useRef } from 'react';

function Dropdown({name, filterTags, allTags, addRemoveTag}) {
  const [display, setDisplay] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDisplay = () => {
    setDisplay(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDisplay(false);
    }
  };

  useEffect(() => {
    if (display) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [display]);

  useEffect(() => {
    filterTags.forEach((tag) => {
      if (document.getElementById(tag)) {
        document.getElementById(tag).style.backgroundColor = "#77AD78";
      }
    })
  }, [filterTags, display]);

  return (
    <div className='input-group' style={{ width: '18em' }} ref={dropdownRef}>
      <span className='input-group-text'>{name}</span>
      <div className='form-control dropdown'>
        <div className='dropdown-text' onClick={toggleDisplay}>
          {filterTags.filter(tag => allTags.includes(tag)).join(', ') || 'none'}
        </div>
        {display && (
          <div className="dropdown-content select-tag-options">
            {allTags.map((tag) => (
              <div key={tag} className='select-tag' id={tag} onClick={() => addRemoveTag(tag)}>
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
