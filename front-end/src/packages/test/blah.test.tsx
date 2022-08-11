import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import { Thing } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<React.Fragment />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
