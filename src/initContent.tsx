import React from 'react';
import { render } from 'react-dom';
import Hello from './components/Hello';

const initContent = () => {
  render(<Hello />, document.querySelector('#App'));
};

export default initContent;
