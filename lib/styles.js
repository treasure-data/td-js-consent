import { css } from 'lit-element'

export const formStyles = css`
  :host {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(67, 90, 111, 0.5);

    font-family: Arial, sans-serif;
    line-height: normal;
    font-size: 16px;
    overflow-y: auto;
  }

  h3 {
    margin: 0;
    padding: 0;
  }

  .dialog-content {
    width: 750px;
    max-width: calc(100vw - 16px);

    background-color: white;
    border-radius: 8px;
    margin: 8px;
  }
  .dialog-content .dialog-title,
  .dialog-content .dialog-description,
  .dialog-content .dialog-consents,
  .dialog-content .dialog-actions {
    padding: 15px;
  }

  .dialog-content .dialog-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(67, 90, 111, 0.2);
  }

  .dialog-content .dialog-title button {
    border-style: none;
    outline: none;
    background: none;
    padding: 8px;
    color: black;
    cursor: pointer;
  }

  .dialog-content .dialog-actions {
    display: flex;
    justify-content: flex-end;
  }

  .dialog-actions button {
    border-radius: 4px;
    border-width: 1px;
    border-color: rgba(67, 90, 111, 0.2);
    outline: none;
    padding: 0 15px;
    cursor: pointer;
    height: 32px;
  }

  .dialog-actions button:not(:first-child) {
    margin-left: 8px;
  }

  .dialog-actions button.primary {
    background-color: #47b881;
  }

  .dialog-actions button.secondary {
    background-color: #ffffff;
  }

  .context-wrapper h3 {
    padding: 3px 0;
  }

  .context-wrapper:not(:first-of-type) {
    margin-top: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  table th {
    background-color: #f7f8fa;
  }

  table th,
  table td {
    padding: 8px 12px;
    border: 1px solid rgba(67, 90, 111, 0.2)
  }

  table td label {
    display: block;
    white-space: nowrap;
    margin-botton: 5px;
  }
`
export const bannerStyles = css`
  .consent-popup {
    position: relative;
    padding: 15px;
    text-align: center;
    font-family: Arial, sans-serif;
  }

  .consent-popup a {
    text-decoration: underline;
    cursor: pointer;
    color: inherit;
  }

  .consent-popup button {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 3px;
    margin-right: 3px;
    border-style: none;
    outline: none;
    background: none;
    padding: 8px;
    color: black;
    cursor: pointer;
  }
`
