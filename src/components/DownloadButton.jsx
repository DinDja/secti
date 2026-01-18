import React from 'react';

const DownloadButton = ({ isDownloading, onToggle }) => (
  <div className="dl-container">
    <label className="dl-label">
      <input
        type="checkbox"
        className="dl-input"
        checked={isDownloading}
        onChange={onToggle}
      />
      <span className="dl-circle">
        <svg
          className="dl-icon"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 19V5m0 14-4-4m4 4 4-4"
          ></path>
        </svg>
        <div className="dl-square"></div>
      </span>
      <p className="dl-title">Download</p>
      <p className="dl-title">Pronto</p>
    </label>
  </div>
);

export default DownloadButton;